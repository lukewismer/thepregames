import React from 'react';
import './Instructions.css';

const Instructions = ({ gameTitle, subheader, icon, instructionsText, onClose }) => {
  return (
    <div className="instructions-overlay">
      <div className="instructions">
        <button className="close" onClick={onClose}>X</button>
        <h2>{gameTitle}</h2>
        <h3>{subheader}</h3>
        <img className="instructions-icon" src={icon} alt={`${gameTitle} Icon`} />
        <p>{instructionsText}</p>
      </div>
    </div>
  );
};

export default Instructions;
