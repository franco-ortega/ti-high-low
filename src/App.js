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
  const [shuffleItAgain, setShuffleItAgain] = useState(false);
  const [wasReshuffled, setWasReshuffled] = useState(false);
  const [highOrLow, setHighOrLow] = useState('');
  const [startGame, setStartGame] = useState(false);
  const [lastCardBeforeReshuffle, setLastCardBeforeReshuffle] = useState({});

  const cardStyle = { backgroundColor: 'lightyellow', border: 'solid purple 2px', height: '100px', width: '100px', padding: '10px 10px', textAlign: 'center'}

  useEffect(() => {
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
  
    shufffleCards();
    setShuffledDeck(currentDeck);
    setScore(score => score)
  }, [shuffleItAgain]);


  // SCOREBOARD COMPONENT
  const Scoreboard = () => {
    return (
      <h2>Score: {score} points
      </h2>
    );
  };

  // CURRENT CARD COMPONENT
  const CurrentCard = () => {
    let revealedCard = shuffledDeck[placeInDeck] || {};
    let previousCard = shuffledDeck[placeInDeck - 1] || false;

    if(lastCardBeforeReshuffle.value !== undefined) {
       revealedCard = lastCardBeforeReshuffle;
    }

    if(placeInDeck > 51) 
    return (
      <div>You have revealed all the cards.
      <p style={cardStyle}></p>
        Play again anytime.
        </div>
      );

    return (
      <div style={{ display: 'flex' }}>
        <div>
        <p>Card Deck</p>
        <p style={cardStyle}>
          Cards Remaining: {startGame ? 51 - placeInDeck : '52'}
        </p>
        </div>
        <div>
        <p>Current card:</p>
        <p style={cardStyle}>
          {startGame ? `${revealedCard.value} of ${revealedCard.suit}s` : ''}
        </p>
        </div>
        <div>
        <p>Previous card:</p>
        <p style={cardStyle}>
          {previousCard ? `${previousCard.value} of ${previousCard.suit}s` : ''}
        </p>
        </div>
      </div>
    );
  };
  
  const nextCard = () => {
    if(lastCardBeforeReshuffle.value === undefined && startGame) {
      setPlaceInDeck(placeInDeck + 1)
    }
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
  // have Reshuffle button appear as soon as score reaches 50 points or more --DONE
  // don't change the current card until after the Higher/Lower button is clicked --DONE
  //
  // NEW RESHUFFLE ISSUES
  // Cards Remaining resets to 51 instead of 52
  // the first click of Reveal Card button does not change score when correct --DONE

  const reshuffle = () => {
    setLastCardBeforeReshuffle(shuffledDeck[placeInDeck])
    setShuffleItAgain(true);
    setWasReshuffled(true);
    setScore(score - 50);
    setPlaceInDeck(0);
  };

  // RESHUFFLE DECK COMPONENT
  const ReshuffleDeck = () => {
    let canReshuffle = false;
    let noMoreShuffles = false;

    if(score >= 50) {
      canReshuffle = true;
    };

    if(wasReshuffled) {
      noMoreShuffles = true;
    }

    if(canReshuffle && !noMoreShuffles)
     return (
      <button onClick={reshuffle}>
        Reshuffle Deck for 50 points
      </button>
    );

    if(noMoreShuffles)
    return (
      <div>You have used your reshuffle for this game.</div>
    );

    return (
      <div>
        If you have at least 50 points, you can spend 50 points to reshuffle the deck once per game.
      </div>
    );
  };



  const chooseHigherOrLower = (e) => {
    setHighOrLow(e.target.value)
  };

  const correctGuess = () => {
    if(doubleOrNothing) setScore(score * 2);
    else incrementScore();
  };

  const incorrectGuess = () => {
    if(doubleOrNothing) setScore(0);
  };




  // REVEAL CARD EVENT HANDLER
  const revealCard = (e) => {
    e.preventDefault()

    if(!startGame) setStartGame(true);

    if(lastCardBeforeReshuffle) {
      setLastCardBeforeReshuffle('')
    }

    const cardInPlay = lastCardBeforeReshuffle.height || Number(shuffledDeck[placeInDeck].height);
    const cardOnDeck = Number(shuffledDeck[placeInDeck + 1].height); 

    if(highOrLow === 'HIGH') {
      if(placeInDeck < 51) {
        if(cardInPlay < cardOnDeck) correctGuess();
        else incorrectGuess();
      };
    };
    
    if(highOrLow === 'LOW') {
      if(placeInDeck < 51) {
        if(cardInPlay > cardOnDeck) correctGuess();
        else incorrectGuess();
      };
    };

    nextCard();
    setDoubleOrNothing(false);

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

  return (
    <div>
      <h1>High-Low Game</h1>
      <Scoreboard />
      <CurrentCard />
      <DoubleButton />
      <form onChange={chooseHigherOrLower}>
      Will the next card be higher or lower?
        <label>Higher
          <input type="radio" name="direction" value="HIGH" disabled={!startGame}/>
        </label>
        <label>Lower
          <input type="radio" name="direction" value="LOW" disabled={!startGame} />
          </label>
        <button onClick={revealCard} disabled={gameOver}>Reveal Card</button>
      </form>
      <ReshuffleDeck />
      <GameStatus />
    </div>
  );
}

export default App;
