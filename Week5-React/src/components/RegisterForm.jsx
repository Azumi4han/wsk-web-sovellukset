import {useState} from 'react';
import {useUser} from '../hooks/apiHooks';
import useForm from '../hooks/formHooks';

const RegisterForm = () => {
  const {postUser} = useUser();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const initValues = {username: '', password: '', email: ''};

  const doRegister = async (inputs) => {
    try {
      setError('');
      const result = await postUser(inputs);
      console.log(result);
      setMessage(`User ${result.user.username} created, you can log in now`);
    } catch (e) {
      setMessage('');
      setError(e.message);
    }
  };

  const {handleInputChange, handleSubmit} = useForm(doRegister, initValues);

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <div>
        <label htmlFor="registeruser">Username</label>
        <input
          name="username"
          type="text"
          id="registeruser"
          onChange={handleInputChange}
          autoComplete="username"
          required
        />
      </div>
      <div>
        <label htmlFor="registeremail">Email</label>
        <input
          name="email"
          type="email"
          id="registeremail"
          onChange={handleInputChange}
          autoComplete="email"
          required
        />
      </div>
      <div>
        <label htmlFor="registerpassword">Password</label>
        <input
          name="password"
          type="password"
          id="registerpassword"
          onChange={handleInputChange}
          autoComplete="new-password"
          required
        />
      </div>
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;
