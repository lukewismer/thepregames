import React, {useState, useEffect} from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import './AroundTheWorld.css';
import Card from '../../Components/Card';

const SUITS = ['H', 'C', 'D', 'S'];
const VALUES = ['A', '2', '3', '4', '5', '6', '8', '9', '10', 'J', 'Q', 'K'];

// TODO: Fix Ties (not sure if it works for higher/lower but it doesn't for inside/outside)
// TODO: Don't reveal card if there is no guess made, alert the user on error and continue

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

const forceShuffle = () => {
  //I want to shuffle the deck so it will be AH, AD, AC, AS, 2H, 2D, 2C, 2S, 3H, 3D, 3C, 3S, etc.

  const deck = [{"suit": "H", "value": "A"}, {"suit": "D", "value": "2"}, {"suit": "C", "value": "3"}, {"suit": "S", "value": "3"}];

  console.log(deck);

  return deck;
}

const AroundTheWorld = () => {
    const [deck, setDeck] = useState(() => shuffleDeck(generateDeck()));
    const [cards, setCards] = useState([["7", "H"], null, null, null, null, ["7", "D"], null, null, null, null, ["7", "C"], null, null, null, null, ["7", "S"], null, null, null, null])

    const [topCardIndex, setTopCardIndex] = useState(0);

    const [card2Clicked, setCard2Clicked] = useState(false);
    const [card3Clicked, setCard3Clicked] = useState(false);
    const [card4Clicked, setCard4Clicked] = useState(false);
    const [card5Clicked, setCard5Clicked] = useState(false);
    const [card7Clicked, setCard7Clicked] = useState(false);
    const [card8Clicked, setCard8Clicked] = useState(false);
    const [card9Clicked, setCard9Clicked] = useState(false);
    const [card10Clicked, setCard10Clicked] = useState(false);
    const [card12Clicked, setCard12Clicked] = useState(false);
    const [card13Clicked, setCard13Clicked] = useState(false);
    const [card14Clicked, setCard14Clicked] = useState(false);
    const [card15Clicked, setCard15Clicked] = useState(false);
    const [card17Clicked, setCard17Clicked] = useState(false);
    const [card18Clicked, setCard18Clicked] = useState(false);
    const [card19Clicked, setCard19Clicked] = useState(false);
    const [card20Clicked, setCard20Clicked] = useState(false);

    const [btnClicked, setBtnClicked] = useState(null);


    const [guess, setGuess] = useState(null);
    const image = require("../../Images/cards/back_of_card.png");

  const incrementIndex = () => {
    if (topCardIndex == 48)
    {
      setTopCardIndex(0);
    } else {
      setTopCardIndex(prevIndex => (prevIndex + 1))
    }
  }

  const checkGuess = (newCard, index) => {
    if (guess) {
      if (index === 19){
        if (guess === "inside"){
          if (cards[0] != null && cards[18] != null && ((parseCardInt(cards[0][0]) < parseCardInt(newCard[0]) && parseCardInt(newCard[0]) < parseCardInt(cards[18][0]))
                                                        || (parseCardInt(cards[0][0]) > parseCardInt(newCard[0]) && parseCardInt(newCard[0]) > parseCardInt(cards[18][0])))){
                                                          
            // Situation for when guess is correctly inside on the 19th card
            return true;
          }
          else {
            return false;
          }
        } else if (guess === "outside"){
            if (cards[0] != null && cards[18] != null && ((parseCardInt(cards[0][0]) > parseCardInt(newCard[0]) && parseCardInt(newCard[0]) < parseCardInt(cards[18][0]))
                                                          || (parseCardInt(cards[0][0]) < parseCardInt(newCard[0]) && parseCardInt(newCard[0]) > parseCardInt(cards[18][0])))){
                                                            
              // Situation for when guess is correctly outside on the 19th card
              return true;
            }
            else {
              return false;
            }
        }
        else if (guess === "higher"){
          if (cards[0] != null && parseCardInt(cards[0][0]) < parseCardInt(newCard[0])){ // Guess is higher and edge case 19
            return true;
          } else if (cards[index - 1] != null && parseCardInt(cards[index - 1][0]) < parseCardInt(newCard[0])){ // Guess is higher and edge case 19
            return true;
          } else {return false} 
        } else if (guess == "lower"){
          if (cards[0] != null && parseCardInt(cards[0][0]) > parseCardInt(newCard[0])){ // Guess is lower and edge case 19
            return true;
          } else if (cards[index - 1] != null && parseCardInt(cards[0][0]) > parseCardInt(newCard[0])){ // Guess is lower and edge case 19
            return true;
          } else {return false} 
        }
        
      } 
      else if (index === 0){
        if (guess === "inside"){
          if (cards[1] != null && cards[19] != null && ((parseCardInt(cards[1][0]) < parseCardInt(newCard[0]) && parseCardInt(newCard[0]) < parseCardInt(cards[19][0]))
                                                        || (parseCardInt(cards[1][0]) > parseCardInt(newCard[0]) && parseCardInt(newCard[0]) > parseCardInt(cards[19][0])))){
                                                          
            // Situation for when guess is correctly inside on the 19th card
            return true;
          }
          else {
            return false;
          }
        } else if (guess === "outside"){
            if (cards[1] != null && cards[19] != null && ((parseCardInt(cards[1][0]) > parseCardInt(newCard[0]) && parseCardInt(newCard[0]) < parseCardInt(cards[19][0]))
                                                          || (parseCardInt(cards[1][0]) < parseCardInt(newCard[0]) && parseCardInt(newCard[0]) > parseCardInt(cards[19][0])))){
                                                            
              // Situation for when guess is correctly outside on the 19th card
              return true;
            }
            else {
              return false;
            }
        }
        if (guess === "higher"){
          if (cards[19] != null && parseCardInt(cards[19][0]) < parseCardInt(newCard[0])){ // Guess is higher and edge case 1
            return true;
          } else if (cards[index + 1] != null && parseCardInt(cards[index + 1][0]) < parseCardInt(newCard[0])){ // Guess is higher and edge case 1
            return true;
          } else {return false} 
        } else if (guess == "lower"){
          if (cards[19] != null && parseCardInt(cards[19][0]) > parseCardInt(newCard[0])){ // Guess is lower and edge case 1
            return true;
          } else if (cards[index + 1] != null && parseCardInt(cards[index + 1][0]) > parseCardInt(newCard[0])){ // Guess is lower and edge case 1
            return true;
          } else {return false} 
        }
  
      } else {
        if (guess === "inside"){
          if (cards[index-1] != null && cards[index+1] != null && ((parseCardInt(cards[index-1][0]) < parseCardInt(newCard[0]) && parseCardInt(newCard[0]) < parseCardInt(cards[index+1][0]))
                                                        || (parseCardInt(cards[index-1][0]) > parseCardInt(newCard[0]) && parseCardInt(newCard[0]) > parseCardInt(cards[index+1][0])))){
                                                          
            // Situation for when guess is correctly inside on the 19th card
            return true;
          }
          else {
            return false;
          }
        } else if (guess === "outside"){
            if (cards[index-1] != null && cards[index+1] != null && ((parseCardInt(cards[index-1][0]) > parseCardInt(newCard[0]) && parseCardInt(newCard[0]) < parseCardInt(cards[index+1][0]))
                                                          || (parseCardInt(cards[index-1][0]) < parseCardInt(newCard[0]) && parseCardInt(newCard[0]) > parseCardInt(cards[index+1][0])))){
                                                            
              // Situation for when guess is correctly outside on the 19th card
              return true;
            }
            else {
              return false;
            }
        }
        if (guess === "higher"){
          if (cards[index - 1] != null && parseCardInt(cards[index - 1][0]) < parseCardInt(newCard[0])){ // Guess is higher and edge case 1
            return true;
          } else if (cards[index + 1] != null && parseCardInt(cards[index + 1][0]) < parseCardInt(newCard[0])){ // Guess is higher and edge case 1
            return true;
          } else {return false} 
        } else if (guess == "lower"){
          if (cards[index - 1] != null && parseCardInt(cards[index - 1][0]) > parseCardInt(newCard[0])){ // Guess is lower and edge case 1
            return true;
          } else if (cards[index + 1] != null && parseCardInt(cards[index + 1][0]) > parseCardInt(newCard[0])){ // Guess is lower and edge case 1
            return true;
          } else {
            
            return false
          } 
        }
      }
    } else {
      alert("must make guess");
      return false;
    }
    
  }

  const checkTie = (newCard, index) => {
    if (guess){
      if (index === 19){
        if (guess == "inside" || guess == "outside")
        {
          if (parseCardInt(cards[0][0]) == parseCardInt(newCard[0]) || parseCardInt(cards[18][0] == parseCardInt(newCard[0]))){
            return true;
          } else {
            return false;
          }
        }
        else if (guess === "higher" || guess == "lower"){
          if (cards[0] != null && parseCardInt(cards[0][0]) == parseCardInt(newCard[0])){
            return true;
          } else if (cards[18] != null && parseCardInt(cards[18][0]) == parseCardInt(newCard[0])){ 
            return true;
          } else {return false} 
        } 
      }
      else {
        if (guess == "inside" || guess == "outside")
        {
          if (cards[index+1] != null && parseCardInt(cards[index+1][0]) == parseCardInt(newCard[0]) || cards[index-1] != null && parseCardInt(cards[index-1][0]) == parseCardInt(newCard[0])){
            return true;
          } else {
            return false;
          }
        }
        else if (guess == "higher" || guess == "lower"){
          if (cards[index+1] != null && parseCardInt(cards[index+1][0]) == parseCardInt(newCard[0])){
            alert("tie");
            return true;
            
          } else if (cards[index-1] != null && parseCardInt(cards[index-1][0]) == parseCardInt(newCard[0])){ 
            alert("tie");
            return true;
            
          } else {return false} 
        } 
      }
    } 
  }
  
  const checkIfTwoNeighbors = (index) => { 
    if (index === 19){
      if (cards[0] != null && cards[18] != null){
        return true;
      } else {
        return false;
      }
    }
    else if (index === 0){
      if (cards[19] != null && cards[1] != null){
        return true;
      } else {
        return false;
      }
    }
    else {
      if (cards[index-1] != null && cards[index+1] != null){
        return true;
      } else {
        return false;
      }
    }
  }

  const parseCardInt = (value) => {
    if (value == "K"){
      return 13;
    } else if (value == "Q"){
      return 12;
    } else if (value == "J"){
      return 11;
    } else if (value == "A"){
      return 1;
    } else {
      return parseInt(value);
    }
  }

  const checkEligibility = (index) => {
    if (guess == "inside" || guess == "outside"){
      if (index == 19){
        if (cards[0] != null && cards[18] != null){
          return true;
        } else {
          return false;
        }
      }
      else if (index == 0){
        if (cards[19] != null && cards[1] != null){
          return true;
        } else {
          return false;
        }
      }
      else {
        if (cards[index-1] != null && cards[index+1] != null){
          return true;
        } else {
          return false;
        }
      }
    } else {
      if (index === 19){
        if (cards[0] === null && cards[18] === null){
          return false;
        } else {
          return true;
        }
      } 
      else if (index === 0){
        if (cards[19] === null && cards[1] === null){
          return false;
        } else {
          return true;
        }
      } else {
        if (cards[index - 1] === null && cards[index + 1] === null){
          return false
        } else {
          return true;
        }
      }
    }
    
  }

  const handleBtnClickHigher = () =>{
    setBtnClicked(0);
    setGuess("higher");
  }

  const handleBtnClickLower = () =>{
    setBtnClicked(1);
    setGuess("lower");
  }

  const handleBtnClickInside = () => {
    setBtnClicked(2);
    setGuess("inside");
  }

  const handleBtnClickOutside = () => {
    setBtnClicked(3);
    setGuess("outside")
  }

  const addCard = (card, index) => {
    // Adds a card to the deck
    const newCards = cards.map((c, i) => {
      if (i === index){
        return c = card
      } else {
        return c = c;
      }
    });
    setCards(newCards);
  }

  const checkRemoveNeighbors = (index) => {
    let cardsCopy = [...cards];
  
    // Traverse to the left (down in indices)
    for (let i = index; i >=0; i--) {
      if (cardsCopy[i-1] == null) {
        cardsCopy[i] = null;
        break;
      }
      if (cardsCopy[i-1][0] != "7") {
        cardsCopy[i-1] = null;
      }
      if (i==1){
        i=20;
      }
    }
  
    // Traverse to the right (up in indices)
    for (let i = index; i<19; i++) {
      if (cardsCopy[i+1] == null) {
        cardsCopy[i] = null;
        break;
      }
      if (cardsCopy[i+1][0] != "7") {
        cardsCopy[i+1] = null;
      }
      if (i == 18){
        i=-1;
      }
    }
  
    setCards(cardsCopy);
  }

  const removeCard = (index) => {
    let cardsCopy = [...cards];

    cardsCopy[index] = null;
  
    setCards(cardsCopy);

  }
  

  useEffect(() => {
    if (topCardIndex == 48){
      setDeck(shuffleDeck(generateDeck()));
      setTopCardIndex(0);
    }
    if (card2Clicked){
      const newCard = [deck[topCardIndex].value, deck[topCardIndex].suit];
      if ((guess === "higher" || guess === "lower") && checkIfTwoNeighbors(1)){
        alert("Cannot guess higher or lower on a card with two neighbors");
        setCard2Clicked(false);
        return;
      }else if ((guess === "inside" || guess === "outside") && !checkIfTwoNeighbors(1)){
        alert("Must guess higher or lower on a card with one neighbor");
        setCard2Clicked(false);
        return;
      }
      if (checkEligibility(newCard, 1) && checkGuess(newCard, 1)){
          addCard(newCard, 1);
          incrementIndex();
      } else {
          addCard(newCard, 1);
          incrementIndex();
          if (!checkTie(newCard, 1)){
            setTimeout(() => {
              // removeCard gets called only if the guess was wrong
              if (!checkGuess(newCard, 1)) {
                  checkRemoveNeighbors(1);
              }
            }, 1000);
          }
          else {
            setTimeout(() => {
              removeCard(1);
            }, 1000);
          }
          
      }
      setBtnClicked(null);
      setGuess(null);
      setCard2Clicked(false);
    }
   else if (card3Clicked){
      const newCard = [deck[topCardIndex].value, deck[topCardIndex].suit];
      if ((guess === "higher" || guess === "lower") && checkIfTwoNeighbors(2)){
        alert("Cannot guess higher or lower on a card with two neighbors");
        setCard3Clicked(false);
        return;
      } else if ((guess === "inside" || guess === "outside") && !checkIfTwoNeighbors(2)){
        alert("Must guess higher or lower on a card with one neighbor");
        setCard3Clicked(false);
        return;
      }
      if (checkEligibility(newCard, 2) && checkGuess(newCard, 2)){
        addCard(newCard, 2);
        incrementIndex();
        
      }
      else {
        addCard(newCard, 2);
        incrementIndex();
        if (!checkTie(newCard, 2)){
          setTimeout(() => {
            // removeCard gets called only if the guess was wrong
            if (!checkGuess(newCard, 2)) {
                checkRemoveNeighbors(2);
            }
          }, 1000);
        }
        else {
          setTimeout(() => {
            removeCard(2);
          }, 1000);
        }
      }
      setBtnClicked(null);
      setGuess(null);
      setCard3Clicked(false);

    } else if (card4Clicked){
      const newCard = [deck[topCardIndex].value, deck[topCardIndex].suit];
      if ((guess === "higher" || guess === "lower") && checkIfTwoNeighbors(3)){
        alert("Cannot guess higher or lower on a card with two neighbors");
        setCard4Clicked(false);
        return;
      } else if ((guess === "inside" || guess === "outside") && !checkIfTwoNeighbors(3)){
        alert("Must guess higher or lower on a card with one neighbor");
        setCard4Clicked(false);
        return;
      }
      if (checkEligibility(newCard, 3) && checkGuess(newCard, 3)){
        addCard(newCard, 3);
        incrementIndex();
        
      }
      else {
        addCard(newCard, 3);
        incrementIndex();
        if (!checkTie(newCard, 3)){
          setTimeout(() => {
            // removeCard gets called only if the guess was wrong
            if (!checkGuess(newCard, 3)) {
                checkRemoveNeighbors(3);
            }
          }, 1000);
        }
        else {
          setTimeout(() => {

            removeCard(3);
          }, 1000);
        }
      }
      setBtnClicked(null);
      setGuess(null);
      setCard4Clicked(false);

    } else if (card5Clicked){
      const newCard = [deck[topCardIndex].value, deck[topCardIndex].suit];
      if ((guess === "higher" || guess === "lower") && checkIfTwoNeighbors(4)){
        alert("Cannot guess higher or lower on a card with two neighbors");
        setCard5Clicked(false);
        return;
      } else if ((guess === "inside" || guess === "outside") && !checkIfTwoNeighbors(4)){
        alert("Must guess higher or lower on a card with one neighbor");
        setCard5Clicked(false);
        return;
      }

      if (checkEligibility(newCard, 4) && checkGuess(newCard, 4)){
        addCard(newCard, 4);
        incrementIndex();
        
      }
      else {
        addCard(newCard, 4);
        incrementIndex();
        if (!checkTie(newCard, 4)){
          setTimeout(() => {
            // removeCard gets called only if the guess was wrong
            if (!checkGuess(newCard, 4)) {
                checkRemoveNeighbors(4);
            }
          }, 1000);
        }
        else {
          setTimeout(() => {

            removeCard(4);
          }, 1000);
        }
      }
      setBtnClicked(null);
      setGuess(null);
      setCard5Clicked(false);

    } else if (card7Clicked){
      const newCard = [deck[topCardIndex].value, deck[topCardIndex].suit];
      if ((guess === "higher" || guess === "lower") && checkIfTwoNeighbors(6)){
        alert("Cannot guess higher or lower on a card with two neighbors");
        setCard7Clicked(false);
        return;
      } else if ((guess === "inside" || guess === "outside") && !checkIfTwoNeighbors(6)){
        alert("Must guess higher or lower on a card with one neighbor");
        setCard7Clicked(false);
        return;
      }
      if (checkEligibility(newCard, 6) && checkGuess(newCard, 6)){
        addCard(newCard, 6);
        incrementIndex();
        
      }
      else {
        addCard(newCard, 6);
        incrementIndex();
        if (!checkTie(newCard, 6)){
          setTimeout(() => {
            // removeCard gets called only if the guess was wrong
            if (!checkGuess(newCard, 6)) {
                checkRemoveNeighbors(6);
            }
          }, 1000);
        }
        else {
          setTimeout(() => {

            removeCard(6);
          }, 1000);
        }
      }
      setBtnClicked(null);
      setGuess(null);
      setCard7Clicked(false);

    } else if (card8Clicked){
      const newCard = [deck[topCardIndex].value, deck[topCardIndex].suit];
      if ((guess === "higher" || guess === "lower") && checkIfTwoNeighbors(7)){
        alert("Cannot guess higher or lower on a card with two neighbors");
        setCard8Clicked(false);
        return;
      }else if ((guess === "inside" || guess === "outside") && !checkIfTwoNeighbors(7)){
        alert("Must guess higher or lower on a card with one neighbor");
        setCard8Clicked(false);
        return;
      }

      if (checkEligibility(newCard, 7) && checkGuess(newCard, 7)){
        addCard(newCard, 7);
        incrementIndex();
        
      }
      else {
        addCard(newCard, 7);
        incrementIndex();
        if (!checkTie(newCard, 7)){
          setTimeout(() => {
            // removeCard gets called only if the guess was wrong
            if (!checkGuess(newCard, 7)) {
                checkRemoveNeighbors(7);
            }
          }, 1000);
        }
        else {
          setTimeout(() => {

            removeCard(7);
          }, 1000);
        }
      }
      setBtnClicked(null);
      setGuess(null);
      setCard8Clicked(false);

    } else if (card9Clicked){
      const newCard = [deck[topCardIndex].value, deck[topCardIndex].suit];
      if ((guess === "higher" || guess === "lower") && checkIfTwoNeighbors(8)){
        alert("Cannot guess higher or lower on a card with two neighbors");
        setCard9Clicked(false);
        return;
      }else if ((guess === "inside" || guess === "outside") && !checkIfTwoNeighbors(8)){
        alert("Must guess higher or lower on a card with one neighbor");
        setCard9Clicked(false);
        return;
      }
      if (checkEligibility(newCard, 8) && checkGuess(newCard, 8)){
        addCard(newCard, 8);
        incrementIndex();
        
      }
      else {
        addCard(newCard, 8);
        incrementIndex();
        if (!checkTie(newCard, 8)){
          setTimeout(() => {
            // removeCard gets called only if the guess was wrong
            if (!checkGuess(newCard, 8)) {
                checkRemoveNeighbors(8);
            }
          }, 1000);
        }
        else {
          setTimeout(() => {

            removeCard(8);
          }, 1000);
        }
      }
      setBtnClicked(null);
      setGuess(null);
      setCard9Clicked(false);

    } else if (card10Clicked){
      const newCard = [deck[topCardIndex].value, deck[topCardIndex].suit];
      if ((guess === "higher" || guess === "lower") && checkIfTwoNeighbors(9)){
        alert("Cannot guess higher or lower on a card with two neighbors");
        setCard10Clicked(false);
        return;
      }else if ((guess === "inside" || guess === "outside") && !checkIfTwoNeighbors(9)){
        alert("Must guess higher or lower on a card with one neighbor");
        setCard10Clicked(false);
        return;
      }
      if (checkEligibility(newCard, 9) && checkGuess(newCard, 9)){
        addCard(newCard, 9);
        incrementIndex();
        
      }
      else {
        addCard(newCard, 9);
        incrementIndex();
        if (!checkTie(newCard, 9)){
          setTimeout(() => {
            // removeCard gets called only if the guess was wrong
            if (!checkGuess(newCard, 9)) {
                checkRemoveNeighbors(9);
            }
          }, 1000);
        }
        else {
          setTimeout(() => {

            removeCard(9);
          }, 1000);
        }
      }
      setBtnClicked(null);
      setGuess(null);
      setCard10Clicked(false);

    } else if (card12Clicked){
      const newCard = [deck[topCardIndex].value, deck[topCardIndex].suit];
      if ((guess === "higher" || guess === "lower") && checkIfTwoNeighbors(11)){
        alert("Cannot guess higher or lower on a card with two neighbors");
        setCard12Clicked(false);
        return;
      }else if ((guess === "inside" || guess === "outside") && !checkIfTwoNeighbors(11)){
        alert("Must guess higher or lower on a card with one neighbor");
        setCard12Clicked(false);
        return;
      }
      if (checkEligibility(newCard, 11) && checkGuess(newCard, 11)){
        addCard(newCard, 11);
        incrementIndex();
        
      }
      else {
        addCard(newCard, 11);
        incrementIndex();
        if (!checkTie(newCard, 11)){
          setTimeout(() => {
            // removeCard gets called only if the guess was wrong
            if (!checkGuess(newCard, 11)) {
                checkRemoveNeighbors(11);
            }
          }, 1000);
        }
        else {
          setTimeout(() => {

            removeCard(11);
          }, 1000);
        }
      }
      setBtnClicked(null);
      setGuess(null);
      setCard12Clicked(false);

    } else if (card13Clicked){
      const newCard = [deck[topCardIndex].value, deck[topCardIndex].suit];
      if ((guess === "higher" || guess === "lower") && checkIfTwoNeighbors(12)){
        alert("Cannot guess higher or lower on a card with two neighbors");
        setCard13Clicked(false);
        return;
      }else if ((guess === "inside" || guess === "outside") && !checkIfTwoNeighbors(12)){
        alert("Must guess higher or lower on a card with one neighbor");
        setCard13Clicked(false);
        return;
      }
      if (checkEligibility(newCard, 12 && checkGuess(newCard, 12))){
        addCard(newCard, 12);
        incrementIndex();
        
      }
      else {
        addCard(newCard, 12);
        incrementIndex();
        if (!checkTie(newCard, 12)){
          setTimeout(() => {
            // removeCard gets called only if the guess was wrong
            if (!checkGuess(newCard, 12)) {
                checkRemoveNeighbors(12);
            }
          }, 1000);
        }
        else {
          setTimeout(() => {

            removeCard(12);
          }, 1000);
        }
      }
      setBtnClicked(null);
      setGuess(null);
      setCard13Clicked(false);

    } else if (card14Clicked){
      const newCard = [deck[topCardIndex].value, deck[topCardIndex].suit];
      if ((guess === "higher" || guess === "lower") && checkIfTwoNeighbors(13)){
        alert("Cannot guess higher or lower on a card with two neighbors");
        setCard14Clicked(false);
        return;
      }else if ((guess === "inside" || guess === "outside") && !checkIfTwoNeighbors(13)){
        alert("Must guess higher or lower on a card with one neighbor");
        setCard14Clicked(false);
        return;
      }
      if (checkEligibility(newCard, 13) && checkGuess(newCard, 13)){
        addCard(newCard, 13);
        incrementIndex();
        
      }
      else {
        addCard(newCard, 13);
        incrementIndex();
        if (!checkTie(newCard, 13)){
          setTimeout(() => {
            // removeCard gets called only if the guess was wrong
            if (!checkGuess(newCard, 13)) {
                checkRemoveNeighbors(13);
            }
          }, 1000);
        }
        else {
          setTimeout(() => {

            removeCard(13);
          }, 1000);
        }
      }
      setBtnClicked(null);
      setGuess(null);
      setCard14Clicked(false);

    } else if (card15Clicked){
      const newCard = [deck[topCardIndex].value, deck[topCardIndex].suit];
      if ((guess === "higher" || guess === "lower") && (checkIfTwoNeighbors(14))){
        alert("Cannot guess higher or lower on a card with two neighbors");
        setCard15Clicked(false);
        return;
      }else if ((guess === "inside" || guess === "outside") && !checkIfTwoNeighbors(14)){
        alert("Must guess higher or lower on a card with one neighbor");
        setCard15Clicked(false);
        return;
      }
      if (checkEligibility(newCard, 14) && checkGuess(newCard, 14)){
        addCard(newCard, 14);
        incrementIndex();
        
      }
      else {
        addCard(newCard, 14);
        incrementIndex();
        if (!checkTie(newCard, 14)){
          setTimeout(() => {
            // removeCard gets called only if the guess was wrong
            if (!checkGuess(newCard, 14)) {
                checkRemoveNeighbors(14);
            }
          }, 1000);
        }
        else {
          setTimeout(() => {

            removeCard(14);
          }, 1000);
        }
      }
      setBtnClicked(null);
      setGuess(null);
      setCard15Clicked(false);

    } else if (card17Clicked){
      const newCard = [deck[topCardIndex].value, deck[topCardIndex].suit];
      if ((guess === "higher" || guess === "lower") && (checkIfTwoNeighbors(16))){
        alert("Cannot guess higher or lower on a card with two neighbors");
        setCard17Clicked(false);
        return;
      }else if ((guess === "inside" || guess === "outside") && !checkIfTwoNeighbors(16)){
        alert("Must guess higher or lower on a card with one neighbor");
        setCard17Clicked(false);
        return;
      }
      if (checkEligibility(newCard, 16) && checkGuess(newCard, 16)){
        addCard(newCard, 16);
        incrementIndex();
        
      }
      else {
        addCard(newCard, 16);
        incrementIndex();
        if (!checkTie(newCard, 16)){
          setTimeout(() => {
            // removeCard gets called only if the guess was wrong
            if (!checkGuess(newCard, 16)) {
                checkRemoveNeighbors(16);
            }
          }, 1000);
        }
        else {
          setTimeout(() => {

            removeCard(16);
          }, 1000);
        }
      }
      setBtnClicked(null);
      setGuess(null);
      setCard17Clicked(false);

    } else if (card18Clicked){
      const newCard = [deck[topCardIndex].value, deck[topCardIndex].suit];
      if ((guess === "higher" || guess === "lower") && (checkIfTwoNeighbors(17))){
        alert("Cannot guess higher or lower on a card with two neighbors");
        setCard18Clicked(false);
        return;
      }else if ((guess === "inside" || guess === "outside") && !checkIfTwoNeighbors(17)){
        alert("Must guess higher or lower on a card with one neighbor");
        setCard18Clicked(false);
        return;
      }
      if (checkEligibility(newCard, 17) && checkGuess(newCard, 17)){
        addCard(newCard, 17);
        incrementIndex();
        
      }
      else {
        addCard(newCard, 17);
        incrementIndex();
        if (!checkTie(newCard, 17)){
          setTimeout(() => {
            // removeCard gets called only if the guess was wrong
            if (!checkGuess(newCard, 17)) {
                checkRemoveNeighbors(17);
            }
          }, 1000);
        }
        else {
          setTimeout(() => {

            removeCard(17);
          }, 1000);
        }
      }
      setBtnClicked(null);
      setGuess(null);
      setCard18Clicked(false);

    } else if (card19Clicked){
      const newCard = [deck[topCardIndex].value, deck[topCardIndex].suit];
      if ((guess === "higher" || guess === "lower") && (checkIfTwoNeighbors(18))){
        alert("Cannot guess higher or lower on a card with two neighbors");
        setCard19Clicked(false);
        return;
      }else if ((guess === "inside" || guess === "outside") && !checkIfTwoNeighbors(18)){
        alert("Must guess higher or lower on a card with one neighbor");
        setCard19Clicked(false);
        return;
      }
      if (checkEligibility(newCard, 18) && checkGuess(newCard, 18)){
        addCard(newCard, 18);
        incrementIndex();
        
      }
      else {
        addCard(newCard, 18);
        incrementIndex();
        if (!checkTie(newCard, 18)){
          setTimeout(() => {
            // removeCard gets called only if the guess was wrong
            if (!checkGuess(newCard, 18)) {
                checkRemoveNeighbors(18);
            }
          }, 1000);
        }
        else {
          setTimeout(() => {

            removeCard(18);
          }, 1000);
        }
      }
      setBtnClicked(null);
      setGuess(null);
      setCard19Clicked(false);

    } else if (card20Clicked){
      const newCard = [deck[topCardIndex].value, deck[topCardIndex].suit];
      if ((guess === "higher" || guess === "lower") && (checkIfTwoNeighbors(19))){
        alert("Cannot guess higher or lower on a card with two neighbors");
        setCard20Clicked(false);
        return;
      }else if ((guess === "inside" || guess === "outside") && !checkIfTwoNeighbors(19)){
        alert("Must guess higher or lower on a card with one neighbor");
        setCard20Clicked(false);
        return;
      }
      if (checkEligibility(newCard, 19) && checkGuess(newCard, 19)){
        addCard(newCard, 19);
        incrementIndex();
        
      }
      else {
        addCard(newCard, 19);
        incrementIndex();
        if (!checkTie(newCard, 19)){
          setTimeout(() => {
            // removeCard gets called only if the guess was wrong
            if (!checkGuess(newCard, 19)) {
                checkRemoveNeighbors(19);
            }
          }, 1000);
        }
        else {
          setTimeout(() => {

            removeCard(19);
          }, 1000);
        }
      }
      setBtnClicked(null);
      setGuess(null);
      setCard20Clicked(false);
    }
  }, [card2Clicked, card3Clicked, card4Clicked, card5Clicked, card7Clicked, card8Clicked, card9Clicked, card10Clicked, card12Clicked, card13Clicked, card14Clicked, card15Clicked, card17Clicked, card18Clicked, card19Clicked, card20Clicked]);

  const onCard2Flip = () =>{
    setCard2Clicked(true);
  }

  const onCard3Flip = () =>{
    setCard3Clicked(true);
  }

  const onCard4Flip = () =>{
    setCard4Clicked(true);
  }
  const onCard5Flip = () =>{
    setCard5Clicked(true);
  }

  const onCard7Flip = () =>{
    setCard7Clicked(true);
  }
  const onCard8Flip = () =>{
    setCard8Clicked(true);
  }
  const onCard9Flip = () =>{
    setCard9Clicked(true);
  }
  const onCard10Flip = () =>{
    setCard10Clicked(true);
  }

  const onCard12Flip = () =>{
    setCard12Clicked(true);
  }

  const onCard13Flip = () =>{
    setCard13Clicked(true);
  }

  const onCard14Flip = () =>{
    setCard14Clicked(true);
  }

  const onCard15Flip = () =>{
    setCard15Clicked(true);
  }

  const onCard17Flip = () =>{
    setCard17Clicked(true);
  }

  const onCard18Flip = () =>{
    setCard18Clicked(true);
  }

  const onCard19Flip = () =>{
    setCard19Clicked(true);
  }

  const onCard20Flip = () =>{
    setCard20Clicked(true);
  }

  const emptyFunction = () => {
    return null;
  }

    
  return (
    <>
    <Navbar />
        <div className='container'>
        
        <h1 >Around The World</h1>
        <div className={"btn-container"}>
          <button className={btnClicked === 0 ? 'guess-btn-active' : 'guess-btn'} onClick={handleBtnClickHigher}>Higher</button>
          
          <button className={btnClicked === 1 ? 'guess-btn-active' : 'guess-btn'} onClick={handleBtnClickLower}>Lower</button>

          <button className={btnClicked === 2 ? 'guess-btn-active' : 'guess-btn'} onClick={handleBtnClickInside}>Inside</button>
          
          <button className={btnClicked === 3 ? 'guess-btn-active' : 'guess-btn'} onClick={handleBtnClickOutside}>Outside</button>
        
        </div>
        
        <div className="grid-layout">
            <img src={require('../../Images/cards/7H.png')} className="back-of-card group1"></img>
            { cards[1] ? <Card value={cards[1][0]} suit={cards[1][1]} faceUp={true} onClick={emptyFunction} className="back-of-card group2" />: <img src={image} className="back-of-card group2" onClick={(onCard2Flip)}></img>}
            { cards[2] ? <Card value={cards[2][0]} suit={cards[2][1]} faceUp={true} onClick={emptyFunction} className="back-of-card group3" />: <img src={image} className="back-of-card group3" onClick={(onCard3Flip)}></img>}
            { cards[3] ? <Card value={cards[3][0]} suit={cards[3][1]} faceUp={true} onClick={emptyFunction} className="back-of-card group4" />: <img src={image} className="back-of-card group4" onClick={(onCard4Flip)}></img>}
            { cards[4] ? <Card value={cards[4][0]} suit={cards[4][1]} faceUp={true} onClick={emptyFunction} className="back-of-card group5" />: <img src={image} className="back-of-card group5" onClick={(onCard5Flip)}></img>}
            
            <img src={require('../../Images/cards/7D.png')} className="back-of-card group6"></img>

            { cards[6] ? <Card value={cards[6][0]} suit={cards[6][1]} faceUp={true} onClick={emptyFunction} className="back-of-card group7" />: <img src={image} className="back-of-card group7" onClick={(onCard7Flip)}></img>}
            { cards[7] ? <Card value={cards[7] [0]} suit={cards[7] [1]} faceUp={true} onClick={emptyFunction} className="back-of-card group8" />: <img src={image} className="back-of-card group8" onClick={(onCard8Flip)}></img>}
            { cards[8]  ? <Card value={cards[8][0]} suit={cards[8][1]} faceUp={true} onClick={emptyFunction} className="back-of-card group9" />: <img src={image} className="back-of-card group9" onClick={(onCard9Flip)}></img>}
            { cards[9] ? <Card value={cards[9][0]} suit={cards[9][1]} faceUp={true} onClick={emptyFunction} className="back-of-card group10" />: <img src={image} className="back-of-card group10" onClick={(onCard10Flip)}></img>}

            <img src={require('../../Images/cards/7C.png')} className="back-of-card group11"></img>

            { cards[11] ? <Card value={cards[11][0]} suit={cards[11][1]} faceUp={true} onClick={emptyFunction} className="back-of-card group12" />: <img src={image} className="back-of-card group12" onClick={(onCard12Flip)}></img>}
            { cards[12] ? <Card value={cards[12][0]} suit={cards[12][1]} faceUp={true} onClick={emptyFunction} className="back-of-card group13" />: <img src={image} className="back-of-card group13" onClick={(onCard13Flip)}></img>}
            { cards[13] ? <Card value={cards[13][0]} suit={cards[13][1]} faceUp={true} onClick={emptyFunction} className="back-of-card group14" />: <img src={image} className="back-of-card group14" onClick={(onCard14Flip)}></img>}
            { cards[14] ? <Card value={cards[14][0]} suit={cards[14][1]} faceUp={true} onClick={emptyFunction} className="back-of-card group15" />: <img src={image} className="back-of-card group15" onClick={(onCard15Flip)}></img>}

            <img src={require('../../Images/cards/7S.png')} className="back-of-card group16"></img>

            { cards[16] ? <Card value={cards[16][0]} suit={cards[16][1]} faceUp={true} onClick={emptyFunction} className="back-of-card group17" />: <img src={image} className="back-of-card group17" onClick={(onCard17Flip)}></img>}
            { cards[17] ? <Card value={cards[17][0]} suit={cards[17][1]} faceUp={true} onClick={emptyFunction} className="back-of-card group18" />: <img src={image} className="back-of-card group18" onClick={(onCard18Flip)}></img>}
            { cards[18] ? <Card value={cards[18][0]} suit={cards[18][1]} faceUp={true} onClick={emptyFunction} className="back-of-card group19" />: <img src={image} className="back-of-card group19" onClick={(onCard19Flip)}></img>}
            { cards[19] ? <Card value={cards[19][0]} suit={cards[19][1]} faceUp={true} onClick={emptyFunction} className="back-of-card group20" />: <img src={image} className="back-of-card group20" onClick={(onCard20Flip)}></img>}
        </div>
    </div>
    </>
  );
};

export default AroundTheWorld;