import {useContext} from 'react';
import {UserContext} from '../contexts/UserContext';

// Gives access to the user and the login/logout functions from UserContext
const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used inside UserProvider');
  }
  return context;
};

export {useUserContext};
