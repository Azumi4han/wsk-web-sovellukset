import {useState} from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const Login = () => {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <>
      {showRegister ? <RegisterForm /> : <LoginForm />}
      <button
        type="button"
        className="switch"
        onClick={() => setShowRegister(!showRegister)}
      >
        {showRegister
          ? 'Already have an account? Log in'
          : 'No account yet? Register'}
      </button>
    </>
  );
};

export default Login;
