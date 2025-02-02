import React, { useEffect, useState } from 'react';
import { database } from '../../firebase';
import { ref, get, push, set } from 'firebase/database';
import styles from './BlackJack.module.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar';

const icon = require('./icon.png');

const BlackJack = () => {
  const [option, setOption] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleCreateGame = async () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    await set(ref(database, 'games/' + code), {
      host: true,
      players: {},
      status: 'waiting',
      createdAt: Date.now()
    });
    setCode(code);
    navigate(`/blackjack-dealer/${code}`);
  };

  const handleJoinGame = async () => {
    if (!name.trim()) {
      alert('Please enter your name.');
      return;
    }
    const gameRef = ref(database, 'games/' + code.toUpperCase());
    const snapshot = await get(gameRef);
    if (snapshot.exists()) {
      const playerData = { name, joinedAt: Date.now() };
      const playersRef = ref(database, 'games/' + code.toUpperCase() + '/players');
      const newPlayerRef = push(playersRef);
      const newPlayerKey = newPlayerRef.key;
      await set(ref(database, 'games/' + code.toUpperCase() + '/players/' + newPlayerKey), playerData);
      localStorage.setItem('playerId', newPlayerKey);
      localStorage.setItem('playerName', name);
      navigate(`/blackjack-player/${code}`);
    } else {
      alert('Game not found.');
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.blackjackContainer}>
        <img src={icon} alt="Blackjack Icon" className={styles.gameIcon} />
        <h1>Online Blackjack</h1>
        <div className={styles.optionButtons}>
          <button className={styles.button} onClick={handleCreateGame}>
            <span className={styles.buttonIcon}>🎰</span>
            Create Game
          </button>
          <button className={styles.button} onClick={() => setOption('join')}>
            <span className={styles.buttonIcon}>👥</span>
            Join Game
          </button>
        </div>
        {option === 'join' && (
          <div className={styles.joinGameForm}>
            <input
              type="text"
              placeholder="Enter game code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button className={`${styles.joinButton} ${styles.button}`} onClick={handleJoinGame}>
              <span className={styles.buttonIcon}>🚪</span>
              Join Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlackJack;
