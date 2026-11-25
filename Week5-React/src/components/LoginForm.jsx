import {useState} from 'react';
import {useUserContext} from '../hooks/contextHooks';
import useForm from '../hooks/formHooks';

const LoginForm = () => {
  const {handleLogin} = useUserContext();
  const [error, setError] = useState('');
  const initValues = {username: '', password: ''};

  const doLogin = async (inputs) => {
    try {
      setError('');
      await handleLogin(inputs);
    } catch (e) {
      setError(e.message);
    }
  };

  const {handleInputChange, handleSubmit} = useForm(doLogin, initValues);

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <div>
        <label htmlFor="loginuser">Username</label>
        <input
          name="username"
          type="text"
          id="loginuser"
          onChange={handleInputChange}
          autoComplete="username"
          required
        />
      </div>
      <div>
        <label htmlFor="loginpassword">Password</label>
        <input
          name="password"
          type="password"
          id="loginpassword"
          onChange={handleInputChange}
          autoComplete="current-password"
          required
        />
      </div>
      {error && <p className="error">{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
