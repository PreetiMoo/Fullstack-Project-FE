
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const CustReg = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState('');
  
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    if (newEmail === '' || validateEmail(newEmail)) {
      setEmailError('');
    } else {
      setEmailError('Invalid email format');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/register/cust`, {
        username,
        password,
        email,
      });
  
      if (response.status === 201) {
        alert('User created successfully!');
        navigate('/custLogin'); 
      }
      else{
        alert('User creation failed!');
      }
    } catch (err) {
      console.log(err)
      if(err.response && err.response.data && err.response.data.error){
        setError(err.response.data.error)
      }
      else{
        setError('Registration failed. Please check your input.');
      }
      
    }
  };

  return (
    <div style={{display:'flex',justifyContent:'center', alignItems:'center', height: '100vh'}}>
      <div className="login-container">
      <h2>Customer Sign Up</h2>
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
      <label htmlFor="email">Email</label>
      <input
        type="text"
        id="email"
        value={email}
        onChange={handleEmailChange}
        required
      />
      {emailError && <p className="error-message">{emailError}</p>}
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
        
        <button type="submit">Sign Up</button>
        

      </form>
      {error && <p className="error-message">{error}</p>}
      <a href='/custLogin'>Customer Login</a>
    </div>
    </div>
    
  );
};

export default CustReg;
