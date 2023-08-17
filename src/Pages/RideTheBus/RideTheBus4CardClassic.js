import React, { useState, useEffect } from 'react';
import Card from '../../Components/Card';
import Navbar from '../../Components/Navbar/Navbar';
import './RideTheBus.css';

let blank_card = require('../../Images/cards/blank_card.png');

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

const RideTheBus_4CardClassic = () => {
    const [deck, setDeck] = useState(() => shuffleDeck(generateDeck()));
    const [topCardIndex, setTopCardIndex] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [row1Card, setRow1Card] = useState(null);
    const [row1Guess, setRow1Guess] = useState("red");
    const [row1Done, setRow1Done] = useState(false);
    const [isRedButton1Dark, setIsRedButton1Dark] = useState(false);
    const [isBlackButton1Dark, setIsBlackButton1Dark] = useState(false);

    const [row2Card, setRow2Card] = useState(null);
    const [row2Done, setRow2Done] = useState(false);
    const [row2Guess, setRow2Guess] = useState("higher");
    const [isHigherButtonDark, setIsHigherButtonDark] = useState(false);
    const [isLowerButtonDark, setIsLowerButtonDark] = useState(false);

    const [ row3Card, setRow3Card ] = useState(null);
    const [ row3Done, setRow3Done ] = useState(false);
    const [ row3Guess, setRow3Guess ] = useState("inside");
    const [ isInsideButtonDark, setIsInsideButtonDark ] = useState(false);
    const [ isOutsideButtonDark, setIsOutsideButtonDark ] = useState(false);

    const [ row4Card, setRow4Card ] = useState(null);
    const [ row4Done, setRow4Done ] = useState(false);
    const [ row4Guess, setRow4Guess ] = useState("Hearts");
    const [ isHeartsButtonDark, setIsHeartsButtonDark ] = useState(false);
    const [ isDiamondsButtonDark, setIsDiamondsButtonDark ] = useState(false);
    const [ isClubsButtonDark, setIsClubsButtonDark ] = useState(false);
    const [ isSpadesButtonDark, setIsSpadesButtonDark ] = useState(false);

    const handleShuffle = () => {
        setDeck(shuffleDeck(generateDeck()));
        setTopCardIndex(0);
        setRow1Card(null);
        setRow2Card(null);
        setRow3Card(null);
        setRow4Card(null);
        setRow1Done(false);
        setRow2Done(false);
        setRow3Done(false);
        setRow4Done(false);

        setRow1Guess("red");
        setRow2Guess("higher");
        setRow3Guess("inside");
        setRow4Guess("Hearts");

        setIsRedButton1Dark(false);
        setIsBlackButton1Dark(false);

        setIsHigherButtonDark(false);
        setIsLowerButtonDark(false);

        setIsHeartsButtonDark(false);
        setIsDiamondsButtonDark(false);
        setIsClubsButtonDark(false);
        setIsSpadesButtonDark(false);

        setIsInsideButtonDark(false);
        setIsOutsideButtonDark(false);
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
    };


    // useEffect hooks to manage button color based on guesses
    useEffect(() => {
        if (row1Guess === 'red') {
          setIsRedButton1Dark(true);
          setIsBlackButton1Dark(false);
        } else if (row1Guess === 'black') {
          setIsBlackButton1Dark(true);
          setIsRedButton1Dark(false);
        } else {
            setIsRedButton1Dark(true);
            setIsBlackButton1Dark(false);
        }
    }, [row1Guess]);

    useEffect(() => {
        if (row2Guess === 'higher') {
            setIsLowerButtonDark(false);
            setIsHigherButtonDark(true);
        } else if (row2Guess === 'lower') {
            setIsLowerButtonDark(true);
            setIsHigherButtonDark(false);
        } else {
            setIsLowerButtonDark(false);
            setIsHigherButtonDark(true);
        }
      }, [row2Guess]);

    useEffect(() => {
        if (row3Guess === "inside") {
            setIsInsideButtonDark(true);
            setIsOutsideButtonDark(false);
        } else if (row3Guess === "outside") {
            setIsInsideButtonDark(false);
            setIsOutsideButtonDark(true);
        } else {
            setIsInsideButtonDark(true);
            setIsOutsideButtonDark(false);
        }
    }, [row3Guess]);

    useEffect(() => {
        if (row4Guess === "Hearts") {
            setIsHeartsButtonDark(true);
            setIsClubsButtonDark(false);
            setIsDiamondsButtonDark(false);
            setIsSpadesButtonDark(false);
        } else if (row4Guess === "Diamonds") {
            setIsHeartsButtonDark(false);
            setIsClubsButtonDark(false);
            setIsDiamondsButtonDark(true);
            setIsSpadesButtonDark(false);
        } else if (row4Guess === "Clubs") {
            setIsHeartsButtonDark(false);
            setIsClubsButtonDark(true);
            setIsDiamondsButtonDark(false);
            setIsSpadesButtonDark(false);
        } else if (row4Guess === "Spades") {
            setIsHeartsButtonDark(false);
            setIsClubsButtonDark(false);
            setIsDiamondsButtonDark(false);
            setIsSpadesButtonDark(true);
        } else {
            setIsHeartsButtonDark(true);
            setIsClubsButtonDark(false);
            setIsDiamondsButtonDark(false);
            setIsSpadesButtonDark(false);
        }
    }, [row4Guess]);

    return (
        <div className="ride-the-bus">
            <Navbar />
            <div>
                <h1 className="title">Ride The Bus: 4 Card Classic</h1>
                <h2 className="sub-header">Cards Flipped: {topCardIndex}</h2>
                
                <div className='btn-row'>
                    {!row1Done ? 
                    <div>
                        <button className={isRedButton1Dark ? "red-btn-dark" : "red-btn"} onClick={() => setRow1Guess("red")}>RED</button>
                        <button className={isBlackButton1Dark ? "black-btn-dark" : "black-btn"} onClick={() => setRow1Guess("black")}>BLACK</button>
                    </div> : !row2Done ?
                        <div>
                            <button className={isHigherButtonDark ? "green-btn-dark" : "green-btn"} onClick={() => setRow2Guess("higher")}>HIGHER</button>
                            <button className={isLowerButtonDark ? "red-btn-dark" : "red-btn"} onClick={() => setRow2Guess("lower")}>LOWER</button>
                        </div> : !row3Done ? 
                        <div>
                            <button className={isInsideButtonDark ? "green-btn-dark" : "green-btn"} onClick={() => setRow3Guess("inside")}>INSIDE</button>
                            <button className={isOutsideButtonDark ? "red-btn-dark" : "red-btn"} onClick={() => setRow3Guess("outside")}>OUTSIDE</button>
                        </div> : !row4Done ?
                        <div>
                            <button className={isHeartsButtonDark ? "red-btn-dark" : "red-btn"} onClick={() => setRow4Guess("Hearts")}>HEARTS</button>
                            <button className={isDiamondsButtonDark ? "red-btn-dark" : "red-btn"} onClick={() => setRow4Guess("Diamonds")}>DIAMONDS</button>
                            <button className={isClubsButtonDark ? "black-btn-dark" : "black-btn"} onClick={() => setRow4Guess("Clubs")}>CLUBS</button>
                            <button className={isSpadesButtonDark ? "black-btn-dark" : "black-btn"} onClick={() => setRow4Guess("Spades")}>SPADES</button>
                        </div> : <WinnerMessage show={true} restart={handleShuffle} />
                    }
                </div>

                <div className='card-deck'>
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
                </div>
                
                <button className='shuffle-btn' onClick={handleShuffle}>Restart</button>
                
                <div className='flipped-cards'>
                    {row1Card != null ?
                        <Card 
                            value={row1Card[0]}
                            suit={row1Card[1]}
                            faceUp={true}
                            className={row1Done ? "card done" : "card wrong"}
                            /> : <img className='card' src={blank_card} />
                    }

                    {row2Card != null ?
                        <Card 
                            value={row2Card[0]}
                            suit={row2Card[1]}
                            faceUp={true}
                            className={row2Done ? "card done" : "card wrong"}
                            /> : <img className='card' src={blank_card} />
                    }

                    {row3Card != null ?
                        <Card 
                            value={row3Card[0]}
                            suit={row3Card[1]}
                            faceUp={true}
                            className={row3Done ? "card done" : "card wrong"}
                            /> : <img className='card' src={blank_card} />
                    }

                    {row4Card != null ?
                        <Card 
                            value={row4Card[0]}
                            suit={row4Card[1]}
                            faceUp={true}
                            className={row4Done ? "card done" : "card wrong"}
                            /> : <img className='card' src={blank_card} />
                    }
                </div>
            </div>
        </div>
      );
};

export default RideTheBus_4CardClassic;


const WinnerMessage = ({ show, restart }) => {
    return (
        <div className={`winner-message ${show ? 'show' : ''}`}>
            <div className="winner-card">
                <h2>Congratulations</h2>
                <p>You succesfully rode the bus</p>
                <button onClick={restart}>Play Again</button>
            </div>
        </div>
    );
}