import {useState} from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const Login = () => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <>
      <h2>{showLogin ? 'Login' : 'Register'}</h2>

      {showLogin ? <LoginForm /> : <RegisterForm />}

      <button
        type="button"
        className="switch"
        onClick={() => setShowLogin(!showLogin)}
      >
        {showLogin ? 'Create an account' : 'Back to login'}
      </button>
    </>
  );
};

export default Login;
