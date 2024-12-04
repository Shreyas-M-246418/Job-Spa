import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/LoginSignupPage.css';

const LoginSignupPage = () => {
  const { initiateGithubLogin } = useAuth();

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Login</h1>
        <button onClick={initiateGithubLogin} className="github-btn">
          <img src="/github-mark.png" alt="GitHub" className="github-icon" />
          GitHub
        </button>
      </div>
    </div>
  );
};

export default LoginSignupPage;
