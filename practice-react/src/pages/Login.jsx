import React, { useState } from 'react';
import './Login.css';
import { FaRegUser, FaUserAlt, FaPhone, FaLock } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [user, setUser] = useState(null);
  const [oldUser, setOldUser] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = { firstName, lastName, phoneNumber, email, password };
    const loginData = { email, password };

    if (oldUser) {
      try {
        const response = await fetch("http://localhost:8080/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        });

        if (response.status === 200) {
          const token = await response.text();
          setMessage("Login successful!");
          localStorage.setItem('authToken', `Bearer ${token}`);
          navigate('/');
        } else if (response.status === 401) {
          setMessage("Login failed: Invalid credentials. Please try again.");
        } else if (response.status === 403) {
          setMessage("Login failed: Email not verified. Please check your email to verify your account.");
        } else {
          setMessage("Login failed: Unexpected error. Please try again later.");
        }
      } catch (error) {
        console.error("Error during login:", error);
        setMessage("An error occurred during login. Please try again.");
      }
    } else {
      try {
        const response = await fetch("http://localhost:8080/api/users/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.status === 200) {
          const token = await response.text();
          setMessage("Registration successful! Please check your email to verify your account.");
          localStorage.setItem('authToken', `Bearer ${token}`);
          usageChanged();
        } else if (response.status === 409) {
          const errorMessage = await response.text();
          setMessage(`Registration failed: ${errorMessage}`);
        } else {
          setMessage("Registration failed: Unexpected error. Please try again later.");
        }
      } catch (error) {
        console.error("Error during registration:", error);
        setMessage("An error occurred during registration. Please try again.");
      }
    }

    setLoading(false);
  };

  const usageChanged = () => {
    setOldUser(!oldUser);
    setMessage('');
    setFirstName('');
    setLastName('');
    setPhoneNumber('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className='wrapper' style={{color:'black'}}>
      <form onSubmit={handleSubmit} style={{color: 'black'}}>

        <h1 style={{color:'black'}}>{oldUser ? "Login" : "Register"}</h1>
        {message && (
          <p style={{ color: message.includes('failed') ? 'red' : 'green' }}>
            {message}
          </p>
        )}
        
        {!oldUser && (
          <>
            <div className='input-box'>
              <input
                type='text'
                placeholder='First Name'
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <FaRegUser className='icon' />
            </div>
            <div className='input-box'>
              <input
                type='text'
                placeholder='Last Name'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              <FaUserAlt className='icon' />
            </div>
            <div className='input-box'>
              <input
                type='text'
                placeholder='Phone Number'
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
              <FaPhone className='icon' />
            </div>
          </>
        )}

        <div className='input-box'>
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <IoMdMail className='icon' />
        </div>
        
        <div className='input-box'>
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FaLock className='icon' />
        </div>
        
        <button type='submit' disabled={loading}>
          {loading ? "Loading..." : (oldUser ? "Login" : "Register")}
        </button>
        
        {oldUser ? (
          <div className='register-link'>
            <p>Don't have an account? <a href='#' onClick={usageChanged}> Register</a></p>
          </div>
        ) : (
          <div className='register-link'>
            <p>Already have an account? <a href='#' onClick={usageChanged}> Login</a></p>
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;
