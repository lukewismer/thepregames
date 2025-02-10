import React, { useState, useEffect } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { useParams, useNavigate } from 'react-router-dom';
import { database } from '../../firebase';
import styles from './Dealer.module.css';
import Card from '../../Components/Card';

const dealer_icon = require('./dealer_icon.webp');
const player_icon = require('./player_icon.png');
const card_back = require('../../Images/cards/back_of_card.png');
const blank_card = require('../../Images/cards/blank_card.png');
const back_of_card = require('../../Images/cards/back_of_card.png');

const getRandomCard = (faceUp = true) => {
  const suits = ['H', 'D', 'C', 'S'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const suit = suits[Math.floor(Math.random() * suits.length)];
  const value = values[Math.floor(Math.random() * values.length)];
  return { suit, value, faceUp };
};

const Dealer = () => {
  const { gameCode } = useParams();
  const [players, setPlayers] = useState([]);
  const [gameStatus, setGameStatus] = useState('waiting');
  const [dealerHand, setDealerHand] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [roundFinished, setRoundFinished] = useState(false);
  const [dealerResult, setDealerResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const playersRef = ref(database, `games/${gameCode}/players`);
    const unsubscribe = onValue(playersRef, (snapshot) => {
      const data = snapshot.val();
      const playersArr = data ? Object.entries(data).map(([id, player]) => ({ id, ...player })) : [];
      setPlayers(playersArr);
    });
    return () => unsubscribe();
  }, [gameCode]);

  useEffect(() => {
    const statusRef = ref(database, `games/${gameCode}/status`);
    const unsubStatus = onValue(statusRef, (snapshot) => {
      const status = snapshot.val();
      if (status) setGameStatus(status);
    });
    return () => unsubStatus();
  }, [gameCode]);

  useEffect(() => {
    const dealerRef = ref(database, `games/${gameCode}/dealer/hand`);
    const unsubDealer = onValue(dealerRef, (snapshot) => {
      const data = snapshot.val();
      setDealerHand(data || []);
    });
    return () => unsubDealer();
  }, [gameCode]);

  useEffect(() => {
    const turnRef = ref(database, `games/${gameCode}/currentTurn`);
    const unsubTurn = onValue(turnRef, (snapshot) => {
      setCurrentTurn(snapshot.val());
    });
    return () => unsubTurn();
  }, [gameCode]);

  useEffect(() => {
    const dealerResultRef = ref(database, `games/${gameCode}/dealer/result`);
    const unsubDealerResult = onValue(dealerResultRef, (snapshot) => {
      setDealerResult(snapshot.val());
    });
    return () => unsubDealerResult();
  }, [gameCode]);

  const calculateHandValueDealer = (hand, countAll = false) => {
    let total = 0;
    let aceCount = 0;
    for (const card of hand) {
      if (!countAll && !card.faceUp) continue;
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
    }
    while (total > 21 && aceCount > 0) {
      total -= 10;
      aceCount--;
    }
    return total;
  };

  const calculateHandValuePlayer = (hand) => {
    let total = 0;
    let aceCount = 0;
    hand.forEach((card, index) => {
      // Only count cards beyond the first two if they are revealed.
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

  const generateDeck = () => {
    const suits = ['H', 'D', 'C', 'S'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    let deck = [];
    for (let i = 0; i < 8; i++) {
      for (const suit of suits) {
        for (const value of values) {
          deck.push({ suit, value });
        }
      }
    }
    return deck;
  };

  const shuffleDeck = (deck) => {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleStartGame = async () => {
    const deck = shuffleDeck(generateDeck());
    const workingDeck = [...deck];

    const dealtDealerHand = [
      { ...workingDeck.shift(), faceUp: true },
      { ...workingDeck.shift(), faceUp: false },
    ];

    for (const player of players) {
      const hand = [
        { ...workingDeck.shift(), faceUp: true },
        { ...workingDeck.shift(), faceUp: true },
      ];
      await set(ref(database, `games/${gameCode}/players/${player.id}/hand`), hand);
      if (player.bet === undefined) {
        await set(ref(database, `games/${gameCode}/players/${player.id}/bet`), 0);
      }
    }

    await set(ref(database, `games/${gameCode}/dealer/hand`), dealtDealerHand);
    if (players.length > 0) {
      await set(ref(database, `games/${gameCode}/currentTurn`), players[0].id);
    }
    await set(ref(database, `games/${gameCode}/status`), 'inProgress');
    console.log('Game started for', gameCode);
  };

  const handleCancelGame = () => {
    setPlayers([]);
    setGameStatus('waiting');
    setDealerHand([]);
    setCurrentTurn(null);
    setRoundFinished(false);
    set(ref(database, `games/${gameCode}`), null);
    navigate('/blackjack');
  };

  const handleRestartGame = async () => {
    await set(ref(database, `games/${gameCode}/dealer/hand`), []);
    await set(ref(database, `games/${gameCode}/dealer/result`), null);
    await set(ref(database, `games/${gameCode}/currentTurn`), null);
    await set(ref(database, `games/${gameCode}/status`), 'waiting');
    for (const player of players) {
      await set(ref(database, `games/${gameCode}/players/${player.id}/hand`), []);
      await set(ref(database, `games/${gameCode}/players/${player.id}/result`), null);
      await set(ref(database, `games/${gameCode}/players/${player.id}/bet`), null);
    }
    setRoundFinished(false);
    setDealerResult(null);
    setDealerHand([]);
  };

  const handleLeaveGame = () => {
    set(ref(database, `games/${gameCode}`), null);
    navigate('/blackjack');
  };

  const getPlayerIndex = (id) => players.findIndex((player) => player.id === id);

  const advanceTurn = async () => {
    if (players.length === 0) return;
    const currentIndex = getPlayerIndex(currentTurn);
    if (currentIndex === -1) return;
    if (currentIndex === players.length - 1) {
      await set(ref(database, `games/${gameCode}/currentTurn`), 'dealer');
    } else {
      await set(ref(database, `games/${gameCode}/currentTurn`), players[currentIndex + 1].id);
    }
  };

  useEffect(() => {
    if (gameStatus === 'inProgress' && currentTurn !== 'dealer') {
      const currentPlayer = players.find((p) => p.id === currentTurn);
      if (currentPlayer && currentPlayer.hand && currentPlayer.hand.length === 2 && calculateHandValuePlayer(currentPlayer.hand, true) === 21) {
        const bet = currentPlayer.bet || 0;
        set(ref(database, `games/${gameCode}/players/${currentPlayer.id}/result`), { outcome: 'blackjack', drinks: bet * 1.5 });
        advanceTurn();
      }
    }
  }, [currentTurn, gameStatus, players]);

  const finishRound = async () => {
    if (roundFinished) return;
    setRoundFinished(true);
    console.log('Finishing round...');
  
    // Flip all players' cards faceUp.
    const updatedPlayers = players.map((player) => {
        if (player.hand) {
          const flippedHand = player.hand.map((card) => ({ ...card, faceUp: true }));
          // Update Firebase
          set(ref(database, `games/${gameCode}/players/${player.id}/hand`), flippedHand);
          return { ...player, hand: flippedHand };
        }
        return player;
    });

    setPlayers(updatedPlayers);

    console.log(players);
  
    // Flip dealer's cards faceUp.
    let currentDealerHand = dealerHand.map((card) => ({ ...card, faceUp: true }));
    await set(ref(database, `games/${gameCode}/dealer/hand`), currentDealerHand);
  
    // Dealer draws until hand value reaches at least 17.
    while (calculateHandValueDealer(currentDealerHand) < 17) {
      const newCard = getRandomCard(true);
      currentDealerHand = [...currentDealerHand, newCard];
      await set(ref(database, `games/${gameCode}/dealer/hand`), currentDealerHand);
    }
    const dealerValue = calculateHandValuePlayer(currentDealerHand);
  
    let totalDealerDrinks = 0;
    for (const player of players) {
      const playerHandValue = calculateHandValuePlayer(player.hand || [], true);
      const bet = player.bet || 0;
      
      // Handle blackjack separately.
      if (player.hand && player.hand.length === 2 && playerHandValue === 21) {
        const outcome = 'blackjack';
        const drinks = bet * 1.5;
        totalDealerDrinks += drinks;
        await set(ref(database, `games/${gameCode}/players/${player.id}/result`), { outcome, drinks });
        continue;
      }
      
      let outcome, drinks;
      // If both bust, it's a tie.
      if (playerHandValue > 21 && dealerValue > 21) {
        outcome = 'tie';
        drinks = 0;
      } else if (playerHandValue > 21) {
        outcome = 'lose';
        drinks = bet;
      } else if (dealerValue > 21) {
        outcome = 'win';
        drinks = bet;
        totalDealerDrinks += bet;
      } else if (playerHandValue > dealerValue) {
        outcome = 'win';
        drinks = bet;
        totalDealerDrinks += bet;
      } else if (playerHandValue < dealerValue) {
        outcome = 'lose';
        drinks = bet;
      } else {
        outcome = 'tie';
        drinks = 0;
      }
      await set(ref(database, `games/${gameCode}/players/${player.id}/result`), { outcome, drinks });
    }
    await set(ref(database, `games/${gameCode}/dealer/result`), totalDealerDrinks);
    await set(ref(database, `games/${gameCode}/status`), 'ended');
  };
  

  useEffect(() => {
    if (gameStatus === 'inProgress' && currentTurn === 'dealer') {
      finishRound();
    }
  }, [currentTurn, gameStatus]);

  return (
    <div className={styles.container}>
      <div className={styles.dealerSection}>
        <img src={dealer_icon} alt="Dealer" className={styles.dealerIcon} />
        <div className={styles.deck}>
          <img src={card_back} alt="Deck" className={styles.deckCard} />
        </div>
        {(gameStatus === 'inProgress' || gameStatus === 'ended') && (
          <>
            <div className={styles.dealerHand}>
              {dealerHand.map((card, index) => (
                <div key={index} className={styles.dealerCard}>
                  {card.faceUp ? (
                    <div className={styles.cardFront}>
                      <Card key={index} value={card.value} suit={card.suit} faceUp className={styles.cardFront} nonFlippable={true} />
                    </div>
                  ) : (
                    <img src={back_of_card} alt="Card back" className={styles.card} />
                  )}
                </div>
              ))}
            </div>
            {dealerHand.length > 0 && (
              <p className={styles.handValue}>
                Dealer Hand Value: {calculateHandValueDealer(dealerHand)}
              </p>
            )}
          </>
        )}
      </div>
      <div className={styles.gameControls}>
        {gameStatus === 'waiting' && (
          <>
            <p className={styles.gameCode}>Game Code: {gameCode}</p>
            <div className={styles.buttons}>
              <button onClick={handleCancelGame} className={`${styles.cancelBtn} ${styles.button}`}>
                <span className={styles.buttonIcon}>🚫</span>
                Cancel Game
              </button>
              <button onClick={handleStartGame} className={`${styles.startBtn} ${styles.button}`}>
                <span className={styles.buttonIcon}>🎮</span>
                Start Game
              </button>
            </div>
          </>
        )}
      </div>
      {gameStatus === 'inProgress' &&
        currentTurn &&
        players.find((player) => player.id === currentTurn) && (
          <div className={styles.turnIndicator}>
            <p>
              🎲 Current Turn: {players.find((player) => player.id === currentTurn)?.name || currentTurn}
            </p>
          </div>
        )}
      {gameStatus === 'ended' && dealerResult !== null && (
        <>
          <div className={styles.dealerResult}>
            <p className={styles.resultText}>🥤 Dealer drinks {dealerResult} drinks!</p>
          </div>
          <div className={styles.endControls}>
            <button onClick={handleRestartGame} className={`${styles.restartBtn} ${styles.button}`}>
              <span className={styles.buttonIcon}>🔄</span>
              Restart Game
            </button>
            <button onClick={handleLeaveGame} className={`${styles.leaveBtn} ${styles.button}`}>
              <span className={styles.buttonIcon}>🚪</span>
              Leave Game
            </button>
          </div>
        </>
      )}
      <div className={styles.playersSection}>
        {players.map((player) => {
          const playerHandValue = player.hand ? calculateHandValuePlayer(player.hand, true) : 0;
          const isBust = playerHandValue > 21;
          const outcomeClass =
            gameStatus === 'ended' && player.result
              ? player.result.outcome === 'win' || player.result.outcome === 'blackjack'
                ? styles.win
                : player.result.outcome === 'tie'
                ? styles.tie
                : player.result.outcome === 'lose'
                ? styles.lose
                : ''
              : '';
          return (
            <div
              key={player.id}
              className={`${styles.playerCard} ${player.id === currentTurn ? styles.active : ''} ${outcomeClass}`}
            >
              <img src={player_icon} alt="Player" className={styles.playerIcon} />
              <p className={styles.playerName}>{player.name}</p>
              <p className={styles.playerBet}>
                Drinks Bet: {player.bet !== undefined && player.bet !== null ? player.bet : ''}
              </p>
              <div className={styles.playerCards}>
                {player.hand && player.hand.length > 0 ? (
                  player.hand.map((card, index) => {
                    return (
                      <Card
                        key={index}
                        value={card.value}
                        suit={card.suit}
                        faceUp={card.faceUp}
                        className={styles.card}
                        nonFlippable={true}
                      />
                    );
                  })
                ) : (
                  <>
                    <img src={blank_card} alt="Card 1" className={styles.card} />
                    <img src={blank_card} alt="Card 2" className={styles.card} />
                  </>
                )}
              </div>
              <p className={styles.handValue}>
                Hand Value: {playerHandValue} {isBust && <span className={styles.bustMessage}>Busted!</span>}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dealer;
