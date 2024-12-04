import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

const GitHubCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
    
        if (code) {
          const tokenUrl = `https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${code}`;
          const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
              Accept: 'application/json'
            }
          });
          
          const data = await response.json();
          const accessToken = data.access_token;

          const userResponse = await fetch('https://api.github.com/user', {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          
          const userData = await userResponse.json();
          const user = {
            id: userData.id,
            username: userData.login,
            name: userData.name || userData.login
          };

          login(user, accessToken);
          navigate('/jobs');
        }
      } catch (error) {
        console.error('Error during GitHub callback:', error);
        navigate('/display-jobs');
      }
    };

    handleCallback();
  }, [location, login, navigate]);

  return (
    <div className="loading">
      <h2>Authenticating...</h2>
    </div>
  );
};

export default GitHubCallback;
