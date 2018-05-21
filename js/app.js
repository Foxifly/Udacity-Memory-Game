/*
 * Create a list that holds all of your cards
 */
let card = $(".card");
let moves = 0;
let openCardNum = 0;
let isMatch = false;
let openCards = [];
let cards = [];
let cardFaces = [
  "fa-diamond",
  "fa-diamond",
  "fa-paper-plane-o",
  "fa-paper-plane-o",
  "fa-anchor",
  "fa-anchor",
  "fa-bolt",
  "fa-bolt",
  "fa-cube",
  "fa-cube",
  "fa-leaf",
  "fa-leaf",
  "fa-bicycle",
  "fa-bicycle",
  "fa-bomb",
  "fa-bomb"
];
shuffledCardFaces = [];
let emptyCards = document.querySelectorAll(".card i");

function newGame() {
  shuffle(cardFaces);
  addCardFaces();
  moves = 0;
}

function addCardFaces() {
  //for each item in the empty card array, I want to add a class name based on the other array.
  for (let i = 0; i < emptyCards.length; i++) {
    let indexFaces = shuffledCardFaces[i];
    emptyCards[i].className = `fa ${indexFaces}`;
  }
}

const listOfCards = document.querySelectorAll(".card");
//Returns a NodeList, not an array - need to loop across the list and push to an array.

// for (let i = 0; i < listOfCards.length; i++) {
//   cards.push(listOfCards[i]);
// }

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  shuffledCardFaces = array;
  console.log(shuffledCardFaces);
}

document.body.onload = newGame();
//

//
let cardPrevious;

card.on("click", function() {
  console.log(this.className);
  if (this !== cardPrevious && this.className !== "card match") {
    if (openCardNum < 2) {
      let thisCard = $(this);
      openCardNum++;
      thisCard.toggleClass("show open");
      openCards.push(thisCard);
    }

    if (openCardNum == 2) {
      moves++;
      handleMoves();
      let cardOne = openCards[0][0].children[0].className;
      let cardTwo = openCards[1][0].children[0].className;
      if (cardOne === cardTwo) {
        handleMatch();
        openCards = [];
        openCardNum = 0;
      } else {
        flipBack();
        openCards = [];
        openCardNum = 0;
      }
    }
  }
  cardPrevious = this;
});

function flipBack() {
  openCards.forEach(flip => {
    setTimeout(function() {
      flip.toggleClass("open");
      flip.toggleClass("incorrect");
    }, 500);
    setTimeout(function() {
      flip.toggleClass("show incorrect");
    }, 1500);
  });
}

function handleMatch() {
  openCards.forEach(flip => {
    setTimeout(function() {
      flip.toggleClass("open show");
      flip.toggleClass("match");
    }, 500);
  });
}

function handleMoves() {
  if (moves == 1) {
    document.querySelector(".moves").textContent = `${moves} Move`;
  } else {
    document.querySelector(".moves").textContent = `${moves} Moves`;
  }
}

function completionCheck() {}
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
