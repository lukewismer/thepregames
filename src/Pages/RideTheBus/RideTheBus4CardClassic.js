import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import Card from '../../Components/Card';
import Instructions from '../../Components/Instructions-Popup/Instructions';
import { FaQuestion } from 'react-icons/fa';
import styles from './RideTheBus.module.css';

// Constants
const SUITS = ['H', 'C', 'D', 'S'];
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const icon = require('./bus_icon.png');
const blank_card = require('../../Images/cards/blank_card.png');
const back_of_card = require('../../Images/cards/back_of_card.png');

function generateDeck() {
  const deck = [];
  for (const suit of SUITS) {
    for (const value of VALUES) {
      deck.push({ suit, value });
    }
  }
  return deck;
}

function shuffleDeck(deck) {
  const arr = [...deck];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const initialButtonState = {
  red: false,
  black: false,
  higher: false,
  lower: false,
  inside: false,
  outside: false,
  hearts: false,
  diamonds: false,
  clubs: false,
  spades: false,
};

function RideTheBus_4CardClassic() {
  // Generate and shuffle once on mount:
  const [deck, setDeck] = useState(() => shuffleDeck(generateDeck()));
  const [topCardIndex, setTopCardIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);

  const initialGameState = {
    card: null,
    done: false,
    guess: null,
    isButtonDark: { ...initialButtonState },
  };

  const [rows, setRows] = useState([
    { ...initialGameState, guess: 'red' },
    { ...initialGameState, guess: 'higher' },
    { ...initialGameState, guess: 'inside' },
    { ...initialGameState, guess: 'hearts' },
  ]);

  // Shuffle / Restart game
  const handleShuffle = useCallback(() => {
    const newDeck = shuffleDeck(generateDeck());
    setDeck(newDeck);
    setTopCardIndex(0);
    setIsFinished(false);
    // Reset rows to initial
    setRows([
      { ...initialGameState, guess: 'red' },
      { ...initialGameState, guess: 'higher' },
      { ...initialGameState, guess: 'inside' },
      { ...initialGameState, guess: 'hearts' },
    ]);
  }, [initialGameState]);

  // Check guess logic
  const checkGuess = (rowIndex, card) => {
    const firstCard = rows[0].card;
    const secondCard = rows[1].card;
    switch (rowIndex) {
      case 0:
        return rows[rowIndex].guess === 'red'
          ? card.suit === 'H' || card.suit === 'D'
          : card.suit === 'S' || card.suit === 'C';

      case 1: {
        const isHigher = VALUES.indexOf(card.value) > VALUES.indexOf(firstCard.value);
        return rows[rowIndex].guess === 'higher' ? isHigher : !isHigher;
      }

      case 2: {
        const [low, high] = getLowHighIndices(firstCard.value, secondCard.value);
        const cardIdx = VALUES.indexOf(card.value);
        const inside = cardIdx > low && cardIdx < high;
        return rows[rowIndex].guess === 'inside' ? inside : !inside;
      }

      case 3:
        // Suit guess
        const { suit } = card;
        const guess = rows[rowIndex].guess;
        return (
          (suit === 'H' && guess === 'hearts') ||
          (suit === 'D' && guess === 'diamonds') ||
          (suit === 'C' && guess === 'clubs') ||
          (suit === 'S' && guess === 'spades')
        );

      default:
        return false;
    }
  };

  const getLowHighIndices = (v1, v2) => {
    const i1 = VALUES.indexOf(v1);
    const i2 = VALUES.indexOf(v2);
    return [Math.min(i1, i2), Math.max(i1, i2)];
  };

  // Draw a card from the deck
  const handleDeckClick = () => {
    if (isFinished) return;
    const rowIndex = rows.findIndex(row => !row.done);
    if (rowIndex === -1) return;

    // Must have a guess selected
    if (!rows[rowIndex].guess) {
      alert("You must select a guess first!");
      return;
    }

    // Draw the next card
    if (topCardIndex >= deck.length) {
      setIsFinished(true);
      return;
    }

    const newCard = deck[topCardIndex];
    const isCorrect = checkGuess(rowIndex, newCard);

    const updatedRows = [...rows];
    updatedRows[rowIndex] = {
      ...rows[rowIndex],
      card: newCard,
      done: isCorrect,
    };

    setRows(updatedRows);
    setTopCardIndex(prev => prev + 1);

    // If we reach end of deck
    if (topCardIndex + 1 >= deck.length) {
      setIsFinished(true);
    }
  };

  // Toggle guess button
  const toggleButtonState = useCallback((rowIndex, guessKey) => {
    setRows(prevRows => {
      const updated = [...prevRows];
      const isButtonDark = { ...updated[rowIndex].isButtonDark };
      // Turn all off except the chosen guessKey
      Object.keys(isButtonDark).forEach(key => {
        isButtonDark[key] = key === guessKey;
      });
      updated[rowIndex] = {
        ...updated[rowIndex],
        guess: guessKey,
        isButtonDark,
      };
      return updated;
    });
  }, []);

  return (
    <div className={styles.rideTheBus}>
      <Navbar />

      {/* Title + Instructions */}
      <div className={styles.rideTheBusTitleRow}>
        <h1 className={styles.rideTheBusTitle}>Ride The Bus: 4 Card Classic</h1>
        <FaQuestion
          className={styles.instructionsBtnRtb}
          onClick={() => setIsInstructionsOpen(true)}
        />
      </div>
      {isInstructionsOpen && (
        <Instructions
          gameTitle="Ride The Bus (4 Card) Instructions"
          subheader="Guess correctly or drink!"
          icon={icon}
          instructionsText="Guess red/black, higher/lower, inside/outside, or suit. Drink if you're wrong!"
          onClose={() => setIsInstructionsOpen(false)}
        />
      )}

      {/* Icon Row & Stats */}
      <div className={styles.rtbIconRow}>
        <img className={styles.rtbIcon} src={icon} alt="Ride the Bus Icon" />
      </div>
      <h2 className={styles.subHeader}>Cards Flipped: {topCardIndex}</h2>

      {/* Button Row */}
      <div className={styles.btnRow}>
        {/* We find the first row not done and show the relevant guess buttons */}
        {rows[0].done === false && (
          <div>
            <button
              className={rows[0].isButtonDark.red ? styles.redBtnDark : styles.redBtn}
              onClick={() => toggleButtonState(0, 'red')}
            >
              RED
            </button>
            <button
              className={rows[0].isButtonDark.black ? styles.blackBtnDark : styles.blackBtn}
              onClick={() => toggleButtonState(0, 'black')}
            >
              BLACK
            </button>
          </div>
        )}
        {rows[0].done && !rows[1].done && (
          <div>
            <button
              className={rows[1].isButtonDark.higher ? styles.greenBtnDark : styles.greenBtn}
              onClick={() => toggleButtonState(1, 'higher')}
            >
              HIGHER
            </button>
            <button
              className={rows[1].isButtonDark.lower ? styles.redBtnDark : styles.redBtn}
              onClick={() => toggleButtonState(1, 'lower')}
            >
              LOWER
            </button>
          </div>
        )}
        {rows[1].done && !rows[2].done && (
          <div>
            <button
              className={rows[2].isButtonDark.inside ? styles.greenBtnDark : styles.greenBtn}
              onClick={() => toggleButtonState(2, 'inside')}
            >
              INSIDE
            </button>
            <button
              className={rows[2].isButtonDark.outside ? styles.redBtnDark : styles.redBtn}
              onClick={() => toggleButtonState(2, 'outside')}
            >
              OUTSIDE
            </button>
          </div>
        )}
        {rows[2].done && !rows[3].done && (
          <div>
            <button
              className={rows[3].isButtonDark.hearts ? styles.redBtnDark : styles.redBtn}
              onClick={() => toggleButtonState(3, 'hearts')}
            >
              HEARTS
            </button>
            <button
              className={rows[3].isButtonDark.diamonds ? styles.redBtnDark : styles.redBtn}
              onClick={() => toggleButtonState(3, 'diamonds')}
            >
              DIAMONDS
            </button>
            <button
              className={rows[3].isButtonDark.clubs ? styles.blackBtnDark : styles.blackBtn}
              onClick={() => toggleButtonState(3, 'clubs')}
            >
              CLUBS
            </button>
            <button
              className={rows[3].isButtonDark.spades ? styles.blackBtnDark : styles.blackBtn}
              onClick={() => toggleButtonState(3, 'spades')}
            >
              SPADES
            </button>
          </div>
        )}
      </div>

      {/* Deck Clickable */}
      <div className={styles.cardDeck}>
        <img
          src={back_of_card}
          className={styles.card}
          onClick={handleDeckClick}
          alt="Card deck"
        />
      </div>

      {/* Shuffle/Restart */}
      <button className={styles.shuffleBtn} onClick={handleShuffle}>
        Restart
      </button>

      {/* Display the 4 flipped or blank cards */}
      <div className={styles.flippedCards}>
        {rows.map((row, index) => {
          if (row.card) {
            const cardClass = row.done
              ? `${styles.card} ${styles.done}`
              : `${styles.card} ${styles.wrong}`;
            return (
              <Card
                key={index}
                value={row.card.value}
                suit={row.card.suit}
                faceUp
                className={cardClass}
              />
            );
          }
          return (
            <img
              key={index}
              className={styles.card}
              src={blank_card}
              alt="Blank card"
            />
          );
        })}
      </div>
    </div>
  );
}

export default RideTheBus_4CardClassic;
