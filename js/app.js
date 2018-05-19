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
    console.log(openCards);
  }
  if (openCardNum == 2 && isMatch == false) {
    for (let i = 0; i < openCards.length; i++) {
      setTimeout(function() {
        openCards[i].removeClass("show open");
        console.log("dun");
      }, 1000);
    }
  }
});
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
