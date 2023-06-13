import React, { useState, useRef, useContext, useEffect } from 'react';
import { UserContext } from './context';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MDBIcon } from 'mdb-react-ui-kit';
import './videothumbnail.css'
import axios from 'axios';
const Thumbnail = ({ cid, handleClick, isSelected,name }) => {
  const handleThumbnailClick = (event) => {
    if (event.target.classList.contains('check-icon')) {
      handleClick(cid,name);
    }
  };
  return (
    <div className={`thumbnail ${isSelected ? 'selected' : ''}`} onClick={handleThumbnailClick}>
      <MDBIcon
        style={{ color: isSelected? 'blue' : 'red', position: 'absolute', bottom: 2, right: 2, fontSize: '1rem' }}
        icon="circle-check"
        className={`check-icon ${isSelected ? 'blue' : 'red'}`}
      />
      {/* Render thumbnail content */}
    </div>
  );
};


const VideoGallery = () => {
  const [videoCids, setVideoCids] = useState([]);
  const [selectedThumbnails, setSelectedThumbnails] = useState([]);

  const { loggedIn, userId, folderInfo, setFolderInfo ,folderId, folderName} = useContext(UserContext);
  const navigate = useNavigate();
  const [copiedIndexes, setCopiedIndexes] = useState([]);
  const [showCopyLink, setShowCopyLink] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [showAlbumList, setShowAlbumList] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);



  const handleThumbnailClick = (cid, name) => {
    setSelectedThumbnails((prevSelectedThumbnails) => {
      const isThumbnailSelected = prevSelectedThumbnails.some(
        (thumbnail) => thumbnail.cid === cid && thumbnail.name === name
      );
      if (isThumbnailSelected) {
        // Thumbnail is already selected, deselect it by filtering out both CID and name
        console.log(selectedThumbnails)
        return prevSelectedThumbnails.filter(
          (thumbnail) => !(thumbnail.cid === cid && thumbnail.name === name)
        );
      } else {
        // Thumbnail is not selected, select it by adding both CID and name
        console.log(selectedThumbnails)
        return [...prevSelectedThumbnails, { cid, name }];
      }
    });
  };
  

  const handleAlbumOptionClick = () => {
    setShowAlbumList(!showAlbumList);
  };

  const handleAlbumClick = (albumId, albumName) => {
    setSelectedAlbumId(albumId);
    console.log(selectedAlbum)
    setSelectedAlbum(albumName)
    console.log(selectedAlbumId)


  };
  const handleCancel = () => {
    setSelectedAlbum(null)
    setShowAlbumList(false)
    setSelectedAlbumId(null)
  }

  const handleAlbumSelection = (album) => {
    setSelectedAlbum(album);
    console.log(selectedAlbum)
    setShowAlbumList(false);
  };

  const ShareVideos = () => {
    if (!selectedAlbum || !selectedThumbnails) {
      alert('You havent selected the videos to shared.')
      return
    }
    const sharedCidArray = selectedThumbnails.map(({ cid, name }) => ({ cid, name }));
    console.log(sharedCidArray)
    const SharedAlbum = {
      "userId": String(userId),
      "AlbumName": String(selectedAlbum),
      "AlbumId": String(selectedAlbumId),
      SharedCid: sharedCidArray
    }
    console.log(SharedAlbum)
    const xhrShare = new XMLHttpRequest();
    xhrShare.open('POST', `http://222.112.183.197:3007/SharedAlbum?userId=${userId}`);
    xhrShare.withCredentials = true;
    xhrShare.setRequestHeader('Content-Type', 'application/json');
    xhrShare.onload = () => {
      if (xhrShare.status === 200) {
        console.log('Meta information saved sucessfully');
        console.log(xhrShare.responseText)
      } else {
        console.log("Error Saving meta information:", xhrShare.status, xhrShare.statusText);
      }
    }
    xhrShare.send(JSON.stringify(SharedAlbum))
    // navigate(`:${folderName}/${folderId}`);
    // window.location.reload();
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://222.112.183.197:3007/getfilemetainformation?userId=${userId}`, {
          withCredentials: true, // Include credentials in the request
        });
        const data = response.data;
        const cids = data.map(file => {
          if (file.Filetype === 'image') {
            return null; // Exclude image files from the array
          }
          return {
            cid: file.IpfsCid,
            title: file.Filename,
          };
        }).filter(file => file !== null); // Filter out null values

        setVideoCids(cids);
        console.log(cids)
        setCopiedIndexes(Array(cids.length).fill(false));
        setShowCopyLink(Array(cids.length).fill(false));
      } catch (error) {
        console.log('Error fetching file meta information:', error);
      }
    };
    fetchData();
  }, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://222.112.183.197:3007/GetFolder?userId=${userId}`, {
          withCredentials: true, // Include credentials in the request
        });
        const data = response.data;

        const folderId = data.map(file => ({
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
  const videosRef = useRef([]);

  const handlePlay = (playingIndex) => {
    videosRef.current.forEach((videoRef, index) => {
      if (playingIndex !== index && !videoRef.paused) {
        videoRef.pause();
      }
    });
    setCopiedIndexes(Array(videoCids.length).fill(false));
  };

  const handleCopyLink = (index) => {
    const newCopiedIndexes = [...copiedIndexes];
    newCopiedIndexes[index] = true;
    setCopiedIndexes(newCopiedIndexes);

    setTimeout(() => {
      const newCopiedIndexes = [...copiedIndexes];
      newCopiedIndexes[index] = false;
      setCopiedIndexes(newCopiedIndexes);
    }, 2000);
  };

  const handleMouseEnter = (index) => {
    const newShowCopyLink = [...showCopyLink];
    newShowCopyLink[index] = true;
    setShowCopyLink(newShowCopyLink);
    setHoveredIndex(index)
  };

  const handleMouseLeave = (index) => {
    const newShowCopyLink = [...showCopyLink];
    newShowCopyLink[index] = false;
    setShowCopyLink(newShowCopyLink);
    setHoveredIndex(-1)
  };

  useEffect(() => {
    videosRef.current = videosRef.current.slice(0, videoCids.length);
  }, [videoCids]);

  useEffect(() => {
    if (!loggedIn) {
      navigate('/signin');
    }
  }, [loggedIn, navigate]);

  return loggedIn ? (
    <>
    <div style={{
      display:'inline-block',
      marginLeft:'20%'
    }}> 
      <div style={{
        display:'inline-block',
        position: 'relative',
        top: '0px',
        left: '20%',

        /* Additional styling properties */
      }} className="album-list bottom-left">

        <select onChange={(e) => handleAlbumClick(e.target.value, e.target.options[e.target.selectedIndex].text)}>
          <option value="">Select an album</option>
          {folderInfo.map((folder) => (
            <option key={folder.folderId} value={folder.folderId}>
              {folder.folderName}
            </option>
          ))}
        </select>
      </div>
      <div style={{
         display:'inline-block',
         margin:' 5px 5px',
         position: 'relative', 
        top: '0px',
        left: '20%',
        /* Additional styling properties */
      }} className="album-list bottom-left">
        <Button onClick={ShareVideos}>
          <MDBIcon far icon="share-square" />
          Share
        </Button>
      </div>
      </div>
      <br></br>
      <div>
        <Container>
          <Row>
            {videoCids.map((video, index) => (
              <Col sm={4} key={index} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title className="p-3">{video.title}</Card.Title>
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
                    <div
                      className={`thumbnail ${hoveredIndex === index ? 'hand-cursor' : ''}`}
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={() => handleMouseLeave(index)}
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: 0,
                        paddingBottom: '20px',
                        transition: 'box-shadow 0.3s ease-in-out',
                      }}>
                      {copiedIndexes[index] && <span className="tooltip">Copied!</span>}
                      <CopyToClipboard text={`http://222.112.183.197:3004/gw/ipfs/${video.cid}`}>
                        <MDBIcon
                          icon={showCopyLink[index] ? 'copy' : 'clone'}
                          size="2x"
                          className={`copy-icon ${showCopyLink[index] ? 'show-tooltip' : ''}`}
                          onClick={() => handleCopyLink(index)}
                        />
                      </CopyToClipboard>
                      <div>
                      <Thumbnail key={index} cid={video.cid} name={video.title} handleClick={handleThumbnailClick} isSelected={selectedThumbnails.some((thumbnail) => thumbnail.cid === video.cid && thumbnail.name === video.title)} />

                      </div>
                    </div>
                  </Card.Body>

                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

    </>
  ) : null;
};

export default VideoGallery;
