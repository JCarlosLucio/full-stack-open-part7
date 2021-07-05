import React from 'react';
import { useDispatch } from 'react-redux';
import { useField } from '../hooks';
import { login } from '../reducers/userReducer';

const LoginForm = () => {
  const { reset: resetUsername, ...username } = useField('text');
  const { reset: resetPassword, ...password } = useField('password');

  const dispatch = useDispatch();

  const handleLogin = (event) => {
    event.preventDefault();
    dispatch(login(username.value, password.value));
    resetUsername();
    resetPassword();
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label htmlFor="username">username</label>
        <input id="username" name="username" {...username} />
      </div>
      <div>
        <label htmlFor="password">password</label>
        <input id="password" name="password" {...password} />
      </div>
      <button id="login-button" type="submit">
        login
      </button>
    </form>
  );
};

export default LoginForm;
