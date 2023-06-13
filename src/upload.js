import React, { useState,useRef, useContext, useEffect } from 'react';
import { UserContext } from './context';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Container, Alert, ListGroup } from 'react-bootstrap';
import { AiOutlineFile } from 'react-icons/ai'
import { MDBIcon } from 'mdb-react-ui-kit';
import VideoPlayer from './streamvideo';
import VideoGallery from './videogallery';
import Logo from './logo';
import ChannelPage from './User';
const Uploader= () => {
const navigate=useNavigate()
const { loggedIn, userId} = useContext(UserContext);

  const [file, setFile] = useState(null); 
  const [uploadedFiles, setUploadedFiles]= useState([]); 
  const [responseMessage, setResponseMessage] = useState('');
  const [uploading, setUploading]=useState(false);
  const [videoipfscidlink, setVideoIpfslink]= useState([])
  const fileInputRef = useRef(null);
  const [filename, setFilename] = useState('');
  const [tags, setTags] = useState('');
  var filenametosaved;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFilename('');
    setTags('')
  };
  const handleCancelButton=()=>{
    setFile(null)
    setFilename('')
    setTags('')
    setUploading(false);
    resetFileInput();

  }

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
    //Encrypt file before sending 
    //const encryptedfile = await encryptfile(file);
    setUploading(true)
    const formData = new FormData();

    formData.append('data', file,file.name );
    //console.log(file)
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://222.112.183.197:3004/content/add');
    xhr.setRequestHeader('Authorization', 'Bearer EST52582584-cf90-4ce0-b771-aef332a14b3eARY');
    xhr.onload = () => {
      if (xhr.status === 200) {
        const response=JSON.parse(xhr.responseText);
        console.log(response)
        const cid= response.cid
        console.log(cid)
        console.log(response.retrieval_url)
        setResponseMessage('Your file is uploaded successufully')
     // it tracks the sate of the repsonce message. 
        const newFile={name:file.name, cid:response.cid};
        const newCid={cid:response.cid}
        setUploadedFiles((prevUploadedFiles)=>[...prevUploadedFiles, newFile ]);
        setVideoIpfslink((prevUploadedIpfsLink)=>[...prevUploadedIpfsLink, newCid ]);

        const metaInfo= new FormData()
        if (filename==null){
          filenametosaved=file.name 
      } filenametosaved=filename
        const category=tags
        const metaInfo_= {
          "UserId":   String(userId),
          "Filename": String(filenametosaved),
          "Filetype": String(file.type),
          "IpfsCid": String(response.cid),
          "Category":String(category),
      };
      console.log(metaInfo_)

        const xhrMeta= new XMLHttpRequest();
        xhrMeta.open('POST', "http://222.112.183.197:3007/savefilemetainformation");
        xhrMeta.withCredentials = true;
        xhrMeta.onload=()=>{
          if(xhrMeta.status===200){
            console.log('Meta information saved sucessfully');
          } else{
            console.log("Error Saving meta information:", xhrMeta.status, xhrMeta.statusText);
          }
        }
        xhrMeta.send(JSON.stringify(metaInfo_));
        setFile(null)
        resetFileInput(); //
       // Refresh the browser after showing the response message
       setTimeout(()=>{
        if (file.Filetype==='image'){
            navigate("/photogallery")
        }else 
        navigate("/manualupload")
       }, 1000)
      } else {
        console.error('Error uploading file:', xhr.status);
      }
    };
    xhr.send(formData);

  };
  const resetFileInput = () => {
    if (fileInputRef.current) {
      console.log(fileInputRef.current.value)
      fileInputRef.current.value = ''; // Reset the file input field value
    }
  };

  useEffect(() => {
    if (!loggedIn) {
      navigate('/signin');
    }
  }, [loggedIn, navigate]);


  return loggedIn ? (
    <>
  <Logo/>
  <br/>
<ChannelPage/>
<br></br>
    <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
    <Form>
      <Form.Group>
        <Form.Control type="file" onChange={handleFileChange} ref ={fileInputRef}/>
      </Form.Group>
      {file && (
          <>
          <br></br>
          <h6> Rename the filename as you want to save as</h6>
            <Form.Group>
              <Form.Control type="text" placeholder="Filename" value={filename} onChange={handleNameChange} />
            </Form.Group>
            <br></br>
            <h6> Input the Category</h6>
            <Form.Group>
              <Form.Control type="text" placeholder="#Tags" value={tags} onChange={handleTagsChange} />
            </Form.Group>
            <br></br>
          </>
         
        )}
      <br></br>
      <div className="d-flex justify-content-between">
          <Button variant="primary" onClick={handleUpload} disabled={uploading} size ='sm'>
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
          <Button variant="secondary" onClick={handleCancelButton} disabled={uploading}>
            Cancel
          </Button>
        </div>
      {}
      {responseMessage && <Alert variant="success">{responseMessage}</Alert>}
    </Form>
   
  </Container>
</>
):null;
};

export default Uploader;