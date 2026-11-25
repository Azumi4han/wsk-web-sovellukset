import PropTypes from 'prop-types';
import {Navigate} from 'react-router';
import {useUserContext} from '../hooks/contextHooks';

// Shows the page only to logged in users, others go to the home page
const ProtectedRoute = ({children}) => {
  const {user} = useUserContext();

  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
