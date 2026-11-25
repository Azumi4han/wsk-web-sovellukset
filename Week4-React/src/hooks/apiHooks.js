import {useEffect, useState} from 'react';
import {fetchData} from '../utils/fetchData';

const mediaApi = import.meta.env.VITE_MEDIA_API;
const authApi = import.meta.env.VITE_AUTH_API;
const uploadApi = import.meta.env.VITE_UPLOAD_SERVER;

const useMedia = () => {
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

  const postMedia = async (file, inputs, token) => {
    const mediaData = {
      title: inputs.title,
      description: inputs.description,
      filename: file.filename,
      media_type: file.media_type,
      filesize: file.filesize,
    };

    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(mediaData),
    };

    return await fetchData(`${mediaApi}/media`, fetchOptions);
  };

  return {mediaArray, error, postMedia};
};

const useAuthentication = () => {
  const postLogin = async (inputs) => {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    };
    return await fetchData(`${authApi}/auth/login`, fetchOptions);
  };

  return {postLogin};
};

const useUser = () => {
  const getUserByToken = async (token) => {
    const fetchOptions = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await fetchData(`${authApi}/users/token`, fetchOptions);
  };

  const postUser = async (inputs) => {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    };
    return await fetchData(`${authApi}/users`, fetchOptions);
  };

  return {getUserByToken, postUser};
};

const useFile = () => {
  const postFile = async (file, token) => {
    const formData = new FormData();
    formData.append('file', file);

    const fetchOptions = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    };

    return await fetchData(`${uploadApi}/upload`, fetchOptions);
  };

  return {postFile};
};

export {useMedia, useAuthentication, useUser, useFile};
