import React, { useState, useRef, useContext, useEffect } from 'react';
import { UserContext } from './context';
import { Card } from 'react-bootstrap';
import { MDBIcon } from 'mdbreact';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from 'react-router-dom';
import { RenameandDelete } from './RenameAndDelete';

const Sidebar = ({ handleCreateFolder }) => {
  return (
    <div style={{ position: 'relative', left: 40, top: 100 }}>
      <button onClick={handleCreateFolder}>
        <MDBIcon icon="folder-plus" />
        <span style={{ marginLeft: '5px' }}>Create New Album</span>
      </button>
    </div>
  );
};

const NewFolderPopup = ({ createFolder, handleCancel, handleFolderNameChange }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
        background: 'white', // Set the background color to white
        padding: '2rem', // Set a higher z-index to ensure it appears above the overlay
      }}
    >
      <MDBIcon icon="folder-plus" text="Create new album" />
      <form style={{ marginBottom: '2rem' }}>
        <input type="text" placeholder="Album Name" onChange={handleFolderNameChange} />
      </form>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={createFolder} style={{ fontSize: 'small', marginRight: '0.5rem' }}>
          Create
        </button>
        <button onClick={handleCancel} style={{ fontSize: 'small' }}>
          Cancel
        </button>
      </div>
    </div>
  );
};



const SideBar = () => {
  const [showForm, setShowForm] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [folderName, setFolderName] = useState('');
  const { loggedIn, userId } = useContext(UserContext);
  const navigate = useNavigate();

  const handleCreateFolder = () => {
    setShowPopup(true);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!folderName) {
      alert('Please input the folder name');
      return;
    }
    console.log(folderName)
    console.log(userId)
    // Perform folder creation logic here
    const isFolderAlreadyExist = FoldernameAvailibility(userId, folderName);
    console.log(isFolderAlreadyExist)
    if (!isFolderAlreadyExist) {
      alert('The folder name you entered already exists. Please choose a unique name');
      return;
    }
    console.log(folderName);
    const folderInfo = {
      UserId: String(userId),
      FolderName: String(folderName),
    };
    console.log(folderInfo);
    const xhrFolder = new XMLHttpRequest();
    xhrFolder.open('POST', "http://222.112.183.197:3007/Folder");
    xhrFolder.withCredentials = true;
    xhrFolder.onload = () => {
      if (xhrFolder.status === 200) {
        console.log('Folder information saved successfully');
      } else {
        console.log("Error Saving FolderInformation:", xhrFolder.status, xhrFolder.statusText);
      }
    };
    xhrFolder.send(JSON.stringify(folderInfo));
    window.location.reload();
    navigate('/channel');
    setShowForm(false);
    setShowPopup(false);
    setFolderName('');
  };

  const FoldernameAvailibility = (userId, folderName) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `http://222.112.183.197:3007/CheckFolder?userID=${userId}&folderName=${folderName}`);
      xhr.withCredentials = true;
      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          console.log(data.message)
          if (data.message === 'Folder already exist') {
            return;
          }
        } else {
          reject(new Error(`Error: ${xhr.status} ${xhr.statusText}`));
        }
      };
      xhr.onerror = () => {
        reject(new Error('Network error'));
      };

    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setShowPopup(false);
    setFolderName('');
  };

  const handleFolderNameChange = (e) => {
    setFolderName(e.target.value);
  };

  useEffect(() => {
    const body = document.querySelector('body');
    if (showPopup) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = 'auto';
    }
  }, [showPopup]);

  return (
    <>
      <Card.Body>
        {!showPopup && <Sidebar handleCreateFolder={handleCreateFolder} />}
        {showPopup && (
          <>
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                zIndex: 999, // Set a lower z-index to the overlay
              }}
            />
            <NewFolderPopup createFolder={handleCreate} handleCancel={handleCancel} handleFolderNameChange={handleFolderNameChange} />
          </>
        )}
      </Card.Body>

    </>
  );
};

export default SideBar;
