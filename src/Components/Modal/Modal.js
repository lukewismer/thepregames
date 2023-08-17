import React from 'react';
import './Modal.css';

const Modal = ({ header, message, buttonText, onButtonClick }) => {
    return (
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">{header}</div>
          <div className="modal-body">{message}</div>
          <button className="modal-button" onClick={onButtonClick}>{buttonText}</button>
        </div>
      </div>
    );
  };

export default Modal;