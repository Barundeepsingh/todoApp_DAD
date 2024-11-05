import React, { useState } from 'react';
import { auth, provider } from '../../config/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './SignUp.css';

const SignUp = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (email) => {
    // Simple email pattern for validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password) {
      setErrorMessage('All fields are required');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Invalid email address');
      return;
    }

    setErrorMessage(''); // Clear any previous error messages

    try {
      console.log('User signed up:', { firstName, lastName, email, password });

      const userData = {
        email,
        firstname: firstName,
        lastname: lastName,
        password,
      };

      await axios.post("https://todoapp-re6f.onrender.com/register", userData);
      navigate('/');
    } catch (error) {
      console.error('Error signing up:', error);
      setErrorMessage('Error signing up. Please try again.');
    }
  };

  const signInwithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('This is the result:', result);

      const user = result.user;

      const userData = {
        userId: user.uid,
        email: user.email,
        firstname: result._tokenResponse.firstName,
        lastname: result._tokenResponse.lastName,
        photo: user.photoURL,
      };
      console.log('userData from SignUP:', userData);
      await axios.post("https://todoapp-re6f.onrender.com/register", userData);
      navigate('/login');
    } catch (error) {
      setErrorMessage(error.response.data.message)
      console.error('Error signing in with Google:', error.response.data.message);
    }
  };

  return (
    <div className="signup-container">
      <h1>Sign Up</h1>
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <button onClick={handleSignUp}>Sign Up</button>
      <button className="google-signup" onClick={signInwithGoogle}>Sign Up with Google</button>
      <p>Already have an Account? <Link to={"/login"}>Login</Link></p>
    </div>
  );
};

export default SignUp;
