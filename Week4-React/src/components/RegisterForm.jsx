import {useState} from 'react';
import useForm from '../hooks/formHooks';
import {useUser} from '../hooks/apiHooks';

const initValues = {
  username: '',
  password: '',
  email: '',
};

const RegisterForm = () => {
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const {postUser} = useUser();

  const doRegister = async () => {
    try {
      const result = await postUser(inputs);
      setError(null);
      setMessage(result.message ?? 'Account created, you can log in now');
    } catch (err) {
      console.error(err);
      setMessage(null);
      setError(err.message);
    }
  };

  const {inputs, handleInputChange, handleSubmit} = useForm(
    doRegister,
    initValues,
  );

  return (
    <>
      <h3>Register</h3>

      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      <form onSubmit={handleSubmit}>
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
        <button type="submit">Register</button>
      </form>
    </>
  );
};

export default RegisterForm;
