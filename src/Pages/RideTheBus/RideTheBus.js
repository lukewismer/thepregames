import React, { useState } from 'react';
import Card from '../../Components/Card';
import Navbar from '../../Components/Navbar/Navbar';
import './RideTheBus.css';

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

const RideTheBus = () => {
    const [deck, setDeck] = useState(() => shuffleDeck(generateDeck()));
    const [topCardIndex, setTopCardIndex] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [row1Card, setRow1Card] = useState(null);
    const [row1Guess, setRow1Guess] = useState(null);
    const [row1Done, setRow1Done] = useState(false);

    const [row2Card, setRow2Card] = useState(null);
    const [row2Done, setRow2Done] = useState(false);
    const [row2Guess, setRow2Guess] = useState(null);

    const [row3Card, setRow3Card] = useState(null);
    const [row3Done, setRow3Done] = useState(false);
    const [row3Guess, setRow3Guess] = useState(null);

    const [row4Card, setRow4Card] = useState(null);
    const [row4Done, setRow4Done] = useState(false);
    const [row4Guess, setRow4Guess] = useState(null);

    const [row5Card, setRow5Card] = useState(null);
    const [row5Done, setRow5Done] = useState(false);
    const [row5Guess, setRow5Guess] = useState(null);

    const handleShuffle = () => {
        setDeck(shuffleDeck(generateDeck()));
        setTopCardIndex(0);
        setRow1Card(null);
        setRow2Card(null);
        setRow3Card(null);
        setRow4Card(null);
        setRow5Card(null);
    };

    const handleDeckClick = () => {

        if (!row1Done){
            if (row1Guess === null){
                alert("Must make a guess");
            } else {
                setRow1Card([deck[topCardIndex].value, deck[topCardIndex].suit]);
                if (row1Guess === "black" && (deck[topCardIndex].suit === "C" || deck[topCardIndex].suit === "S")){
                    // Succesful guess
                    setRow1Done(true);
                    
                } else if (row1Guess === "red" && (deck[topCardIndex].suit === "H" || deck[topCardIndex].suit === "D"))
                {
                    setRow1Done(true);
                }
                else{
                    
                }
                if (topCardIndex < deck.length) {
                    setTopCardIndex(topCardIndex + 1);
                } else {
                    setIsFinished(true);
                }
            }
            
        }

        else if (!row2Done){
            if (row2Guess === null){
                alert("Must make a guess");
            } else {
                setRow2Card([deck[topCardIndex].value, deck[topCardIndex].suit]);
                if (row2Guess === "higher" && (VALUES.indexOf(deck[topCardIndex].value) > VALUES.indexOf(row1Card[0]))){
                    // Succesful guess
                    setRow2Done(true);
                    
                } else if (row2Guess === "lower" && (VALUES.indexOf(deck[topCardIndex].value) < VALUES.indexOf(row1Card[0])))
                {
                    setRow2Done(true);
                } else if (VALUES.indexOf(deck[topCardIndex].value) == VALUES.indexOf(row1Card[0])){
                }
                else{
                }
                if (topCardIndex < deck.length) {
                    setTopCardIndex(topCardIndex + 1);
                } else {
                    setIsFinished(true);
                }
            }
        }

        else if (!row3Done){
            if (row3Guess === null){
                alert("Must make a guess");
            } else {
                setRow3Card([deck[topCardIndex].value, deck[topCardIndex].suit]);
                var higherCardIndex = 0, lowerCardIndex = 0;
                if (VALUES.indexOf(row1Card[0]) > VALUES.indexOf(row2Card[0])){
                    higherCardIndex = VALUES.indexOf(row1Card[0]);
                    lowerCardIndex = VALUES.indexOf(row2Card[0]);
                } else {
                    lowerCardIndex = VALUES.indexOf(row1Card[0]);
                    higherCardIndex = VALUES.indexOf(row2Card[0]);
                }



                if (row3Guess === "inside" && (higherCardIndex > VALUES.indexOf(deck[topCardIndex].value) && lowerCardIndex < VALUES.indexOf(deck[topCardIndex].value))){
                    setRow3Done(true);
                } else if (row3Guess === "outside" && (higherCardIndex < VALUES.indexOf(deck[topCardIndex].value) || lowerCardIndex > VALUES.indexOf(deck[topCardIndex].value))){
                    setRow3Done(true);
                } else {
                }
                if (topCardIndex < deck.length) {
                    setTopCardIndex(topCardIndex + 1);
                } else {
                    setIsFinished(true);
                }
            }
        }

        else if (!row4Done){
            if (row4Guess === null){
                alert("Must make a guess");
            } else {
                setRow4Card([deck[topCardIndex].value, deck[topCardIndex].suit]);
                if (row4Guess[0] === deck[topCardIndex].suit){
                    setRow4Done(true);
                } else {
                }
                if (topCardIndex < deck.length) {
                    setTopCardIndex(topCardIndex + 1);
                } else {
                    setIsFinished(true);
                }
            }
        }

        else if (!row5Done){
            if (row5Guess === null){
                alert("Must make a guess");
            } else {
                setRow5Card([deck[topCardIndex].value, deck[topCardIndex].suit]);
                if (row5Guess === "black" && (deck[topCardIndex].suit === "C" || deck[topCardIndex].suit === "S")){
                    // Succesful guess
                    setRow5Done(true);
                    
                } else if (row5Guess === "red" && (deck[topCardIndex].suit === "H" || deck[topCardIndex].suit === "D"))
                {
                    setRow5Done(true);
                }
                else{
                    
                }
                if (topCardIndex < deck.length) {
                    setTopCardIndex(topCardIndex + 1);
                } else {
                    setIsFinished(true);
                }

            }
        }

        
    };


    return (
        <div>
            <Navbar />
            <h1>Cards Flipped: {topCardIndex}</h1>
            {!row1Done ? 
                <h1>Color Guess: {row1Guess}</h1> : !row2Done ? 
                <h1>Higher or Lower: {row2Guess}</h1> : !row3Done ?
                <h1>Inside or Outside: {row3Guess}</h1> : !row4Done ?
                <h1>Pick a Suit: {row4Guess}</h1> : !row5Done ? 
                <h1>Color Guess: {row5Guess}</h1> : "Winner"
            }
            
            <div>
            <button onClick={handleShuffle}>Shuffle Deck</button>
            <img
                src={require('../../Images/cards/back_of_card.png')}
                style={{
                    width: '100px',
                    height: '150px',
                    margin: '5px',
                    borderRadius: '5px',
                    boxShadow: '0 0 5px 2px rgba(0,0,0,0.25)'
                }}
                    onClick={handleDeckClick}
                />
            {row1Card != null ?
            <Card 
                value={row1Card[0]}
                suit={row1Card[1]}
                faceUp={true}
                className={"card"}
                /> : ""}

                {row2Card != null ?
            <Card 
                value={row2Card[0]}
                suit={row2Card[1]}
                faceUp={true}
                className={"card"}
                /> : ""}

                {row3Card != null ?
            <Card 
                value={row3Card[0]}
                suit={row3Card[1]}
                faceUp={true}
                className={"card"}
                /> : ""}

                {row4Card != null ?
            <Card 
                value={row4Card[0]}
                suit={row4Card[1]}
                faceUp={true}
                className={"card"}
                /> : ""}

                {row5Card != null ?
            <Card 
                value={row5Card[0]}
                suit={row5Card[1]}
                faceUp={true}
                className={"card"}
                /> : ""}
            </div>
            <div>
                {!row1Done ? 
                <div className='btn-row'>
                    <button className="red-btn" onClick={() => setRow1Guess("red")}>RED</button>
                    <h2>OR</h2>
                    <button className="black-btn" onClick={() => setRow1Guess("black")}>BLACK</button>
                </div> : !row2Done ?
                    <div className='btn-row'>
                        <button className="green-btn" onClick={() => setRow2Guess("higher")}>HIGHER</button>
                        <h2>OR</h2>
                        <button className="red-btn" onClick={() => setRow2Guess("lower")}>LOWER</button>
                    </div> : !row3Done ? 
                    <div className='btn-row'>
                        <button className="green-btn" onClick={() => setRow3Guess("inside")}>INSIDE</button>
                        <h2>OR</h2>
                        <button className="red-btn" onClick={() => setRow3Guess("outside")}>OUTSIDE</button>
                    </div> : !row4Done ?
                    <div className='btn-row'>
                        <button className="red-btn" onClick={() => setRow4Guess("Hearts")}>HEARTS</button>
                        <h2>OR</h2>
                        <button className="red-btn" onClick={() => setRow4Guess("Diamonds")}>DIAMONDS</button>
                        <h2>OR</h2>
                        <button className="black-btn" onClick={() => setRow4Guess("Clubs")}>CLUBS</button>
                        <h2>OR</h2>
                        <button className="black-btn" onClick={() => setRow4Guess("Spades")}>SPADES</button>
                    </div> : !row5Done ?
                    <div className='btn-row'>
                    <button className="red-btn" onClick={() => setRow5Guess("red")}>RED</button>
                    <h2>OR</h2>
                    <button className="black-btn" onClick={() => setRow5Guess("black")}>BLACK</button>
                    </div> : "Winner!"
                }
            </div>
        </div>
      );
};

export default RideTheBus;
