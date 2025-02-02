import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import styles from './AroundTheWorld.module.css';
import Card from '../../Components/Card';
import Instructions from '../../Components/Instructions-Popup/Instructions';
import { FaQuestion } from 'react-icons/fa';

const SUITS = ['H', 'C', 'D', 'S'];
const VALUES = ['A', '2', '3', '4', '5', '6', '8', '9', '10', 'J', 'Q', 'K'];

const colored_globe = require("./Assets/globe_colored_spinning.png");
const backOfCardImage = require("../../Images/cards/back_of_card.png");

// --- HELPER FUNCTIONS ---

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
  const shuffledDeck = [...deck];
  for (let i = shuffledDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
  }
  return shuffledDeck;
}

function parseCardInt(value) {
  switch (value) {
    case 'K': return 13;
    case 'Q': return 12;
    case 'J': return 11;
    case 'A': return 1;
    default:  return parseInt(value, 10);
  }
}

function checkIfTwoNeighbors(cards, index) {
  if (index === 0) {
    return cards[19] != null && cards[1] != null;
  }
  if (index === 19) {
    return cards[0] != null && cards[18] != null;
  }
  return cards[index - 1] != null && cards[index + 1] != null;
}

function checkEligibility(cards, index, guess) {
  if (guess === 'inside' || guess === 'outside') {
    if (index === 0) {
      return (cards[19] != null && cards[1] != null);
    } else if (index === 19) {
      return (cards[0] != null && cards[18] != null);
    } else {
      return (cards[index - 1] != null && cards[index + 1] != null);
    }
  } else {
    return true; 
  }
}

function checkGuess(cards, newCard, index, guess) {
  if (!guess) {
    alert("Must make a guess first");
    return false;
  }

  const newVal = parseCardInt(newCard[0]);

  const leftIndex  = index === 0 ? 19 : index - 1;
  const rightIndex = index === 19 ? 0 : index + 1;

  const leftVal  = cards[leftIndex]  ? parseCardInt(cards[leftIndex][0])  : null;
  const rightVal = cards[rightIndex] ? parseCardInt(cards[rightIndex][0]) : null;

  if (guess === 'higher') {
    if (leftVal != null && newVal > leftVal)  return true;
    if (rightVal != null && newVal > rightVal) return true;
    return false;
  }

  if (guess === 'lower') {
    if (leftVal != null && newVal < leftVal)  return true;
    if (rightVal != null && newVal < rightVal) return true;
    return false;
  }

  if (guess === 'inside') {
    // We need 2 neighbors. Inside means newVal is strictly between them.
    if (leftVal != null && rightVal != null) {
      return (
        (leftVal < newVal && newVal < rightVal) ||
        (rightVal < newVal && newVal < leftVal)
      );
    }
    return false;
  }

  if (guess === 'outside') {
    // We need 2 neighbors. Outside means newVal is outside the range of neighbors.
    if (leftVal != null && rightVal != null) {
      return (
        (newVal < leftVal && newVal < rightVal) ||
        (newVal > leftVal && newVal > rightVal)
      );
    }
    return false;
  }

  return false;
}

// checkTie: returns true if the newCard value ties with either neighbor
function checkTie(cards, newCard, index, guess) {
  if (!guess) return false;

  const newVal = parseCardInt(newCard[0]);
  const leftIndex  = index === 0 ? 19 : index - 1;
  const rightIndex = index === 19 ? 0 : index + 1;

  const leftVal  = cards[leftIndex]  ? parseCardInt(cards[leftIndex][0])  : null;
  const rightVal = cards[rightIndex] ? parseCardInt(cards[rightIndex][0]) : null;

  return (leftVal === newVal || rightVal === newVal);
}

function removeConnectedFaceUpCards(cards, startIndex) {
  const newCards = [...cards];
  const visited = new Set();
  const stack = [startIndex];

  // A function to get left neighbor in a ring of size 20
  const leftOf = i => (i === 0 ? 19 : i - 1);
  // A function to get right neighbor in a ring of size 20
  const rightOf = i => (i === 19 ? 0 : i + 1);

  while (stack.length > 0) {
    const current = stack.pop();
    if (visited.has(current)) continue;
    visited.add(current);

    // Left neighbor
    const left = leftOf(current);
    if (newCards[left] !== null) {
      // If it's face-up (including if it's a '7'), we can traverse through it
      stack.push(left);
    }

    // Right neighbor
    const right = rightOf(current);
    if (newCards[right] !== null) {
      stack.push(right);
    }
  }

  // Now remove any visited card that isn't a 7
  visited.forEach(i => {
    if (newCards[i] && newCards[i][0] !== '7') {
      newCards[i] = null;
    }
  });

  return newCards;
}

function AroundTheWorld() {
  const [deck, setDeck] = useState(() => shuffleDeck(generateDeck()));
  const [cards, setCards] = useState([
    ["7","H"], null, null, null, null,
    ["7","D"], null, null, null, null,
    ["7","C"], null, null, null, null,
    ["7","S"], null, null, null, null
  ]);
  const [topCardIndex, setTopCardIndex] = useState(0);

  // Instead of 16 separate states, just track the last-clicked card index
  const [clickedCardIndex, setClickedCardIndex] = useState(null);

  // Which guess button is clicked
  const [guess, setGuess] = useState(null);
  const [btnClicked, setBtnClicked] = useState(null);

  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);

  // Increment the deck pointer
  const incrementIndex = () => {
    if (topCardIndex === 48) {
      setDeck(shuffleDeck(generateDeck()));
      setTopCardIndex(0);
    } else {
      setTopCardIndex(prev => prev + 1);
    }
  };

  // Reusable guess button handlers
  const handleBtnClick = (type) => {
    setGuess(type);
    if (type === 'higher')  setBtnClicked(0);
    if (type === 'lower')   setBtnClicked(1);
    if (type === 'inside')  setBtnClicked(2);
    if (type === 'outside') setBtnClicked(3);
  };

  // A single handler for clicking on any face-down card
  const handleCardClick = (index) => {
    setClickedCardIndex(index);
  };

  // A single place to handle the flipping logic
  useEffect(() => {
    if (clickedCardIndex == null) return;

    const index = clickedCardIndex;

    // If user tries to flip with no guess
    if (!guess) {
      alert("Must make guess first");
      setClickedCardIndex(null);
      return;
    }

    // For “higher/lower” you cannot pick a card with two neighbors
    // For “inside/outside” you need a card with two neighbors
    if ((guess === 'higher' || guess === 'lower') && checkIfTwoNeighbors(cards, index)) {
      alert("Cannot guess higher or lower on a card with two neighbors");
      setClickedCardIndex(null);
      return;
    }
    if ((guess === 'inside' || guess === 'outside') && !checkIfTwoNeighbors(cards, index)) {
      alert("Must guess higher or lower on a card with only one neighbor");
      setClickedCardIndex(null);
      return;
    }

    // We now draw the newCard
    const newCard = [deck[topCardIndex].value, deck[topCardIndex].suit];

    // Check if we can attempt guess at this index
    if (!checkEligibility(cards, index, guess)) {
      // If not eligible, we still flip the card to show it,
      // but it’s automatically “wrong” (unless it’s a tie).
      flipAndResolve(newCard, index, false);
    } else {
      const isCorrect = checkGuess(cards, newCard, index, guess);
      flipAndResolve(newCard, index, isCorrect);
    }

    // done - reset clickedCardIndex
    setClickedCardIndex(null);
  }, [clickedCardIndex]);

  function flipAndResolve(newCard, index, isCorrect) {
    const updated = [...cards];
    updated[index] = newCard;     // place the new card
    setCards(updated);
    incrementIndex();
  
    if (!isCorrect) {
      const tie = checkTie(cards, newCard, index, guess);
      if (!tie) {
        // Wrong guess + not a tie => chain remove
        setTimeout(() => {
          const newDeck = removeConnectedFaceUpCards(updated, index);
          setCards(newDeck);
        }, 1000);
      } else {
        // tie => remove only the newly flipped card
        setTimeout(() => {
          const newDeck = [...updated];
          newDeck[index] = null;
          setCards(newDeck);
        }, 1000);
      }
    }
  
    // reset guess
    setGuess(null);
    setBtnClicked(null);
  }

  // Renders each card slot. If card is null, show the back of card with onClick
  function renderCard(index) {
    if (cards[index]) {
      const [value, suit] = cards[index];
      return (
        <Card
          key={index}
          value={value}
          suit={suit}
          faceUp={true}
          onClick={() => {}}
          className={`${styles.backOfCard} ${styles[`group${index + 1}`]}`}
        />
      );
    } 
    return (
      <img
        key={index}
        src={backOfCardImage}
        className={`${styles.backOfCard} ${styles[`group${index + 1}`]}`}
        onClick={() => handleCardClick(index)}
        alt="back"
      />
    );
  }

  return (
    <div className={styles.wrapperBg}>
      { isInstructionsOpen && 
        <Instructions 
          gameTitle="Around The World"
          subheader="Higher, Lower, Inside or Outside. Take Risks... and Sips!"
          icon={colored_globe}
          instructionsText="The goal is to have every card flipped up. The 7s will always stay face up
            and you start by selecting higher or lower to one of the neighbors 7s. You can select any card that has a faceup neighbor to guess higher or lower. If you get it wrong, every card that is not a 7 will be turned back over,
            and for every card that gets flipped back over you take a sip. If a card has two neighbors you can guess inside or outside. If it is a tie you will be given the chance to guess again. Good Luck!"
          onClose={() => setIsInstructionsOpen(false)}
        />
      }
      <Navbar />
      <div className={styles.container}>
        <FaQuestion
          className={styles.instructionsIcon}
          onClick={() => setIsInstructionsOpen(true)}
        />
        <div className={styles.titleContainer}>
          <img src={colored_globe} className={styles.coloredGlobe} alt="globe"/>
          <h1 className={styles.aroundTheWorldTitle}>Around The World</h1>
        </div>

        <div className={styles.btnContainer}>
          <button
            className={btnClicked === 0 ? styles.guessBtnActive : styles.guessBtn}
            onClick={() => handleBtnClick('higher')}
          >
            Higher
          </button>
          <button
            className={btnClicked === 1 ? styles.guessBtnActive : styles.guessBtn}
            onClick={() => handleBtnClick('lower')}
          >
            Lower
          </button>
          <button
            className={btnClicked === 2 ? styles.guessBtnActive : styles.guessBtn}
            onClick={() => handleBtnClick('inside')}
          >
            Inside
          </button>
          <button
            className={btnClicked === 3 ? styles.guessBtnActive : styles.guessBtn}
            onClick={() => handleBtnClick('outside')}
          >
            Outside
          </button>
        </div>

        <div className={styles.gridLayout}>
          <img
            src={require('../../Images/cards/7H.png')}
            className={`${styles.backOfCard} ${styles.group1}`}
            alt="7H"
          />
          {renderCard(1)}
          {renderCard(2)}
          {renderCard(3)}
          {renderCard(4)}

          <img
            src={require('../../Images/cards/7D.png')}
            className={`${styles.backOfCard} ${styles.group6}`}
            alt="7D"
          />
          {renderCard(6)}
          {renderCard(7)}
          {renderCard(8)}
          {renderCard(9)}

          <img
            src={require('../../Images/cards/7C.png')}
            className={`${styles.backOfCard} ${styles.group11}`}
            alt="7C"
          />
          {renderCard(11)}
          {renderCard(12)}
          {renderCard(13)}
          {renderCard(14)}

          <img
            src={require('../../Images/cards/7S.png')}
            className={`${styles.backOfCard} ${styles.group16}`}
            alt="7S"
          />
          {renderCard(16)}
          {renderCard(17)}
          {renderCard(18)}
          {renderCard(19)}
        </div>
      </div>
    </div>
  );
}

export default AroundTheWorld;
