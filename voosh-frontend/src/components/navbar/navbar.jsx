import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import profilePic from '../../assets/game.png';

export const Navbar = () => {
    const [user] = useAuthState(auth);
    const [userDetails, setUserDetails] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');
    const uid = localStorage.getItem("uid");

    const cleanUrl = (url) => url ? url.replace(/^"(.*)"$/, '$1') : url; // Remove quotes from start and end if present

    const getLoggedInUserDetails = async () => {
        try {
            const response = await axios.post("https://todoapp-re6f.onrender.com/getUser", { uid });
            console.log('User Details:', response.data.userData);
            setUserDetails(response.data.userData);
        } catch (error) {
            console.error('Error fetching user details', error);
        }
    };

    useEffect(() => {
        console.log('useEffect triggered');
        
        const isAuthPage = location.pathname === '/login' || location.pathname === '/signUp';
        
        if (!token && !isAuthPage) {
            navigate('/login');
        } else if (token) {
            getLoggedInUserDetails();
            navigate('/todoList');
        }
    }, [token, navigate, uid, location.pathname]);

    const signUserOut = async () => {
        await signOut(auth);
        setUserDetails(null);
        localStorage.removeItem('token');
        localStorage.removeItem('uid');
        navigate('/login');
    };

    return (
        <div className='navbar'>
            <div className="links">
                {!token ? (
                    <>
                        <Link to={"/login"}>Login</Link>
                        <Link to={"/signUp"}>SignUp</Link>
                    </>
                ) : (
                    <Link to={"/todoList"}>Todo-List</Link>
                )}
            </div>

            <div className='user'>
                {(token && (userDetails || user)) && (
                    <>
                        <p>{userDetails?.firstname || user?.displayName}</p>
                        <img 
                            src={cleanUrl(userDetails?.photoUrl) || cleanUrl(user?.photoURL) || profilePic} 
                            alt="ProfilePhoto" 
                            width="40" 
                            height="40" 
                            onLoad={() => setImageLoaded(true)} 
                            onError={() => setImageLoaded(false)}
                            style={{ display: imageLoaded ? 'block' : 'none' }}
                        />
                        {!imageLoaded && <img src={profilePic} alt="ProfilePhoto" width="40" height="40" />} {/* Fallback image */}
                        <button onClick={signUserOut}>Log Out</button>
                    </>
                )}
            </div>
        </div>
    );
};
