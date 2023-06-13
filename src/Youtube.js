import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Modal, Button } from 'react-bootstrap';

const YoutubeVideos = () => {
  const [videos, setVideos] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedVideos, setSelectedVideos]=useState([])
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoSelectedFlags, setVideoSelectedFlags] = useState([]);
  const API_KEY = 'AIzaSyASTjZSWRPSVOy4wwIQATorBOLIsqvt2vs'; // Replace with your YouTube Data API v3 key

  const handleClose = () => setShow(false);
  const handleShow = (videoId) => {
    setSelectedVideo(videoId);
    setShow(true);
  };

  const toggleVideoSelection = (videoId) => {
    if (selectedVideos.includes(videoId)) {
      setSelectedVideos(selectedVideos.filter((id) => id !== videoId));
      console.log(selectedVideos);
    } else {
      setSelectedVideos([...selectedVideos, videoId]);
      console.log(selectedVideos);
    }
  };
  const uploadSelectedVideos = async () => {
    const API_BASE_URL = "http://222.112.183.197:3004";

    for (const videoId of selectedVideos) {
      try {
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        const response = await fetch(`${API_BASE_URL}/content/upload`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ videoUrl }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Upload successful:", data);
        } else {
          console.error("Upload failed:", response);
        }
      } catch (error) {
        console.error("Error uploading video:", error);
      }
    }
  };

  useEffect(() => {
    async function fetchVideos() {
      try {
        const cachedVideos = localStorage.getItem('YoutubeVideos');
        if (cachedVideos) {
          setVideos(JSON.parse(cachedVideos));
          return;
        }
  
        const maxResults = 5;
        let nextPageToken = '';
        let allVideos = []; // Store all fetched videos here
  
        while (allVideos.length < 25) {
          const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=surfing&pageToken=${nextPageToken}&key=${API_KEY}`
          );
          const data = await response.json();
  
          allVideos = [...allVideos, ...data.items]; // Combine fetched videos with previous ones
  
          nextPageToken = data.nextPageToken;
  
          if (!nextPageToken) {
            break;
          }
        }
  
        // Set the state and store data in local storage only once
        setVideos(allVideos);
        localStorage.setItem('youtubeVideos', JSON.stringify(allVideos));
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    }
  
    fetchVideos();
  }, []);
  

  return (
    <Container fluid className="mt-5">
      <h1 className="text-center mb-5"> Upload Videos to Filecoin</h1>
      <Container>
        {videos.map((video, index) => (
          index % 5 === 0 && (
            <Row key={index} className="mb-4 text-center">
              {videos.slice(index, index + 5).map((video) => (
                <Col key={video.etag} xs={12} md={2} className="mb-4">
                  <Card>
                    <Card.Img
                      variant="top"
                      src={video.snippet.thumbnails.default.url}
                      alt={video.snippet.title}
                      onClick={() => handleShow(video.id.videoId)}
                      style={{ cursor: 'pointer', width: '100%', height: '120px', objectFit: 'cover' }}
                    />
                    <Card.Body>
                      <Card.Title>{video.snippet.title}</Card.Title>
                      <Button  className="btn btn-primary" onClick={() => toggleVideoSelection(video.id.videoId)}>
      {selectedVideos.includes(video.id.videoId) ? "Selected" : "Select"} </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )
        ))}
    <Button
  variant="primary"
  onClick={uploadSelectedVideos}
  disabled={selectedVideos.length === 0}
>
  Upload Selected Videos
</Button>
      </Container>
      
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Playing Video</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedVideo && (
            <iframe
              title="videoPlayer"
              width="100%"
              height="400"
              src={`https://www.youtube.com/embed/${selectedVideo}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
        
      </Modal>
     
    </Container>
  );
};

export default YoutubeVideos;
