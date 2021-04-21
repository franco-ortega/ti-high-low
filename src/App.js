import React, { useEffect, useState } from 'react';
import './App.css';
import cardDeck from './cardDeck.json'

//SCOPE
// Items: 1) a deck of cards, 2) button to reveal next card, 3) score board that starts at 0, 4) message that displays when the game is over, 5) button that resets game, 6) buttons to guess whether the next card is higher or lower, 7) area to display the currently revealed card, 8) name of game
// Start: User sees 1) one face up card, 2) a deck with 51 other cards, 3) pair of buttons that say HIGHER and LOWER, 4) scoreboard that displays 0 points, 5) name of game, 6) button to reset game
// Flow: User clicks HIGHER or LOWER button, and the next card is revealed. If the user guessed correctly, they gain 1 point. If the user guessed incorrectly, their score remains the same. The game continues until the cards run out. When the game is over, a message diplays the FINAL SCORE.
// The second half of this instruction feels unclear: "If the next card revealed is correctly guessed, you win 1 point, but can double or nothing with the next card." I'm going to assume it meant to say this: "If the next card revealed is correctly guessed, you win 1 point, OR YOU can BET double or nothing with the next card." Which I think means you can bet all your points, and if you guess correctly, your points are doubled, but if you guess wrong, you lose all your points and reset to 0.
// Additional Items: 9) DOUBLE or NOTHING button. (radio button?)

//ROADMAP
//
// -ends & Services
// Frontend only; using React
//
// Objects
// card
// card deck: (A, 2, 3, 4, 5, 6, 7, 8, 9, J, Q, K) x 4: spade, club, heart, ???
// HIGHER button
// LOWER button
// REVEAL NEXT CARD button
// DOUBLE OR NOTHING button
// Scoreboard: 0 pts (to start new game)
//
// Functions
// shuffleCards
// revealCard
// compareCardToGuess
// adjustScore (+1 pt if correct, else nothing) or (double score if correct, else reset score to 0)
// incrementScore (add +1 point to current score)
// doubleOrNothing (double score if correct, else reset score to 0)
// resetGame (reset score to 0; reshuffle cards in deck)


function App() {
  const [shuffledDeck, setShuffledDeck] = useState([]);
  const [placeInDeck, setPlaceInDeck] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [doubleOrNothing, setDoubleOrNothing] = useState(false);
  const [canReshuffle, setCanReshuffle] = useState(false);
  const [shuffleItAgain, setShuffleItAgain] = useState(false);
  const [wasReshuffled, setWasReshuffled] = useState(false);

  // const [cardInView, setCardInView] = useState({});
  const [highOrLow, setHighOrLow] = useState('');

  
  useEffect((score) => {
    const currentDeck = []

    const shufffleCards = () => {
      for(let i = 0; i < 52; i++) {
        const card = cardDeck[(Math.floor(Math.random() * 52))];
        if(!currentDeck.includes(card)) {
          currentDeck.push(card);
        } else {
          i--;
        };
      };
    };

    if(score >= 50) {
      setCanReshuffle(true); 
    };

  
    shufffleCards();
    setShuffledDeck(currentDeck);
    setScore(score => score)
  }, [shuffleItAgain, canReshuffle]);


  // SCOREBOARD COMPONENT
  const Scoreboard = () => {
    return (
      <h2>Score: {score} points
      </h2>
    );
  };
  
  // CURRENT CARD COMPONENT
  const CurrentCard = () => {
    const revealedCard = shuffledDeck[placeInDeck] || '';

    if(placeInDeck > 51) 
    return (
      <div>You have revealed all the cards.
      <p style={{ backgroundColor: 'lightyellow', border: 'solid purple 2px', height: '100px', width: '100px', padding: '30px 10px', textAlign: 'center'}}></p>
        Play again anytime.
        </div>
      );

    return (
      <div>
        This is the current card. 
        <p style={{ backgroundColor: 'lightyellow', border: 'solid purple 2px', height: '100px', width: '100px', padding: '30px 10px', textAlign: 'center'}}>
          {revealedCard.value} of {revealedCard.suit}
        </p>
        Will the next card be higher or lower?
        <h4>Cards Remaining: {51 - placeInDeck}</h4>
      </div>
    );
  };
  
  const nextCard = () => {
      setPlaceInDeck(placeInDeck + 1);
  };

  const incrementScore = () => {
    setScore(score + 1);
  };


  const chooseDouble = () => {
    setDoubleOrNothing(!doubleOrNothing)
  };

  // DOUBLE BUTTON COMPONENT
  const DoubleButton = () => {
    return (
      <>
        <button onClick={chooseDouble}>Double or Nothing</button>
        <h4 style={{ color: 'red' }}>
          {doubleOrNothing ? 'You have selected Double or Nothing. Click it again to undo.' : 'Click Double or Nothing to take a chance.'}
        </h4>
      </>
    );
  };

  // FIX RESHUFFLE
  // reset placeInDeck back to 0 when deck is reshuffled --DONE
  // don't allow reshuffle if score drops below 50 points --DONE
  // have Reshuffle button appear as soon as score reaches 50 points or more
  // don't change the current card until after the Higher/Lower button is clicked

  const reshuffle = () => {
    setShuffleItAgain(true);
    setWasReshuffled(true);
    setScore(score - 50);
    setPlaceInDeck(0);
  };

  // RESHUFFLE DECK COMPONENT
  const ReshuffleDeck = () => {
    if(canReshuffle && !wasReshuffled)
     return (
      <button onClick={reshuffle}>
        Reshuffle Deck for 50 points
      </button>
    );

    if(canReshuffle && wasReshuffled)
    return (
      <div>You have used your reshuffle for this game.</div>
    )

    return (
      <div>
        If you have at least 50 points, you can spend 50 points to reshuffle the deck once per game.
      </div>
    );

  };



  const chooseHigherOrLower = (e) => {
    console.log(e.target.value)
    setHighOrLow(e.target.value)
  };

  const correctGuess = () => {
    if(doubleOrNothing) {
      setScore(score * 2);
    } else {
      incrementScore();
    };
  };

  const revealCard = (e) => {
    e.preventDefault()
    console.log('reveal button clicked')

    if(highOrLow === 'HIGH') {
      if(placeInDeck < 51) {
        if(Number(shuffledDeck[placeInDeck].height) < Number(shuffledDeck[placeInDeck + 1].height)) {
          correctGuess();
        } else {
          if(doubleOrNothing) {
            setScore(0);
          };
        };
      };
    };
    
    if(highOrLow === 'LOW') {
      if(placeInDeck < 51) {
        if(Number(shuffledDeck[placeInDeck].height) > Number(shuffledDeck[placeInDeck + 1].height)) {
          correctGuess();
        } else {
          if(doubleOrNothing) {
            setScore(0);
          };
        };
      };  
    };

    nextCard();
    setDoubleOrNothing(false);

    if(score >= 50) {
      setCanReshuffle(true); 
    };

    if(score < 50) {
      setCanReshuffle(false);
    };

    if(placeInDeck + 1 === 51) {
      setGameOver(true);
    };

  };
  

  // GAME STATUS COMPONENT
   const GameStatus = () => {
    return (
      <h3>
        {gameOver ? `Game Over! Final score is ${score}` : 'Keep going!'}
      </h3>
    );
  };
  
  
  console.log(shuffledDeck);
  console.log(canReshuffle);
  // console.log(cardInView);
  console.log(highOrLow);
  
  return (
    <div>
      <h1>High-Low Game</h1>
      <Scoreboard />
      <CurrentCard />
      <DoubleButton />
      <form onChange={chooseHigherOrLower}>
        <label>Higher
          <input type="radio" name="direction" value="HIGH" />
        </label>
        <label>Lower
          <input type="radio" name="direction" value="LOW" />
          </label>
        <button onClick={revealCard}>Reveal Card</button>
      </form>
      <ReshuffleDeck />
      <GameStatus />
    </div>
  );
}

export default App;
