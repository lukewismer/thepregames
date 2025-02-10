import React from 'react';
import styles from './Instructions.module.css';

const Instructions = ({ gameTitle, subheader, icon, instructionsText, onClose }) => {
  return (
    <div className={styles.instructionsOverlay}>
      <div className={styles.instructions}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        <div className={styles.header}>
          <img className={styles.icon} src={icon} alt={`${gameTitle} Icon`} />
          <div className={styles.textHeader}>
            <h2 className={styles.title}>{gameTitle}</h2>
            <h4 className={styles.subheader}>{subheader}</h4>
          </div>
        </div>
        <p className={styles.instructionsText}>{instructionsText}</p>
      </div>
    </div>
  );
};

export default Instructions;