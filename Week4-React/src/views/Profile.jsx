import {useUserContext} from '../hooks/contextHooks';

const Profile = () => {
  const {user} = useUserContext();

  if (!user) {
    return (
      <>
        <h2>Profile</h2>
        <p>Log in to see your profile</p>
      </>
    );
  }

  return (
    <>
      <h2>Profile</h2>
      <dl>
        <dt>Username</dt>
        <dd>{user.username}</dd>
        <dt>Email</dt>
        <dd>{user.email}</dd>
        <dt>User ID</dt>
        <dd>{user.user_id}</dd>
        <dt>Created</dt>
        <dd>
          {user.created_at
            ? new Date(user.created_at).toLocaleString('fi-FI')
            : '-'}
        </dd>
      </dl>
    </>
  );
};

export default Profile;
