import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, onValue, set } from 'firebase/database';
import { database } from '../../firebase';
import Card from '../../Components/Card';
import styles from './Player.module.css';

const player_icon = require('./player_icon.png');

const Player = () => {
  const { gameCode } = useParams();
  const navigate = useNavigate();
  const playerId = localStorage.getItem('playerId');
  const [playerData, setPlayerData] = useState({ name: 'Your Name', hand: [], bet: undefined });
  const [betInput, setBetInput] = useState('');
  const [playersList, setPlayersList] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [doubleConfirm, setDoubleConfirm] = useState(false);
  const [busted, setBusted] = useState(false);
  const [gameStatus, setGameStatus] = useState(null);

  useEffect(() => {
    if (!playerId) return;
    const playerRef = ref(database, `games/${gameCode}/players/${playerId}`);
    const unsubscribe = onValue(playerRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setPlayerData(data);
    });
    return () => unsubscribe();
  }, [gameCode, playerId]);

  useEffect(() => {
    const playersRef = ref(database, `games/${gameCode}/players`);
    const unsubPlayers = onValue(playersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const playersArr = Object.entries(data).map(([id, player]) => ({ id, ...player }));
        playersArr.sort((a, b) => a.joinedAt - b.joinedAt);
        setPlayersList(playersArr);
      }
    });
    return () => unsubPlayers();
  }, [gameCode]);

  useEffect(() => {
    const turnRef = ref(database, `games/${gameCode}/currentTurn`);
    const unsubTurn = onValue(turnRef, (snapshot) => {
      setCurrentTurn(snapshot.val());
    });
    return () => unsubTurn();
  }, [gameCode]);

  useEffect(() => {
    const statusRef = ref(database, `games/${gameCode}/status`);
    const unsubStatus = onValue(statusRef, (snapshot) => {
      setGameStatus(snapshot.val());
    });
    return () => unsubStatus();
  }, [gameCode]);

  const isMyTurn = currentTurn === playerId;

  const getNextTurn = () => {
    if (!playersList || playersList.length === 0) return playerId;
    const currentIndex = playersList.findIndex((p) => p.id === playerId);
    return currentIndex === playersList.length - 1 ? 'dealer' : playersList[currentIndex + 1].id;
  };

  const getRandomCard = (faceUp = true) => {
    const suits = ['H', 'D', 'C', 'S'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const value = values[Math.floor(Math.random() * values.length)];
    return { suit, value, faceUp };
  };

  const handleBetSubmit = async (e) => {
    e.preventDefault();
    const betValue = betInput === '' ? 0 : parseInt(betInput, 10);
    await set(ref(database, `games/${gameCode}/players/${playerId}/bet`), betValue);
    setBetInput('');
  };

  const handleHit = async () => {
    const newCard = getRandomCard(true);
    const updatedHand = playerData.hand ? [...playerData.hand, newCard] : [newCard];
    await set(ref(database, `games/${gameCode}/players/${playerId}/hand`), updatedHand);
  };

  const handleStand = async () => {
    await set(ref(database, `games/${gameCode}/currentTurn`), getNextTurn());
    setBusted(false);
  };

  const handleDouble = () => {
    setDoubleConfirm(true);
  };

  const handleDoubleConfirm = async (faceUpChoice) => {
    const newCard = getRandomCard(faceUpChoice);
    const updatedHand = playerData.hand ? [...playerData.hand, newCard] : [newCard];
    await set(ref(database, `games/${gameCode}/players/${playerId}/hand`), updatedHand);
    const currentBet = playerData.bet || 0;
    await set(ref(database, `games/${gameCode}/players/${playerId}/bet`), currentBet * 2);
    await set(ref(database, `games/${gameCode}/currentTurn`), getNextTurn());
    setDoubleConfirm(false);
    setBusted(false);
  };

  const calculateHandValue = (hand) => {
    let total = 0;
    let aceCount = 0;
    hand.forEach((card, index) => {
      if (index >= 2 && !card.faceUp) return;
      let value = 0;
      if (card.value === 'J' || card.value === 'Q' || card.value === 'K') {
        value = 10;
      } else if (card.value === 'A') {
        value = 11;
        aceCount++;
      } else {
        value = parseInt(card.value, 10);
      }
      total += value;
    });
    while (total > 21 && aceCount > 0) {
      total -= 10;
      aceCount--;
    }
    return total;
  };

  const handValue = calculateHandValue(playerData.hand || []);

  useEffect(() => {
    if (isMyTurn && handValue > 21 && !busted) {
      setBusted(true);
      setTimeout(() => {
        handleStand();
      }, 2000);
    }
  }, [handValue, isMyTurn, busted]);

  const handleLeaveGame = async () => {
    await set(ref(database, `games/${gameCode}/players/${playerId}`), null);
    navigate('/blackjack');
  };

  return (
    <div className={styles.container}>
      <div className={styles.playerCard}>
        <img src={player_icon} alt="Player" className={styles.playerIcon} />
        <p className={styles.playerName}>{playerData.name}</p>
        {playerData.bet !== undefined ? (
          <p className={styles.playerBet}>🥤 Drinks Bet: {playerData.bet}</p>
        ) : (
          <form onSubmit={handleBetSubmit} className={styles.betForm}>
            <input
              type="number"
              value={betInput}
              onChange={(e) => setBetInput(e.target.value)}
              placeholder="Enter drinks bet"
              className={styles.betInput}
            />
            <button type="submit" className={styles.betButton}>
              <span className={styles.buttonIcon}>💸</span>
              Place Bet
            </button>
          </form>
        )}
        <div className={styles.playerCards}>
          {playerData.hand && playerData.hand.length > 0 ? (
            playerData.hand.map((card, index) => (
              <Card
                key={index}
                value={card.value}
                suit={card.suit}
                faceUp={card.faceUp}
                className={styles.card}
                nonFlippable={true}
              />
            ))
          ) : (
            <>
              <img src={require('../../Images/cards/blank_card.png')} alt="Card 1" className={styles.card} />
              <img src={require('../../Images/cards/blank_card.png')} alt="Card 2" className={styles.card} />
            </>
          )}
        </div>
        <p className={styles.handValue}>🃏 Hand Value: {handValue}</p>
        {gameStatus !== 'ended' ? (
          isMyTurn ? (
            <>
              {busted ? (
                <p className={styles.bustMessage}>💥 Busted! Your hand exceeds 21.</p>
              ) : (
                <div className={styles.turnActions}>
                  <p className={styles.turnMessage}>🎲 It's your turn!</p>
                  {!doubleConfirm ? (
                    <div className={styles.actionButtons}>
                      <button onClick={handleHit} className={styles.actionButton}>
                        <span className={styles.buttonIcon}>➕</span>
                        Hit
                      </button>
                      <button onClick={handleStand} className={styles.actionButton}>
                        <span className={styles.buttonIcon}>✋</span>
                        Stand
                      </button>
                      {playerData.hand && playerData.hand.length === 2 && (
                        <button onClick={handleDouble} className={styles.actionButton}>
                          <span className={styles.buttonIcon}>⏫</span>
                          Double
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className={styles.doubleConfirm}>
                      <p>Double: Choose card orientation</p>
                      <div className={styles.doubleButtons}>
                        <button onClick={() => handleDoubleConfirm(true)} className={styles.actionButton}>
                          <span className={styles.buttonIcon}>🔼</span>
                          Face-Up
                        </button>
                        <button onClick={() => handleDoubleConfirm(false)} className={styles.actionButton}>
                          <span className={styles.buttonIcon}>🔽</span>
                          Face-Down
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <p className={styles.waitingMessage}>
              ⏳ Waiting for {playersList.find((p) => p.id === currentTurn)?.name}'s turn...
            </p>
          )
        ) : (
          playerData.result && (
            <div className={`${styles.result} ${styles[playerData.result.outcome]}`}>
              {playerData.result.outcome === 'lose' && (
                <p className={styles.resultText}>🍹 Drink {playerData.result.drinks} drinks!</p>
              )}
              {playerData.result.outcome === 'win' && (
                <p className={styles.resultText}>🎉 You won! Dealer drinks {playerData.result.drinks}!</p>
              )}
              {playerData.result.outcome === 'tie' && (
                <p className={styles.resultText}>🤝 Push! No drinks.</p>
              )}
              {playerData.result.outcome === 'blackjack' && (
                <p className={styles.resultText}>♠️ Blackjack! Dealer drinks {playerData.result.drinks}!</p>
              )}
            </div>
          )
        )}
      </div>
      <button onClick={handleLeaveGame} className={styles.leaveButton}>
        <span className={styles.buttonIcon}>🚪</span>
        Leave Game
      </button>
    </div>
  );
};

export default Player;
