import {useLocation, useNavigate} from 'react-router';

const Single = () => {
  const {state: item} = useLocation();
  const navigate = useNavigate();

  if (!item) {
    return (
      <>
        <h2>No media selected</h2>
        <p>Choose a media item on the home page</p>
        <button type="button" className="back" onClick={() => navigate('/')}>
          Go home
        </button>
      </>
    );
  }

  return (
    <article className="single">
      <header>
        <h2>{item.title}</h2>
        <button type="button" className="back" onClick={() => navigate(-1)}>
          Go back
        </button>
      </header>

      {item.media_type.startsWith('image/') ? (
        <img src={item.filename} alt={item.title} />
      ) : (
        <video src={item.filename} controls></video>
      )}

      <p>{item.description || 'No description'}</p>

      <dl>
        <dt>Owner</dt>
        <dd>{item.username ?? `User ${item.user_id}`}</dd>
        <dt>Type</dt>
        <dd>{item.media_type}</dd>
        <dt>Size</dt>
        <dd>{item.filesize} bytes</dd>
        <dt>Created</dt>
        <dd>{new Date(item.created_at).toLocaleString('fi-FI')}</dd>
      </dl>
    </article>
  );
};

export default Single;
