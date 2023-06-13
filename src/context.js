import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';


// Create the UserContext
export const UserContext = createContext();

// Create the UserContextProvider component
export const UserContextProvider = ({ children }) => {

  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('userId') !== null);
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [selectedFolder, setSelectedFolder] = useState(null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  const [folderInfo, setFolderInfo] = useState([]);
  const [albumId, setAlbumId]=useState(null)
  const [AlbumName, setAlbumName]=useState(null )


  const handleSignIn = (userId) => {
    setLoggedIn(true);
    setUserId(userId);
  };

  const handleSignOut = () => {
    setLoggedIn(false);
    setUserId(null);
    localStorage.removeItem('userId');
   
  };
  return (
    <UserContext.Provider value={{ fullName, setFullName, email, setEmail, userId, setUserId, password, setPassword, loggedIn, setLoggedIn, handleSignIn, handleSignOut,  selectedFolder, setSelectedFolder,
    albumId, setAlbumId, AlbumName, setAlbumName ,folderInfo, setFolderInfo}}>
      {children}
    </UserContext.Provider>
  );
};
