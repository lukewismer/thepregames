import React, { useState, useEffect } from 'react';
import Card from '../../Components/Card';
import Navbar from '../../Components/Navbar/Navbar';
import styles from './RideTheBus.module.css';
import { FaQuestion } from 'react-icons/fa';
import Instructions from '../../Components/Instructions-Popup/Instructions';

const icon = require('./bus_icon.png');
const blank_card = require('../../Images/cards/blank_card.png');

const SUITS = ['H', 'C', 'D', 'S'];
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const generateDeck = () => {
  const deck = [];
  for (const suit of SUITS) {
    for (const value of VALUES) {
      deck.push({ suit, value });
    }
  }
  return deck;
};

const shuffleDeck = (deck) => {
  const shuffledDeck = [...deck];
  for (let i = shuffledDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
  }
  return shuffledDeck;
};

const RideTheBus_5CardClassic = () => {
  const [deck, setDeck] = useState(() => shuffleDeck(generateDeck()));
  const [topCardIndex, setTopCardIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);

  const initialGameState = {
    card: null,
    done: false,
    guess: null,
    isButtonDark: {
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
    },
  };

  const [rows, setRows] = useState([
    { ...initialGameState, guess: 'red' },  // Row 1 (red/black)
    { ...initialGameState, guess: 'higher' },  // Row 2 (higher/lower)
    { ...initialGameState, guess: 'inside' },  // Row 3 (inside/outside)
    { ...initialGameState, guess: 'Hearts' },  // Row 4 (suits)
    { ...initialGameState, guess: 'red' },  // Row 5 (red/black)
  ]);

  const handleShuffle = () => {
    setDeck(shuffleDeck(generateDeck()));
    setTopCardIndex(0);
    setRows(rows.map(() => ({ ...initialGameState })));
  };

  const handleDeckClick = () => {
    const rowIndex = rows.findIndex(row => !row.done);

    if (rowIndex !== -1 && rows[rowIndex].guess !== null) {
      const newCard = deck[topCardIndex];
      const updatedRows = [...rows];

      const isCorrect = checkGuess(rowIndex, newCard);
      updatedRows[rowIndex].card = newCard;
      updatedRows[rowIndex].done = isCorrect;

      setRows(updatedRows);
      setTopCardIndex(topCardIndex + 1);
    } else {
      alert("Must make a guess");
    }

    if (topCardIndex >= deck.length) setIsFinished(true);
  };

  const checkGuess = (rowIndex, card) => {
    switch (rowIndex) {
      case 0:  // Row 1: Red/Black
      case 4:  // Row 5: Red/Black
        return rows[rowIndex].guess === "red" ? card.suit === "H" || card.suit === "D" : card.suit === "S" || card.suit === "C";
      case 1:  // Row 2: Higher/Lower
        return rows[rowIndex].guess === "higher" ? VALUES.indexOf(card.value) > VALUES.indexOf(rows[0].card.value) : VALUES.indexOf(card.value) < VALUES.indexOf(rows[0].card.value);
      case 2:  // Row 3: Inside/Outside
        const [lowCard, highCard] = getLowHighCards(rows[0].card.value, rows[1].card.value);
        return rows[rowIndex].guess === "inside" ? VALUES.indexOf(card.value) > lowCard && VALUES.indexOf(card.value) < highCard : VALUES.indexOf(card.value) < lowCard || VALUES.indexOf(card.value) > highCard;
      case 3:  // Row 4: Suits
      if (card.suit === "H") {
        return rows[rowIndex].guess === "hearts";
        } 
        else if (card.suit === "D") {
            return rows[rowIndex].guess === "diamonds";
        }
        else if (card.suit === "C") {
            return rows[rowIndex].guess === "clubs";
        }
        else if (card.suit === "S") {
            return rows[rowIndex].guess === "spades";
        }
        else {
            return false;
        }
      default:
        return false;
    }
  };

  const getLowHighCards = (card1, card2) => {
    const card1Index = VALUES.indexOf(card1);
    const card2Index = VALUES.indexOf(card2);
    return [Math.min(card1Index, card2Index), Math.max(card1Index, card2Index)];
  };

  const toggleButtonState = (rowIndex, guess) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex].guess = guess;

    const buttonStates = Object.keys(updatedRows[rowIndex].isButtonDark).reduce((acc, key) => {
      acc[key] = key === guess;
      return acc;
    }, {});

    updatedRows[rowIndex].isButtonDark = buttonStates;
    setRows(updatedRows);
  };

  useEffect(() => {
    rows.forEach((row, index) => {
      toggleButtonState(index, row.guess);
    });
  }, [rows]);

  return (
    <div className={styles.rideTheBus}>
      <Navbar />
      <div>
        <div className={styles.rideTheBusTitleRow}>
          <h1 className={styles.rideTheBusTitle}>Ride The Bus: 5 Card Classic</h1>
          <FaQuestion className={styles.instructionsBtnRtb} onClick={() => setIsInstructionsOpen(true)} />
        </div>
        {isInstructionsOpen && (
          <Instructions
            gameTitle="Ride The Bus (5 Card) Instructions"
            subheader="Guess correctly or drink!"
            icon={icon}
            instructionsText="Guess red/black, higher/lower, inside/outside, or suit. Drink if you're wrong!"
            onClose={() => setIsInstructionsOpen(false)}
          />
        )}
  
        <div className={styles.rtbIconRow}>
          <img className={styles.rtbIcon} src={icon} alt="Ride the Bus Icon" />
        </div>
        <h2 className={styles.subHeader}>Cards Flipped: {topCardIndex}</h2>
  
        <div className={styles.btnRow}>
          {!rows[0].done ? (
            <div>
              <button className={rows[0].isButtonDark.red ? styles.redBtnDark : styles.redBtn} onClick={() => toggleButtonState(0, 'red')}>
                RED
              </button>
              <button className={rows[0].isButtonDark.black ? styles.blackBtnDark : styles.blackBtn} onClick={() => toggleButtonState(0, 'black')}>
                BLACK
              </button>
            </div>
          ) : !rows[1].done ? (
            <div>
              <button className={rows[1].isButtonDark.higher ? styles.greenBtnDark : styles.greenBtn} onClick={() => toggleButtonState(1, 'higher')}>
                HIGHER
              </button>
              <button className={rows[1].isButtonDark.lower ? styles.redBtnDark : styles.redBtn} onClick={() => toggleButtonState(1, 'lower')}>
                LOWER
              </button>
            </div>
          ) : !rows[2].done ? (
            <div>
              <button className={rows[2].isButtonDark.inside ? styles.greenBtnDark : styles.greenBtn} onClick={() => toggleButtonState(2, 'inside')}>
                INSIDE
              </button>
              <button className={rows[2].isButtonDark.outside ? styles.redBtnDark : styles.redBtn} onClick={() => toggleButtonState(2, 'outside')}>
                OUTSIDE
              </button>
            </div>
          ) : !rows[3].done ? (
            <div>
              <button className={rows[3].isButtonDark.hearts ? styles.redBtnDark : styles.redBtn} onClick={() => toggleButtonState(3, 'hearts')}>
                HEARTS
              </button>
              <button className={rows[3].isButtonDark.diamonds ? styles.redBtnDark : styles.redBtn} onClick={() => toggleButtonState(3, 'diamonds')}>
                DIAMONDS
              </button>
              <button className={rows[3].isButtonDark.clubs ? styles.blackBtnDark : styles.blackBtn} onClick={() => toggleButtonState(3, 'clubs')}>
                CLUBS
              </button>
              <button className={rows[3].isButtonDark.spades ? styles.blackBtnDark : styles.blackBtn} onClick={() => toggleButtonState(3, 'spades')}>
                SPADES
              </button>
            </div>
          ) : !rows[4].done ? (
            <div>
              <button className={rows[4].isButtonDark.red ? styles.redBtnDark : styles.redBtn} onClick={() => toggleButtonState(4, 'red')}>
                RED
              </button>
              <button className={rows[4].isButtonDark.black ? styles.blackBtnDark : styles.blackBtn} onClick={() => toggleButtonState(4, 'black')}>
                BLACK
              </button>
            </div>
          ) : null}
        </div>
  
        <div className={styles.cardDeck}>
          <img
            src={require('../../Images/cards/back_of_card.png')}
            className={styles.card}
            onClick={handleDeckClick}
            alt="Card deck"
          />
        </div>
  
        <button className={styles.shuffleBtn} onClick={handleShuffle}>
          Restart
        </button>
  
        <div className={styles.flippedCards}>
          {rows.map((row, index) =>
            row.card ? (
              <Card key={index} value={row.card.value} suit={row.card.suit} faceUp={true} className={row.done ? `${styles.card} ${styles.done}` : `${styles.card} ${styles.wrong}`} />
            ) : (
              <img key={index} className={styles.card} src={blank_card} alt="Blank card" />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default RideTheBus_5CardClassic;


const WinnerMessage = ({ show, restart }) => {
  return (
    <div className={`winner-message ${show ? 'show' : ''}`}>
      <div className="winner-card">
        <h2>Congratulations</h2>
        <p>You successfully rode the bus</p>
        <button onClick={restart}>Play Again</button>
      </div>
    </div>
  );
};
