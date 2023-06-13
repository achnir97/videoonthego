
import { Outlet, useLocation, useParams, useNavigate, Link, Route } from 'react-router-dom';
import { UserContext } from './context.js';
import axios from 'axios';
import React, { useState, useRef, useContext, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MDBIcon } from 'mdb-react-ui-kit';
import Logo from './logo.js';
import ChannelPage from './User.js';

const FolderPage = () => {
  const { selectedFolder } = useContext(UserContext)
  const { folderName, folderId } = useParams()
  const location = useLocation();
  //const folderName= location.state?.folderName;
  //const folderId= location.state?.folderId

  const [videoCids, setVideoCids] = useState([]);
  const [selectedThumbnails, setSelectedThumbnails] = useState([]);
  const { loggedIn, userId, folderInfo, setFolderInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const [copiedIndexes, setCopiedIndexes] = useState([]);
  const [showCopyLink, setShowCopyLink] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [showAlbumList, setShowAlbumList] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
  const videosRef = useRef([]);

  const handlePlay = (playingIndex) => {
    videosRef.current.forEach((videoRef, index) => {
      if (playingIndex !== index && !videoRef.paused) {
        videoRef.pause();
      }
    });
    setCopiedIndexes(Array(videoCids.length).fill(false));
  };
  useEffect(() => {
    const fetchData = async () => {
      console.log(folderId, folderName)
      try {
        const response = await axios.get(`http://222.112.183.197:3007/GetSharedCid?folderName=${folderName}&folderId=${folderId}`, {
          withCredentials: true, // Include credentials in the request
        });
        const data = response.data;
        const data_ = data.sharedCid
        const cids = data_.map(file => {
          return {
            cid: file.SharedCid,
            id: file.id,
            title:file.file_name,
          };
        })
        console.log(cids) // Filter out null values
        setVideoCids(cids);
        // Perform necessary operations with the sharedCid data
      } catch (error) {
        console.log('Error fetching sharedCid:', error);
      }
    };

    fetchData();
  }, []);
  ;

  return (
    <>

      <Container>
        <h1>folder: {folderName}/{folderId}</h1>
        <Row>
          {videoCids.map((video, index) => (
            <Col sm={4} key={index} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title className="p-3"> {video.title}</Card.Title>
                  <video
                    ref={(el) => (videosRef.current[index] = el)}
                    controls
                    controlsList="nodownload"
                    style={{ width: '100%', maxHeight: '150px' }}
                    onPlay={() => handlePlay(index)}
                  >
                    <source src={`http://222.112.183.197:3004/gw/ipfs/${video.cid}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div>

                  </div>
                </Card.Body>

              </Card>
            </Col>
          ))}
        </Row>
      </Container>

    </>)
};



export default FolderPage
