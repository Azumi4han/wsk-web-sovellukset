import {useState} from 'react';

// Keeps the values of a form in state.
// callback = function that is called with the form values when the form is submitted
// initState = starting values, for example {username: '', password: ''}
const useForm = (callback, initState) => {
  const [inputs, setInputs] = useState(initState);

  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }
    callback(inputs);
  };

  const handleInputChange = (event) => {
    const {name, value} = event.target;
    setInputs((previousInputs) => ({...previousInputs, [name]: value}));
  };

  return {handleSubmit, handleInputChange, inputs};
};

export default useForm;
