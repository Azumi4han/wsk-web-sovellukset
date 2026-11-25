import {useEffect, useState} from 'react';
import {fetchData} from '../utils/fetchData';

const mediaApi = import.meta.env.VITE_MEDIA_API;
const authApi = import.meta.env.VITE_AUTH_API;
const uploadApi = import.meta.env.VITE_UPLOAD_SERVER;

// Media API: list of media items and posting a new media item
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

  // file = file data from the upload server, inputs = title and description
  const postMedia = async (file, inputs, token) => {
    const media = {
      title: inputs.title,
      description: inputs.description,
      filename: file.filename,
      media_type: file.media_type,
      filesize: file.filesize,
    };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(media),
    };
    return await fetchData(`${mediaApi}/media`, options);
  };

  return {mediaArray, error, postMedia};
};

// Auth API: logging in
const useAuthentication = () => {
  const postLogin = async (inputs) => {
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(inputs),
    };
    return await fetchData(`${authApi}/auth/login`, options);
  };

  return {postLogin};
};

// Auth API: getting the logged in user and creating a new user
const useUser = () => {
  const getUserByToken = async (token) => {
    const options = {
      headers: {Authorization: `Bearer ${token}`},
    };
    return await fetchData(`${authApi}/users/token`, options);
  };

  const postUser = async (inputs) => {
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(inputs),
    };
    return await fetchData(`${authApi}/users`, options);
  };

  return {getUserByToken, postUser};
};

// Upload API: sending the file itself
const useFile = () => {
  const postFile = async (file, token) => {
    const formData = new FormData();
    formData.append('file', file);
    // no Content-Type header: the browser sets it for FormData
    const options = {
      method: 'POST',
      headers: {Authorization: `Bearer ${token}`},
      body: formData,
    };
    return await fetchData(`${uploadApi}/upload`, options);
  };

  return {postFile};
};

export {useMedia, useAuthentication, useUser, useFile};
