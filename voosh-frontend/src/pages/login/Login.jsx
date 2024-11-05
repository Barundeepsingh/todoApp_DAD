import { auth, provider } from '../../config/firebase';
import { signInWithPopup} from 'firebase/auth';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import axios from 'axios';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            console.log("results from google",result.user);
            localStorage.setItem("token", result.user.accessToken);
            localStorage.setItem("uid", result.user.uid);
            navigate("/todoList");
        } catch (error) {
            console.error("Error logging in with Google:", error);
        }
    };

    const handleLogIn = async () => {
        const body = {email, password};
        try {
            const response = await axios.post("http://localhost:5000/login",body);
            console.log('User Logged In:', response.data);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("uid", response.data.payload.user);
            navigate("/todoList");
            console.log("navigating to todoLIst");
        } catch (error) {
            setError(error.response.data.message);
            console.error("Error logging in with email and password:", error.response.data.message);
        }
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
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
            {error && <p className="error-message">{error}</p>}
            <button onClick={handleLogIn}>Login</button>
            <button className="google-login" onClick={signInWithGoogle}>Login with Google</button>

            <p>Don't have an account? <Link to={"/signUp"}>Signup</Link></p>
        </div>
    );
};