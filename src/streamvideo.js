import React from 'react';
import { Card } from 'react-bootstrap';

const VideoPlayer = ({cid}) => {


    const videoSrc = `https://ipfs.io/ipfs//gw/ipfs/${cid.cid}`;
    console.log(videoSrc)
    
     return (
           <>
            <Card.Body>
                <Card.Title>Screen_shot</Card.Title>
                <video controls src={videoSrc} style={{width: "50%"}} />
            </Card.Body>        
            </>
    );
}

export default VideoPlayer;
// Create a data base that will store the filename and cid of the data that are stored. 
// Later we  need to maintain the;
// As the number of user increases, then we will manage the database that will be customized to each user that
// has the number,