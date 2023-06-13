import React from 'react';
import { Container, Image, Card } from 'react-bootstrap';

const Logo = () => {
  return (
    <div className="d-flex justify-content-center mt-3">
      <Image
        src="http://222.112.183.197:3004/gw/ipfs/bafkreia2qctmw6nsbrr4d4vwukyfovsky3ye53khgoibg7nvtdoyytcqye"
        alt="Logo"
        fluid
        className="mt-1"
        style={{ maxWidth: '300px' }}
      />
    </div>
  );
};

export default Logo;
