/*
 * Create a list that holds all of your cards
 */
let card = $(".card");
let openCardNum = 0;
let isMatch = false;
let openCards = [];

const listOfCards = document.querySelectorAll(".card");
//Returns a NodeList, not an array - need to loop across the list and push to an array.
let cards = [];
for (let i = 0; i < listOfCards.length; i++) {
  cards.push(listOfCards[i]);
}

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

  return array;
}

card.on("click", function() {
  if (openCardNum < 2) {
    let thisCard = $(this);
    openCardNum++;
    thisCard.addClass("show open");
    openCards.push(thisCard);
  }

  if (openCardNum == 2) {
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
});

function flipBack() {
  openCards.forEach(flip => {
    setTimeout(function() {
      flip.removeClass("open");
      flip.addClass("incorrect");
    }, 750);
    setTimeout(function() {
      flip.removeClass("show incorrect");
    }, 1500);
  });
}

function handleMatch() {
  openCards.forEach(flip => {
    setTimeout(function() {
      flip.addClass("match");
    }, 750);
  });
}

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
