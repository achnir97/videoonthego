import { MDBIcon } from 'mdb-react-ui-kit';
import React from 'react';
import { Container, Row, Col, Nav, Button } from 'react-bootstrap';
import { useContext } from 'react';
import { UserContext } from './context';
import "./style.css"

const Navbar = () => {

  const { loggedIn, userId, folderInfo, setFolderInfo } = useContext(UserContext);
  const ShareVideos = () => {

  }
  const handleAlbumClick = () => {

  }

  return (
    <div className="navbar-wrapper" style={{ backgroundImage: "url('main-qimg-17171d80c6e248ecebfbc5604474bc1c-lq.jpg')" }}>
    <Container fluid>
      <Row>
        <Col sm={2}>
          {/* Sidebar content */}
        </Col>
        <Col sm={10}>

          <nav>
            <ul class='nav-list'>
          
              <a href='#'> Home</a>
              <a href='/manualupload'> Video</a>
              <a href="/photogallery"> Photos</a>
              <a href="/channel"> Album</a>
              <a href='/upload'> Upload</a>
              <a href='/signin'> Logout</a>
            </ul>
          </nav>
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default Navbar ;
