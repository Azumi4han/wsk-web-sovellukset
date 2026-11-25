import {useState} from 'react';
import {useNavigate} from 'react-router';
import {useFile, useMedia} from '../hooks/apiHooks';
import useForm from '../hooks/formHooks';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const {postFile} = useFile();
  const {postMedia} = useMedia();
  const navigate = useNavigate();
  const initValues = {title: '', description: ''};

  const handleFileChange = (evt) => {
    if (evt.target.files) {
      const chosenFile = evt.target.files[0] || null;
      console.log(chosenFile);
      setFile(chosenFile);
      // make the preview link once here, not on every render,
      // so a video does not restart while the user types the title
      setPreviewUrl(chosenFile ? URL.createObjectURL(chosenFile) : null);
    }
  };

  const doUpload = async (inputs) => {
    try {
      setError('');
      setUploading(true);
      const token = localStorage.getItem('token');
      // 1. send the file to the upload server
      const fileResult = await postFile(file, token);
      // 2. save title, description and file info to the media api
      await postMedia(fileResult.data, inputs, token);
      // 3. go to the home page where the new media is listed
      navigate('/');
    } catch (e) {
      setError(e.message);
      setUploading(false);
    }
  };

  const {inputs, handleInputChange, handleSubmit} = useForm(
    doUpload,
    initValues,
  );

  return (
    <>
      <h2>Upload</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            name="title"
            type="text"
            id="title"
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            rows={5}
            id="description"
            onChange={handleInputChange}
          ></textarea>
        </div>
        <div>
          <label htmlFor="file">File</label>
          <input
            name="file"
            type="file"
            id="file"
            accept="image/*, video/*"
            onChange={handleFileChange}
          />
        </div>
        {file && file.type.startsWith('video/') ? (
          <video src={previewUrl} width="200" controls></video>
        ) : (
          <img
            src={previewUrl || 'https://placehold.co/200?text=Choose+image'}
            alt="preview"
            width="200"
          />
        )}
        {error && <p className="error">{error}</p>}
        <button
          type="submit"
          disabled={!file || inputs.title.length <= 3 || uploading}
        >
          {uploading ? 'Uploading…' : 'Upload'}
        </button>
      </form>
    </>
  );
};

export default Upload;
