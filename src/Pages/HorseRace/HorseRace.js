import React, {useState, useEffect} from "react";
import './HorseRace.css';
import Navbar from "../../Components/Navbar/Navbar";
import Card from "../../Components/Card";
import Modal from "../../Components/Modal/Modal";
import { useNavigate } from 'react-router-dom';

const SUITS = ['H', 'C', 'D', 'S'];
const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];


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

const HorseRace = () => {
    const [deck, setDeck] = useState(() => shuffleDeck(generateDeck()));
    const [topCardIndex, setTopCardIndex] = useState(7);

    const [flippedCard, setFlippedCard] = useState(null);

    const [topRow1, setTopRow1] = useState([deck[0].suit, deck[0].value]);
    const [topRow1Reveal, setTopRow1Reveal] = useState(false);

    const [topRow2, setTopRow2] = useState([deck[1].suit, deck[1].value]);
    const [topRow2Reveal, setTopRow2Reveal] = useState(false);

    const [topRow3, setTopRow3] = useState([deck[2].suit, deck[2].value]);
    const [topRow3Reveal, setTopRow3Reveal] = useState(false);

    const [topRow4, setTopRow4] = useState([deck[3].suit, deck[3].value]);
    const [topRow4Reveal, setTopRow4Reveal] = useState(false);

    const [topRow5, setTopRow5] = useState([deck[4].suit, deck[4].value]);
    const [topRow5Reveal, setTopRow5Reveal] = useState(false);

    const [topRow6, setTopRow6] = useState([deck[5].suit, deck[5].value]);
    const [topRow6Reveal, setTopRow6Reveal] = useState(false);

    const [topRow7, setTopRow7] = useState([deck[6].suit, deck[6].value]);
    const [topRow7Reveal, setTopRow7Reveal] = useState(false);

    const [heartsIndex, setHeartsIndex] = useState(0);
    const [diamondsIndex, setDiamondsIndex] = useState(0);
    const [spadesIndex, setSpadesIndex] = useState(0);
    const [clubsIndex, setClubsIndex] = useState(0);

    const [isFinished, setIsFinished] = useState(false);
    const [winner, setWinner] = useState(null);

    const navigate = useNavigate();
    const routeChange = () =>{
        let path = '/powerhour';
        navigate(path);
    }
    const refreshPage = () => {
        window.location.reload();
    }

    useEffect(() => {
        if (heartsIndex >= 1 && diamondsIndex >= 1 && spadesIndex >= 1 && clubsIndex >= 1 && topRow1Reveal === false){
            setTopRow1Reveal(true);
            if (topRow1[0] === "H"){
                setHeartsIndex(prevIndex => prevIndex - 1);
            } else if (topRow1[0] === "D"){
                setDiamondsIndex(prevIndex => prevIndex - 1);
            } else if (topRow1[0] === "S"){
                setSpadesIndex(prevIndex => prevIndex - 1);
            } else if (topRow1[0] === "C"){
                setClubsIndex(prevIndex => prevIndex -1);
            }
        }
        if (heartsIndex >= 2 && diamondsIndex >= 2 && spadesIndex >= 2 && clubsIndex >= 2 && topRow2Reveal === false){
            setTopRow2Reveal(true);
            if (topRow2[0] === "H"){
                setHeartsIndex(prevIndex => prevIndex - 1);
            } else if (topRow2[0] === "D"){
                setDiamondsIndex(prevIndex => prevIndex - 1);
            } else if (topRow2[0] === "S"){
                setSpadesIndex(prevIndex => prevIndex - 1);
            } else if (topRow2[0] === "C"){
                setClubsIndex(prevIndex => prevIndex -1);
            }
        }
        if (heartsIndex >= 3 && diamondsIndex >= 3 && spadesIndex >= 3 && clubsIndex >= 3 && topRow3Reveal === false){
            setTopRow3Reveal(true);
            if (topRow1[0] === "H"){
                setHeartsIndex(prevIndex => prevIndex - 1);
            } else if (topRow3[0] === "D"){
                setDiamondsIndex(prevIndex => prevIndex - 1);
            } else if (topRow3[0] === "S"){
                setSpadesIndex(prevIndex => prevIndex - 1);
            } else if (topRow3[0] === "C"){
                setClubsIndex(prevIndex => prevIndex -1);
            }
        }
        if (heartsIndex >= 4 && diamondsIndex >= 4 && spadesIndex >= 4 && clubsIndex >= 4 && topRow4Reveal === false){
            setTopRow4Reveal(true);
            if (topRow1[0] === "H"){
                setHeartsIndex(prevIndex => prevIndex - 1);
            } else if (topRow4[0] === "D"){
                setDiamondsIndex(prevIndex => prevIndex - 1);
            } else if (topRow4[0] === "S"){
                setSpadesIndex(prevIndex => prevIndex - 1);
            } else if (topRow4[0] === "C"){
                setClubsIndex(prevIndex => prevIndex -1);
            }
        }
        if (heartsIndex >= 5 && diamondsIndex >= 5 && spadesIndex >= 5 && clubsIndex >= 5 && topRow5Reveal === false){
            setTopRow5Reveal(true);
            if (topRow1[0] === "H"){
                setHeartsIndex(prevIndex => prevIndex - 1);
            } else if (topRow5[0] === "D"){
                setDiamondsIndex(prevIndex => prevIndex - 1);
            } else if (topRow5[0] === "S"){
                setSpadesIndex(prevIndex => prevIndex - 1);
            } else if (topRow5[0] === "C"){
                setClubsIndex(prevIndex => prevIndex -1);
            }
        }
        if (heartsIndex >= 6 && diamondsIndex >= 6 && spadesIndex >= 6 && clubsIndex >= 6 && topRow6Reveal === false){
            setTopRow6Reveal(true);
            if (topRow1[0] === "H"){
                setHeartsIndex(prevIndex => prevIndex - 1);
            } else if (topRow6[0] === "D"){
                setDiamondsIndex(prevIndex => prevIndex - 1);
            } else if (topRow6[0] === "S"){
                setSpadesIndex(prevIndex => prevIndex - 1);
            } else if (topRow6[0] === "C"){
                setClubsIndex(prevIndex => prevIndex -1);
            }
        }
        if (heartsIndex >= 7 && diamondsIndex >= 7 && spadesIndex >= 7 && clubsIndex >= 7 && topRow7Reveal === false){
            setTopRow7Reveal(true);
            if (topRow1[0] === "H"){
                setHeartsIndex(prevIndex => prevIndex - 1);
            } else if (topRow7[0] === "D"){
                setDiamondsIndex(prevIndex => prevIndex - 1);
            } else if (topRow7[0] === "S"){
                setSpadesIndex(prevIndex => prevIndex - 1);
            } else if (topRow7[0] === "C"){
                setClubsIndex(prevIndex => prevIndex -1);
            }
        }

        if (heartsIndex === 8 || diamondsIndex === 8 || spadesIndex === 8 || clubsIndex === 8){
            setIsFinished(true);
            const maxIndex = [heartsIndex, diamondsIndex, spadesIndex, clubsIndex].indexOf(8);
            if (maxIndex === 0) {setWinner("Hearts");}
            if (maxIndex === 1) {setWinner("Diamonds");}
            if (maxIndex === 2) {setWinner("Spades");}
            if (maxIndex === 3) {setWinner("Clubs");}
        }
    }, [heartsIndex, diamondsIndex, spadesIndex, clubsIndex])
    

    const handleDeckClick = () => {
        if (!isFinished){
            setFlippedCard([deck[topCardIndex].value, deck[topCardIndex].suit]);

            if (topCardIndex < deck.length) {
                setTopCardIndex(topCardIndex + 1);
            }

            if (deck[topCardIndex].suit === "H") {
                setHeartsIndex(prevIndex => prevIndex + 1);
            } else if (deck[topCardIndex].suit === "D") {
                setDiamondsIndex(prevIndex => prevIndex +1);
            } else if (deck[topCardIndex].suit === "S"){
                setSpadesIndex(prevIndex => prevIndex + 1);
            } else if (deck[topCardIndex].suit === "C") {
                setClubsIndex(prevIndex => prevIndex + 1);
            }
        }
    }

    return (
        <div className="content-container">
            <Navbar />
            <div className="horse-race">
                <h1>Horse Race</h1>
                {isFinished ? <Modal header={`${winner} have won!`} message={"Time to hand out your bets"} buttonText={"Restart"} onButtonClick={refreshPage}></Modal> : ''}
                <div className="deck-row">
                    <img src={require('../../Images/cards/back_of_card.png')} className="back-of-card-deck" onClick={handleDeckClick} />
                    {flippedCard != null ?  <Card className={"back-of-card"} value={flippedCard[0]} suit={flippedCard[1]} faceUp={true} /> : 
                    <img src={require('../../Images/cards/blank_card.png')} className="back-of-card" ></img> }
                </div>
                <h3>Flip a card</h3>
                <div className="playing-game">
                    <div className="flex-col">
                        <div style={{flex: 1}}></div>
                        { heartsIndex === 0 ? 
                            <img src={require('../../Images/cards/AH.png')} className="back-of-card horizontal-card"></img> :
                            <img src={require('../../Images/cards/blank_card.png')} className="back-of-card horizontal-card"></img> }

                        { diamondsIndex === 0 ? 
                            <img src={require('../../Images/cards/AD.png')} className="back-of-card horizontal-card"></img> :
                            <img src={require('../../Images/cards/blank_card.png')} className="back-of-card horizontal-card"></img> }

                        { spadesIndex === 0 ? 
                            <img src={require('../../Images/cards/AS.png')} className="back-of-card horizontal-card"></img> :
                            <img src={require('../../Images/cards/blank_card.png')} className="back-of-card horizontal-card"></img> }

                        { clubsIndex === 0 ? 
                            <img src={require('../../Images/cards/AC.png')} className="back-of-card horizontal-card"></img> :
                            <img src={require('../../Images/cards/blank_card.png')} className="back-of-card horizontal-card"></img> }
                        
                        
                        
                    </div>
                    <div className="flex-col">
                        { topRow1Reveal === false ? 
                            <img src={require('../../Images/cards/back_of_card.png')} className="back-of-card horizontal-card" ></img> : 
                            <Card suit={topRow1[0]} value={topRow1[1]} faceUp={true} className={"back-of-card horizontal-card"} />}
                            
                        
                        { heartsIndex === 1 ? 
                            <img src={require('../../Images/cards/AH.png')} className="back-of-card horizontal-card"></img> :
                            <div style={{flex: 1}}></div> }

                        { diamondsIndex === 1 ? 
                            <img src={require('../../Images/cards/AD.png')} className="back-of-card horizontal-card"></img> :
                            <div style={{flex: 1}}></div> }

                        { spadesIndex === 1 ? 
                            <img src={require('../../Images/cards/AS.png')} className="back-of-card horizontal-card"></img> :
                            <div style={{flex: 1}}></div> }

                        { clubsIndex === 1 ? 
                            <img src={require('../../Images/cards/AC.png')} className="back-of-card horizontal-card"></img> :
                            <div style={{flex: 1}}></div> }
                    </div>

                    <div className="flex-col">
                        { topRow2Reveal === false ? 
                            <img src={require('../../Images/cards/back_of_card.png')} className="back-of-card horizontal-card" ></img> : 
                            <Card suit={topRow2[0]} value={topRow2[1]} faceUp={true} className={"back-of-card horizontal-card"} />}

                        { heartsIndex === 2 ? 
                            <img src={require('../../Images/cards/AH.png')} className="back-of-card horizontal-card"></img> :
                            <div style={{flex: 1}}></div> }

                        { diamondsIndex === 2 ? 
                            <img src={require('../../Images/cards/AD.png')} className="back-of-card horizontal-card"></img> :
                            <div style={{flex: 1}}></div> }

                        { spadesIndex === 2 ? 
                            <img src={require('../../Images/cards/AS.png')} className="back-of-card horizontal-card"></img> :
                            <div style={{flex: 1}}></div> }

                        { clubsIndex === 2 ? 
                            <img src={require('../../Images/cards/AC.png')} className="back-of-card horizontal-card"></img> :
                            <div style={{flex: 1}}></div> }
                    </div>

                    <div className="flex-col">
                        { topRow3Reveal === false ? 
                            <img src={require('../../Images/cards/back_of_card.png')} className="back-of-card horizontal-card" ></img> : 
                            <Card suit={topRow3[0]} value={topRow3[1]} faceUp={true} className={"back-of-card horizontal-card"} />}

                        { heartsIndex === 3 ? 
                            <img src={require('../../Images/cards/AH.png')} className="back-of-card horizontal-card"></img> :
                            <div style={{flex: 1}}></div> }

                        { diamondsIndex === 3 ? 
                            <img src={require('../../Images/cards/AD.png')} className="back-of-card horizontal-card"></img> :
                            <div style={{flex: 1}}></div> }

                        { spadesIndex === 3 ? 
                            <img src={require('../../Images/cards/AS.png')} className="back-of-card horizontal-card"></img> :
                            <div style={{flex: 1}}></div> }

                        { clubsIndex === 3 ? 
                            <img src={require('../../Images/cards/AC.png')} className="back-of-card horizontal-card"></img> :
                            <div style={{flex: 1}}></div> }
                    </div>
                    <div className="flex-col">
                        { topRow4Reveal === false ? 
                            <img src={require('../../Images/cards/back_of_card.png')} className="back-of-card horizontal-card" ></img> : 
                            <Card suit={topRow4[0]} value={topRow4[1]} faceUp={true} className={"back-of-card horizontal-card"} />}

                        { heartsIndex === 4 ? 
                            <img src={require('../../Images/cards/AH.png')} className="back-of-card horizontal-card"></img> :
                            <div style={{flex: 1}}></div> }

                        { diamondsIndex === 4 ? 
                            <img src={require('../../Images/cards/AD.png')} className="back-of-card horizontal-card"></img> :
                            <div style={{flex: 1}}></div> }

                        { spadesIndex === 4 ? 
                            <img src={require('../../Images/cards/AS.png')} className="back-of-card horizontal-card"></img> :
                            <div style={{flex: 1}}></div> }

                        { clubsIndex === 4 ? 
                            <img src={require('../../Images/cards/AC.png')} className="back-of-card horizontal-card"></img> :
                            <div style={{flex: 1}}></div> }
                    </div>

                    <div className="flex-col">
                        { topRow5Reveal === false ? 
                            <img src={require('../../Images/cards/back_of_card.png')} className="back-of-card horizontal-card" ></img> : 
                            <Card suit={topRow5[0]} value={topRow5[1]} faceUp={true} className={"back-of-card horizontal-card"} />}

                        { heartsIndex === 5 ? 
                            <img src={require('../../Images/cards/AH.png')} className="back-of-card horizontal-card"></img> :
                            <div style={{flex: 1}}></div> }

                        { diamondsIndex === 5 ? 
                            <img src={require('../../Images/cards/AD.png')} className="back-of-card horizontal-card"></img> :
                            <div style={{flex: 1}}></div> }

                        { spadesIndex === 5 ? 
                            <img src={require('../../Images/cards/AS.png')} className="back-of-card horizontal-card"></img> :
                            <div style={{flex: 1}}></div> }

                        { clubsIndex === 5 ? 
                            <img src={require('../../Images/cards/AC.png')} className="back-of-card horizontal-card"></img> :
                            <div style={{flex: 1}}></div> }
                    </div>

                    <div className="flex-col">
                        { topRow6Reveal === false ? 
                            <img src={require('../../Images/cards/back_of_card.png')} className="back-of-card horizontal-card" ></img> : 
                            <Card suit={topRow6[0]} value={topRow6[1]} faceUp={true} className={"back-of-card horizontal-card"} />}

                        { heartsIndex === 6 ? 
                            <img src={require('../../Images/cards/AH.png')} className="back-of-card horizontal-card"></img> :
                            <div style={{flex: 1}}></div> }

                        { diamondsIndex === 6 ? 
                            <img src={require('../../Images/cards/AD.png')} className="back-of-card horizontal-card"></img> :
                            <div style={{flex: 1}}></div> }

                        { spadesIndex === 6 ? 
                            <img src={require('../../Images/cards/AS.png')} className="back-of-card horizontal-card"></img> :
                            <div style={{flex: 1}}></div> }

                        { clubsIndex === 6 ? 
                            <img src={require('../../Images/cards/AC.png')} className="back-of-card horizontal-card"></img> :
                            <div style={{flex: 1}}></div> }
                    </div>

                    <div className="flex-col">
                        { topRow7Reveal === false ? 
                            <img src={require('../../Images/cards/back_of_card.png')} className="back-of-card horizontal-card" ></img> : 
                            <Card suit={topRow7[0]} value={topRow7[1]} faceUp={true} className={"back-of-card horizontal-card"} />}

                        { heartsIndex === 7 ? 
                            <img src={require('../../Images/cards/AH.png')} className="back-of-card horizontal-card"></img> :
                            <div style={{flex: 1}}></div> }

                        { diamondsIndex === 7 ? 
                            <img src={require('../../Images/cards/AD.png')} className="back-of-card horizontal-card"></img> :
                            <div style={{flex: 1}}></div> }

                        { spadesIndex === 7 ? 
                            <img src={require('../../Images/cards/AS.png')} className="back-of-card horizontal-card"></img> :
                            <div style={{flex: 1}}></div> }

                        { clubsIndex === 7 ? 
                            <img src={require('../../Images/cards/AC.png')} className="back-of-card horizontal-card"></img> :
                            <div style={{flex: 1}}></div> }
                    </div>
                    <hr></hr>

                    <div className="flex-col">
                        <div className="finish-line"> <h2>Finish line</h2></div>
                        { heartsIndex === 8 ? 
                            <img src={require('../../Images/cards/AH.png')} className="back-of-card horizontal-card"></img> :
                            <img src={require('../../Images/cards/blank_card.png')} className="back-of-card horizontal-card"></img> }

                        { diamondsIndex === 8 ? 
                            <img src={require('../../Images/cards/AD.png')} className="back-of-card horizontal-card"></img> :
                            <img src={require('../../Images/cards/blank_card.png')} className="back-of-card horizontal-card"></img> }

                        { spadesIndex === 8 ? 
                            <img src={require('../../Images/cards/AS.png')} className="back-of-card horizontal-card"></img> :
                            <img src={require('../../Images/cards/blank_card.png')} className="back-of-card horizontal-card"></img> }

                        { clubsIndex === 8 ? 
                            <img src={require('../../Images/cards/AC.png')} className="back-of-card horizontal-card"></img> :
                            <img src={require('../../Images/cards/blank_card.png')} className="back-of-card horizontal-card"></img> }
                        
                    </div>
                    
                </div>
            </div>
        </div>
    )
  };
  
  export default HorseRace;