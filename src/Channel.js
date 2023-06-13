// CreateFolderForm.js
import React, { useState, useEffect, useContext,useRef } from 'react';
import { Outlet, useLocation, useNavigate,Link, Route, } from 'react-router-dom';
import { UserContext } from './context.js';
import { Button, Form,Dropdown } from 'react-bootstrap';
import axios from 'axios';
import Logo from './logo';
import Navbar from './User';
import SideBar from './Sidebar.js';
import { MDBIcon } from 'mdbreact';
import { Card,  Container, Row, Col } from 'react-bootstrap';
import './FolderContent.css'



const Folder = ({ folderId, folderName, handleRename, handleDelete,handleClick}) => {
  const navigate= useNavigate()
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [rightClick,setRighClick ]= useState(false)
  const [mouseOverIcon, setMouseOverIcon] = useState(false);
  let longPressTimeout = null;

  const handleOutsideClick = (e) => {
    if (optionsRef.current && !optionsRef.current.contains(e.target)) {
      setShowOptions(false);
      setRighClick(false)
      document.removeEventListener('click', handleOutsideClick);
    }
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    setShowOptions(true);
    setRighClick(true)
    document.addEventListener('click', handleOutsideClick);
  };

   const handleContextMenuAction=(action)=>{
    if (action ==='rename') {
      handleRename(folderId, folderName)
    }else if (action =='delete'){
      handleDelete(folderId, folderName)
    }  
   }

   const handleLongPressStart = () => {
    setIsMobile(true);
    longPressTimeout = setTimeout(() => {
      setShowOptions(true);
    }, 5000);
  };

  const handleLongPressEnd = () => {
    setIsMobile(false);
    clearTimeout(longPressTimeout);
    setShowOptions(false);
  };

  const handleRegularClick = () => {
    if (!rightClick) {
      handleClick();
    }
  };
  const handleIconMouseEnter = () => {
    setMouseOverIcon(true);
  };

  const handleIconMouseLeave = () => {
    setMouseOverIcon(false);
  };

 return (
  <div
  style={{
    flex: '0 0 10%',
    margin: '1.5rem',
    textAlign: 'center',
    cursor:'pointer'
  }}
  onClick={handleClick}
  onTouchStart={handleLongPressStart}
  onTouchEnd={handleLongPressEnd}
  onContextMenu={(e) => {
    handleRightClick(e);
    setRighClick(true);
  }}
  ref={optionsRef}
>
    <MDBIcon icon="folder" size="4x" className="text-primary" />
    <div>
      <span>{folderName}</span>
    </div  >
    {isMobile && showOptions && (
        <div>
    
     
          <MDBIcon
            icon="edit"
            onClick={() => handleContextMenuAction('rename')}
            style={{ marginRight: '10px', cursor: 'pointer' }}
          />
          <MDBIcon
            icon="trash-alt"
            onClick={() => handleContextMenuAction('delete')}
            style={{ cursor: 'pointer' }}
          />
        
      </div>
      )}
   {!isMobile && showOptions && (
       <div>
      <MDBIcon
            icon="edit"
            onClick={() => handleContextMenuAction('rename')}
            style={{ marginRight: '10px', cursor: 'pointer' }}
          />
          <MDBIcon
            icon="trash-alt"
            onClick={() => handleContextMenuAction('delete')}
            style={{ cursor: 'pointer' }}
          />
        
     </div>
      )}
    </div>
  );
};
const FolderManager = () => {
   const navigate = useNavigate();
   const location = useLocation();
   const { userId, loggedIn, setLoggedIn,folderInfo, setFolderInfo, selectedFolder, setSelectedFolder } = useContext(UserContext);
   const [folderName, setFolderName] = useState('');
   const [showForm, setShowForm] = useState(false);
   const [newName, setNewName]= useState(false)
   



   const handleRenameFolder = async (folderId, folderName) => {
    const newFolderName = prompt('Enter the new name for the folder', folderName);
  
    if (newFolderName !== null) {
      try {
        // Send a request to the backend to update the folder name
        const response = await axios.put(`http://222.112.183.197:3007/RenameAlbum?FolderId=${folderId}&userID=${userId}`, {
          AlbumId: folderId,
          newAlbumName: newFolderName,
        });
  
        // Handle the response and update the folder name in the UI
        console.log(response.data.message);
  
        // Update the folder name in the folderInfo state
        const updatedFolderInfo = folderInfo.map((folder) =>
          folder.folderId === folderId ? { ...folder, folderName: newFolderName } : folder
        );
        setFolderInfo(updatedFolderInfo);
  
        navigate('/channel');
      } catch (error) {
        console.log('Error renaming folder:', error);
      }
    } else {
      navigate('/channel'); // Direct to the channel page if the user pressed "Cancel"
    }
  };
  
      const handleDeleteFolder = (folderId, folderName) => {
        const confirmation = window.confirm(`Are you sure you want to delete the folder "${folderName}"?`);
        if (confirmation) {
          // Prompt confirmation
          const deleteConfirmation = window.prompt(`To confirm deletion, type "${folderName}"`);
          if (deleteConfirmation === folderName) {
            // Send a request to the backend to delete the folder
            axios
              .delete(`http://222.112.183.197:3007/DeleteAlbum?folderId=${folderId}&userID=${userId}`, {
                data: {
                  folderId: folderId,
                  userId:userId
                },
              })
              .then((response) => {
                // Handle the response and remove the folder from the UI
                console.log(response.data.message);
                // Remove the folder from the folderInfo state
                const updatedFolderInfo = folderInfo.filter((folder) => folder.folderId !== folderId);
                setFolderInfo(updatedFolderInfo);
                navigate("/channel");
              })
              .catch((error) => {
                console.log('Error deleting folder:', error);
              });
          } else {
            // User did not confirm deletion, navigate to channel without making any changes
            navigate("/channel");
           
          }
        } else {
          // User canceled deletion, navigate to channel without making any changes
          navigate("/channel");

        }
      };


    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(`http://222.112.183.197:3007/GetFolder?userId=${userId}`, {
            withCredentials: true, // Include credentials in the request
          });
          const data = response.data;
          const  folderId = data.map(file => ({
            folderId: file.FolderId,
            folderName: file.folder_name
          }));
           console.log(folderId)
           setFolderInfo(folderId);
        } catch (error) {
          console.log('Error fetching folder information:', error);
        }
      };
  
      fetchData();
    }, []);

    const handleFolderClick = (folderId, folderName) => {
      setSelectedFolder({folderId,folderName})
      navigate(`/${folderName}/${folderId}`, { state: { folderName, folderId } }); // Set the selected folder
    };

  return (
    <>
   <Logo/>
   <Navbar/>
   <br></br>
   <div style={{
    position: 'relative',
    marginLeft: '30%',
    marginRight: '20%',
}}>
  <Card style={{ backgroundColor: '#f8f9fa', boxShadow: '0 1px 0px rgba(0, 0, 0, 0.4)' }}>
    <Card.Body>
      <Container>
        <Row className="justify-content-center" style={{ gap: '1rem' }}>
          {folderInfo.map((folder) => (
            <Col key={folder.folderId} xs={10} md={4} lg={2}>
              <Folder
                folderName={folder.folderName}
                folderId={folder.folderId}
                handleClick={() => handleFolderClick(folder.folderId, folder.folderName)}
                handleRename={() => handleRenameFolder(folder.folderId, folder.folderName)}
                handleDelete={() => handleDeleteFolder(folder.folderId, folder.folderName)}
              />
            </Col>
          ))}
        </Row>
      </Container>
      <div style={{ position: 'absolute', bottom: -10, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <SideBar />
      </div>
    </Card.Body>
    <Outlet />
  </Card>
</div>


    </>
  );
  
};


export default FolderManager

