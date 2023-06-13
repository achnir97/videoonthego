import {  UserContext } from './context';
import {react,  useContext } from 'react';
import { useNavigate } from 'react-router-dom';


const SignOutButton = () => {
  const navigate = useNavigate();
  const {  email, setEmail, userId, setUserId, password, setPassword,  loggedIn, setLoggedIn, } = useContext(UserContext);

  const handleSignOut = async () => {
   
      console.log('Signed out successfully');
      setEmail('')
      setUserId(null)
      setPassword('')
      setLoggedIn(false)
      localStorage.removeItem('userId');
      console.log(userId)
      console.log(loggedIn)
      navigate('/signin'); // Redirect to the signin page
  }

  return (
    <button onClick={handleSignOut}>
      Sign Out
    </button>
  );
};

export default SignOutButton;
