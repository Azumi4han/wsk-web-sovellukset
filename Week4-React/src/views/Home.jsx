import {useEffect, useState} from 'react';
import MediaRow from '../components/MediaRow';
import {fetchData} from '../utils/fetchData';

const mediaApi = import.meta.env.VITE_MEDIA_API;
const authApi = import.meta.env.VITE_AUTH_API;

const Home = () => {
  const [mediaArray, setMediaArray] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMedia = async () => {
      try {
        const media = await fetchData(`${mediaApi}/media`);

        // Cache user requests so that each user is fetched only once
        const users = new Map();

        const mediaWithUsers = await Promise.all(
          media.map(async (item) => {
            if (!users.has(item.user_id)) {
              users.set(
                item.user_id,
                fetchData(`${authApi}/users/${item.user_id}`),
              );
            }

            try {
              const user = await users.get(item.user_id);
              return {...item, username: user.username};
            } catch {
              return {...item, username: 'Unknown'};
            }
          }),
        );

        setMediaArray(mediaWithUsers);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    getMedia();
  }, []);

  return (
    <>
      <h2>My Media</h2>

      {error && (
        <p className="error">
          Failed to load media: {error}. Connect to the Metropolia network or
          VPN and try again
        </p>
      )}

      <table>
        <thead>
          <tr>
            <th>Thumbnail</th>
            <th>Title</th>
            <th>Description</th>
            <th>Created</th>
            <th>Size</th>
            <th>Type</th>
            <th>Owner</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {mediaArray.map((item) => (
            <MediaRow key={item.media_id} item={item} />
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Home;
