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
  }, [])

  // console.log(shuffledDeck);

const Scoreboard = ({ score = 0 }) => {
  console.log('Score:' + score)
    return (
      <h2>Score: {score} points
      </h2>
    )
  }

  
  const CurrentCard = () => {
    let placeInDeck = 0
    const revealedCard = shuffledDeck[placeInDeck] || ''

    // console.log(revealedCard);
    return (
      <div>
        This is the current card. 
        <p style={{ border: 'solid purple 2px', height: '100px', width: '100px', textAlign: 'center'}}>
          {revealedCard.value} of {revealedCard.suit}
        </p>
        Will the next card be higher or lower?
        
      </div>
    )
  }
  
  const HigherButton = () => {
    return (
      <button>Higher</button>
    )
  }
  
  const LowerButton = () => {
    return (
      <button>Lower</button>
    )
  }
  
  const DoubleButton = () => {
    return (
      <button>Double or Nothing</button>
    )
  }
  
  
  
  return (
    <div>
      <h1>High-Low Game</h1>
      <Scoreboard />
      <CurrentCard />
      <HigherButton />
      <LowerButton />
      <DoubleButton />

    </div>
  );
}

export default App;
