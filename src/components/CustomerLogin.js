
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const CustLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/login/customer', {
        username,
        password,
      });

      
      const { accessToken, usertype } = response.data;

      if (accessToken && usertype) {
        
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('usertype', usertype);

        
        navigate('/transfer');
      }  else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please check your username and password.');
    }
  };

  return (
    <div style={{display:'flex',justifyContent:'center', alignItems:'center', height: '100vh'}}>
      <div className="login-container">
      <h2>Customer Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
    </div>
    
  );
};

export default CustLogin;
