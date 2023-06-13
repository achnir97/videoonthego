import React, { useState, useRef, useContext, useEffect } from 'react';
import { UserContext } from './context';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import Logo from './logo';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MDBIcon } from 'mdb-react-ui-kit';
import Navbar from './User';
import './photothumbnail.css'
import { AiFillHeart } from 'react-icons/ai';

const PhotoGallery = () => {
  const [imageCids, setImageCids] = useState([]);
  const navigate = useNavigate();
  const { loggedIn, userId } = useContext(UserContext);
  const [copiedIndexes, setCopiedIndexes] = useState([]);
  const [showCopyLink, setShowCopyLink] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  useEffect(() => {
    if (!loggedIn) {
      navigate('/signin');
    }
  }, [loggedIn, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://222.112.183.197:3007/getimagemetainformation?userId=${userId}`, {
          withCredentials: true, // Include credentials in the request
        });
        const data = response.data;
       
        const cids = data.map(file => ({
          cid: file.IpfsCid,
          title: file.Filename,
        }));
       
        setImageCids(cids);
        setCopiedIndexes(Array(cids.length).fill(false));
        setShowCopyLink(Array(cids.length).fill(false));
      
      } catch (error) {
        console.log('Error fetching file meta information:', error);
      }
    };

    fetchData();
  }, [userId]);
  const handleCopyLink = index => {
    const newCopiedIndexes = [...copiedIndexes];
    newCopiedIndexes[index] = true;
    setCopiedIndexes(newCopiedIndexes);

    setTimeout(() => {
      const newCopiedIndexes = [...copiedIndexes];
      newCopiedIndexes[index] = false;
      setCopiedIndexes(newCopiedIndexes);
    }, 2000);
  };

  const handleMouseEnter = index => {
    const newShowCopyLink = [...showCopyLink];
    newShowCopyLink[index] = true;
    setShowCopyLink(newShowCopyLink);
    setHoveredIndex(index);
  };

  const handleMouseLeave = index => {
    const newShowCopyLink = [...showCopyLink];
    newShowCopyLink[index] = false;
    setShowCopyLink(newShowCopyLink);
    setHoveredIndex(-1);
  };

  const chunkArray = (arr, chunkSize) => {
    const chunks = [];
    let i = 0;
    while (i < arr.length) {
      chunks.push(arr.slice(i, i + chunkSize));
      i += chunkSize;
    }
    return chunks;
  };

  const imageChunks = chunkArray(imageCids, 3);

  return loggedIn? (
    <>
    
    <Logo/>
    <br/>
  <Navbar/>
  <br></br>
  <Container>
  {imageChunks.map((chunk, rowIndex) => (
    <Row key={rowIndex}>
      {chunk.map((image, index) => (
        <Col key={index} sm={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title className="p-3">{image.title}</Card.Title>
              <div className="thumbnail-wrapper">
                <img
                  src={`https://ipfs.io/ipfs/${image.cid}`}
                  alt={image.title}
                  className="thumbnail-image"
                />
                <div
                  className={`thumbnail ${hoveredIndex === index ? 'hand-cursor' : ''}`}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={() => handleMouseLeave(index)}
                >
                  {copiedIndexes[index] && <span className="tooltip">Copied!</span>}
                  <CopyToClipboard text={`https://ipfs.io/ipfs/${image.cid}`}>
                    <MDBIcon
                      icon={showCopyLink[index] ? 'copy' : 'clone'}
                      size="2x"
                      className="copy-icon"
                      onClick={() => handleCopyLink(index)}
                    />
                  </CopyToClipboard>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  ))}
</Container>

    </>
  ):null ;
};

export default PhotoGallery;

