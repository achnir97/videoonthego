import React from 'react'
import { MDBIcon } from 'mdb-react-ui-kit';

export const RenameandDelete = ({ renameFolder, DeleteFolder, handleCancel }) => {
    return (
      <div
        style={{
          position: 'absolute',
          top: '250%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          background: 'white', // Set the background color to white
          padding: '2rem', // Set a higher z-index to ensure it appears above the overlay
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>

          <div>    
          <button onClick={renameFolder} style={{ fontSize: 'small', marginRight: '0.5rem' }}>
            Rename
          </button>
          </div>  
          <button onClick={DeleteFolder} style={{ fontSize: 'small',marginRight: '0.5rem'}}>
            Delete
          </button>
          <button onClick={handleCancel} style={{ fontSize: 'small' }}>
            Cancel
          </button>
        </div>
      </div>
    );
  };