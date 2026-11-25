import {useUserContext} from '../hooks/contextHooks';

const Profile = () => {
  const {user} = useUserContext();

  return (
    <>
      <h2>Profile</h2>
      <dl className="profile">
        <dt>Username</dt>
        <dd>{user.username}</dd>
        <dt>Email</dt>
        <dd>{user.email}</dd>
        <dt>User level</dt>
        <dd>{user.level_name}</dd>
        <dt>Registered</dt>
        <dd>{new Date(user.created_at).toLocaleString('fi-FI')}</dd>
      </dl>
    </>
  );
};

export default Profile;
