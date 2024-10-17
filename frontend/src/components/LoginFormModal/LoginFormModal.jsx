// frontend/src/components/LoginFormModal/LoginFormModal.jsx

import './LoginForm.css';
import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';

function LoginFormModal({ navigate }) {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    return dispatch(sessionActions.login({ credential, password }))
      .then(() => {
        closeModal();
        navigate('/');
      })
      .catch(async (res) => {
        if (res && res.json) {
          const data = await res.json();
          if (data && data.errors) {
            setError(data.errors.credential);
          }
        } else {
          setError("An error occurred. Please try again.");
        }
      });
  };

  const handleDemoUser = (e) => {
    e.preventDefault();
    return dispatch(sessionActions.login({ credential: "demo@user.io", password: "password" }))
      .then(() => {
        closeModal();
        navigate('/');
      })
      .catch((error) => {
        setError("Unable to log in as demo user.");
      });
  };

  const isFormValid = credential.length >= 4 && password.length >= 6;
 
  return (
    <div className="login-form-modal">
      <h1>Log In</h1>
      {error && <p className="credential-error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={!isFormValid}>Log In</button>
      </form>
      <div className="demo-user">
        <a href="#" onClick={handleDemoUser}>Demo User</a>
      </div>
    </div>
  );
}

export default LoginFormModal;
