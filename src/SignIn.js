import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './context';
import { Container, Card, Row, Col, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import Logo from './logo.js';
import axios from 'axios';

function SignIn() {
  const navigate = useNavigate();
  const {  email, setEmail, userId, setUserId, password, setPassword, loggedIn, setLoggedIn } = useContext(UserContext);
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('')
   const [uniqueId, setUniqueId]=useState('')

  const handleSignIn = async (e) => {
    e.preventDefault();
    // Perform validation checks on the form data
    if (!email  || !password) {
      alert('Please fill in all fields');
      return;
    }
    const signinInfo={
      "email":String(email) , 
      "password":String(password),    
 }
    const xhrSignin= new XMLHttpRequest();
    xhrSignin.open('POST',"http://222.112.183.197:3007/Signin");
    xhrSignin.withCredentials=true;
    xhrSignin.onload=()=>{
     if( xhrSignin.status===200){
      const response = JSON.parse(xhrSignin.responseText);
      if (response.message === 'Sign in successful') {
         setUserId(response.userId)
         setLoggedIn(true)
         localStorage.setItem('userId', response.userId)
      //  console.log(response.userId)
       // console.log(userId)
        console.log('Sign in successful');
        navigate('/manualupload');
      } else {
        console.log('Sign in failed:');
        alert('Your email and password do not match.')
        setEmail('')
        setPassword('')
    }
  } else {
    console.log('Error:', xhrSignin.status, xhrSignin.statusText);
  }
};

xhrSignin.send(JSON.stringify(signinInfo));
};

  // Redirect towards the "signup page "
  const GotoSignup=()=>{
    navigate("/signup")
  }

 

  return (
    <>
      <Logo />
      <br></br>
      <Container className="d-flex justify-content-center align-items-center vh-10">
        <Card >
          <Card.Body>
            <Card.Title className="text-center mb-4">Login </Card.Title>
            <Form onSubmit={handleSignIn}>
           

              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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

             
            <br></br>
              <div className="text-center">
                <Button variant="primary" type="submit">
                  Sign in
                </Button>
              </div>
              <h5>If you havent  sign up yet, go to Signup page.</h5>
              <div className="text-center">
              <Button variant="primary" onClick={GotoSignup}>
                  Go to Signup Page
                </Button>
              </div>
     
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default SignIn;
