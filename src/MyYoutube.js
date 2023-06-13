import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Modal, Button } from 'react-bootstrap';
import axios from 'axios'

const MyYoutubeVideos = () => {
 
  const [videos, setVideos] = useState([]);
  const [selectedVideos, setSelectedVideos]=useState([])

  const [videoSelectedFlags, setVideoSelectedFlags] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const API_KEY = 'AIzaSyDaWQxxaNVRS0q5Noyt-EUHRPbhwfXomIg'; // Replace with your YouTube Data API v3 key
  const channelId = 'UC9BOF_QyhqixZ0CFj_NuG-w';

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
    const API_BASE_URL = 'http://222.112.183.197:3010';

    for (const videoId of selectedVideos) {
      console.log(videoId)
      try {
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        console.log(videoUrl)

        const response = await axios.post(`${API_BASE_URL}/download`, { videoUrl }, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          console.log("Upload successful:", response.data);
        } else {
          console.error("Upload failed:", response.status);
        }
      } catch (error) {
        console.error("Error uploading video:", error);
      }
    }
  };

  useEffect(() => {
    console.log('Running useEffect')
    async function fetchVideos() {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=10&order=date&type=video&key=${API_KEY}`
        );
        const data = await response.json();
        setVideos(data.items);
        console.log(videos);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    }
    fetchVideos();
  }, []); // Added empty dependency array
  

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
                    </Card.Body>
                    <Button  className="btn btn-primary" onClick={() => toggleVideoSelection(video.id.videoId)}>
      {selectedVideos.includes(video.id.videoId) ? "Selected" : "Select"} </Button>
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

export default MyYoutubeVideos