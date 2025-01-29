import React from 'react';
import styles from './Instructions.module.css';

const Instructions = ({ gameTitle, subheader, icon, instructionsText, onClose }) => {
  return (
    <div className={styles.instructionsOverlay}>
      <div className={styles.instructions}>
        <button className={`btn-close ${styles.close}`} onClick={onClose}>X</button>
        <h2>{gameTitle}</h2>
        <h4>{subheader}</h4>
        <img className={styles.icon} src={icon} alt={`${gameTitle} Icon`} />
        <p>{instructionsText}</p>
      </div>
    </div>
  );
};

export default Instructions;
