import React from 'react';
import ReactDOM from 'react-dom';

const Component1 = () => {
  return (
    <div style={{ display: 'inline-block', backgroundColor: 'grey', width: '100px',margin:'10px', height: '25px' }}>
      Component 1
    </div>
  );
};

const Component2 = () => {
  return (
    <div style={{ display: 'inline-block', backgroundColor: 'green', width: '100px',margin:'10px', height: '25px' }}>
      Component 2
    </div>
  );
};

const Test = () => {
  return (
    <div style={{ display:'flex', justifyContent: 'center' }}>
      <Component1 />
      <Component2 />
    </div>
  );
};

export default Test
