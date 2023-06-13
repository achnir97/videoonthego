
import React, { useState, useContext, useDebugValue } from 'react';
import { UserContext } from './context.js';
import {  Route, Routes, Switch, Outlet } from 'react-router-dom';
import SignIn from './SignIn';
import Dashboard from './Dashboard';

import SignOutButton  from './Signout';
import FileUploader from './ManualUploader';
import Uploader from './upload';
import PhotoGallery from './photogallery';
import Signup from './Signup';
import { useNavigate } from 'react-router-dom';
import FolderManager from './Channel.js';
import FolderPage from './FolderContent';
import Test from './Test.js';
function App() {
  const [user, setUser] = useState(null);
  const Navigate= useNavigate
  const { loggedIn} = useContext(UserContext);
  const handleSignIn = (user) => {
    setUser(user);
  };

  return (
      <Routes>
        <Route path="/Dashboard" element={ <Dashboard />}/> 
        <Route path="/signin" element={<SignIn/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/signout" element={<SignOutButton/>} />
        <Route path="/test" element={<Test/>} />

        {/* <Route path="/youtube" element={<YoutubeVideos/>} />
        <Route path="/myyoutube" element={<MyYoutubeVideos/>} /> */}
        
          <Route path="/channel" element={<FolderManager/>} />
          <Route path=":folderName/:folderId" element={<FolderPage/>}/>
          <Route path="/manualupload" element={<FileUploader/>} />
          <Route path="/upload" element={<Uploader/>} />
          <Route path="/photogallery" element={<PhotoGallery />} />
      </Routes>
  );
}
function Wrapper({ user, onSignIn }) {
  return user ? <Outlet /> : <SignIn onSignIn={onSignIn} />;
}

export default App;



