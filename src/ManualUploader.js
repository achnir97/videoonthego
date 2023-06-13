import React, { useState, useRef, useContext, useEffect } from 'react';
import { UserContext } from './context';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Container, Alert, ListGroup } from 'react-bootstrap';
import { AiOutlineFile } from 'react-icons/ai';
import { MDBIcon } from 'mdb-react-ui-kit';
import VideoPlayer from './streamvideo';
import VideoGallery from './videogallery';
import Logo from './logo';
import Navbar from './User'

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const { loggedIn } = useContext(UserContext);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [responseMessage, setResponseMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [videoipfscidlink, setVideoIpfslink] = useState([]);
  const fileInputRef = useRef(null);
  const [filename, setFilename] = useState('');
  const [tags, setTags] = useState('');
  var filenametosaved;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFilename('');
    setTags('');
  };

  const handleCancelButton = () => {
    setFile(null);
    setFilename('');
    setTags('');
    setUploading(false);
    resetFileInput();
  };

  const handleNameChange = (e) => {
    setFilename(e.target.value);
  };

  const handleTagsChange = (e) => {
    setTags(e.target.value);
  };

  const handleUpload = async () => {
    if (!file) {
      console.error('No file selected');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('data', file, file.name);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://222.112.183.197:3004/content/add');
    xhr.setRequestHeader('Authorization', 'Bearer EST52582584-cf90-4ce0-b771-aef332a14b3eARY');
    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        const cid = response.cid;
        setResponseMessage('Your file is uploaded successfully');

        const newFile = { name: file.name, cid: response.cid };
        const newCid = { cid: response.cid };
        setUploadedFiles((prevUploadedFiles) => [...prevUploadedFiles, newFile]);
        setVideoIpfslink((prevUploadedIpfsLink) => [...prevUploadedIpfsLink, newCid]);

        const metaInfo = new FormData();
        const today = new Date();
        const uploadDate = today.toLocaleDateString();

        if (filename == null) {
          filenametosaved = file.name;
        }
        filenametosaved = filename;

        const category = tags;
        const metaInfo_ = {
          Filename: String(filenametosaved),
          UploadDate: uploadDate,
          Filesize: String(file.size),
          Filetype: String(file.type),
          IpfsCid: String(response.cid),
          Retreival_link: String(response.retrieval_url),
          Category: String(category),
        };

        const xhrMeta = new XMLHttpRequest();
        xhrMeta.open('POST', 'http://222.112.183.197:3007/savefilemetainformation');
        xhrMeta.withCredentials = true;
        xhrMeta.onload = () => {
          if (xhrMeta.status === 200) {
            console.log('Meta information saved successfully');
          } else {
            console.log('Error Saving meta information:', xhrMeta.status, xhrMeta.statusText);
          }
        };
        xhrMeta.send(JSON.stringify(metaInfo_));

        setFile(null);
        resetFileInput();

        // Refresh the browser after showing the response message
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        console.error('Error uploading file:', xhr.status);
      }
    };
    xhr.send(formData);
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset the file input field value
    }
  };

  useEffect(() => {
    if (!loggedIn) {
      navigate('/signin');
    }
  }, [loggedIn, navigate]);

  const pageStyle = {
    display:'inline',
    backgroundColor: 'white',
    height: '100vh',
  };

  return loggedIn ? (
    <div style={pageStyle}>
      
      <Logo />
      <Navbar />
      <VideoGallery />
    </div>
  ) : null;
};

export default FileUpload;
