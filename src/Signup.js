import React, { useState, useContext } from 'react';
import { UserContext } from './context.js';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from './logo.js';
import axios from 'axios'

function Signup() {
  const navigate = useNavigate();
  const { fullName, setFullName, email, setEmail, userId, setUserId, password, setPassword } = useContext(UserContext);
  // const [fullName, setFullName] = useState('');
  // const [email, setEmail] = useState('');
  // const [userId, setUserId] = useState('');
  // const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
  const [uniqueId, setUniqueId]= useState('')

  const handleSignup = async (e) => {
    e.preventDefault();
    // Perform validation checks on the form data
    if (!fullName || !email || !userId || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const isUserIdAvailiable= await checkUserIdAvailability(userId)
    if (!isUserIdAvailiable){
      alert('UserId already exists. Please choose a different User Id.')
      return 
    }
    // Password validation 
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
    if (!passwordRegex.test(password)) {
      alert(
        'Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.'
      );
      return;
    }
   
    const signupInfo={
         "fullName":String(fullName),
         "email":String(email) , 
         "userId":String(userId),
         "password":String(password),    
    }
      console.log(signupInfo)
       const xhrSignup= new XMLHttpRequest();
       xhrSignup.open('POST',"http://222.112.183.197:3007/Signup");
       xhrSignup.withCredentials=true;
       xhrSignup.onload=()=>{
        if( xhrSignup.status===200){
          console.log('Meta information saved sucessfully');
        } else{
          console.log("Error Saving meta information:",   xhrSignup.status,  xhrSignup.statusText);
        }
      }
      xhrSignup.send(JSON.stringify(signupInfo))
          navigate('/manualupload');
        } 
  
        const checkUserIdAvailability = (userId) => {
          return new Promise((resolve, reject) => {
            const userID={
              "userId":String(userId)
            }
            const xhr = new XMLHttpRequest();
            xhr.open('POST', "http://222.112.183.197:3007/CheckUserId");
            xhr.withCredentials=true
            xhr.onload = () => {
              if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                resolve(data.available);
              } else {
                reject(new Error(`Error: ${xhr.status} ${xhr.statusText}`));
              }
            };
            xhr.onerror = () => {
              reject(new Error('Network error'));
            };
            xhr.send(JSON.stringify(userID));
          });
        };
        
  const GotoLogin=()=>{
    navigate("/signin")
  }
 return (
    <>
      <Logo />
      <br></br>
      <Container className="d-flex justify-content-center align-items-center vh-10">
        <Card >
          <Card.Body>
            <Card.Title className="text-center mb-4">Sign up</Card.Title>
            <Form onSubmit={handleSignup}>
              <Form.Group controlId="fullName">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="userId">
                <Form.Label>User ID</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your user ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Form.Group>
            <br></br>
              <div className="text-center">
                <Button variant="primary" type="submit">
                  Sign up
                </Button>
              </div>
              <h5>If you have already sign up, go to login page.</h5>
              <div className="text-center">
              <Button variant="primary" onClick={GotoLogin}>
                  Go to Login Page
                </Button>
              </div>
     
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
  }

export default Signup;
