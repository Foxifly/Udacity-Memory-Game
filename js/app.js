let moves = 0;
let starCount = 5;
let secondsElapsed = 0;
let seconds = 0;
let timeInterval = 0;
let minutes = 0;
let openCards = [];
let cardFaces = [
  "fa-money-bill-wave",
  "fa-money-bill-wave",
  "fa-sun",
  "fa-sun",
  "fa-rocket",
  "fa-rocket",
  "fa-gem",
  "fa-gem",
  "fa-dice",
  "fa-dice",
  "fa-trophy",
  "fa-trophy",
  "fa-bell",
  "fa-bell",
  "fa-dollar-sign",
  "fa-dollar-sign",
  "fa-crown",
  "fa-crown"
];

let multiplierOptions = [
  //index 0 - 3 = bomb | index 4 - 6 = 1 | index 7-9  = 2 | 10 = 3 | 11 = 4 \ 12 = 5 | 13 = 6
  "fa-bomb",
  "fa-bomb",
  "fa-bomb",
  "fa-bomb",
  "fa-dice-one",
  "fa-dice-one",
  "fa-dice-one",
  "fa-dice-two",
  "fa-dice-two",
  "fa-dice-two",
  "fa-dice-three",
  "fa-dice-four",
  "fa-dice-five",
  "fa-dice-six"
];
const listOfCards = document.querySelectorAll(".card");
shuffledCardFaces = [];
let emptyCards = document.querySelectorAll(".card");

function newGame() {
  setTimeout(function() {
    listOfCards.forEach(card => {
      card.className = "card";
    });
    shuffle(cardFaces);
    addCardFaces();
    moves = 0;
    handleMoves();
    openCards = [];
    startTimer();
  }, 500);
}

function addCardFaces() {
  for (let i = 0; i < emptyCards.length; i++) {
    let indexFaces = shuffledCardFaces[i];
    emptyCards[i].innerHTML = `<i class="fa ${indexFaces}"></i>`;
  }
}

//Returns a NodeList, not an array - need to loop across the list and push to an array.

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
}

document.body.onload = newGame();

let cardPrevious;
$(".restart").on("click", function() {
  clearTimer();
  newGame();
});
let multiplierValue = 0;
let multiplierIndex;

$(".multiplier").on("click", function() {
  let thisCard = $(this);
  console.log(thisCard);
  if (thisCard[0].className !== "multiplier show open") {
    resetMultiplier();
    thisCard[0].innerHTML = `<i class="fa ${
      multiplierOptions[multiplierIndex]
    }"></i>`;
    thisCard[0].className = "multiplier show open";
  }
});
function resetMultiplier() {
  console.log($(this)[0].className);
  $(this)[0].className = "multiplier";
  multiplierIndex = Math.floor(Math.random() * multiplierOptions.length);
  if (multiplierIndex >= 0 && multiplierIndex <= 3) {
    multiplierValue = 0;
  } else if (multiplierIndex >= 4 && multiplierIndex <= 6) {
    multiplierValue = 1;
  } else if (multiplierIndex >= 7 && multiplierIndex <= 9) {
    multiplierValue = 2;
  } else if (multiplierIndex == 10) {
    multiplierValue = 3;
  } else if (multiplierIndex == 11) {
    multiplierValue = 4;
  } else if (multiplierIndex == 12) {
    multiplierValue = 5;
  } else if (multiplierIndex == 13) {
    multiplierValue = 6;
  }
}

$(".card").on("click", function() {
  if (this !== cardPrevious && this.className !== "card match") {
    if (openCards.length < 2) {
      let thisCard = $(this);

      thisCard.toggleClass("show open");
      openCards.push(thisCard);
    }

    if (openCards.length == 2) {
      moves++;
      handleMoves();
      let cardOne = openCards[0][0].children[0].className;
      let cardTwo = openCards[1][0].children[0].className;
      if (cardOne === cardTwo) {
        handleMatch();
        openCards = [];
        setTimeout(function() {
          monitorCompletion();
        }, 2000);
      } else {
        flipBack();
        openCards = [];
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
    }, 1000);
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

function monitorCompletion() {
  let allCards = document.querySelectorAll(".card");
  let matchedCards = document.querySelectorAll(".card.match");
  if (allCards.length === matchedCards.length) {
    handleModal();
    stopTimer();
  }
}

function handleMoves() {
  handleRating();
  if (moves == 1) {
    document.querySelector(".moves").textContent = `${moves} Move`;
  } else {
    document.querySelector(".moves").textContent = `${moves} Moves`;
  }
}

function handleRating() {
  let stars = document.getElementsByClassName("star");
  if (moves == 16) {
    stars[4].children[0].className = "fa fa-star-o";
    starCount--;
  } else if (moves == 22) {
    stars[3].children[0].className = "fa fa-star-o";
    starCount--;
  } else if (moves == 28) {
    stars[2].children[0].className = "fa fa-star-o";
    starCount--;
  } else if (moves == 34) {
    stars[1].children[0].className = "fa fa-star-o";
    starCount--;
  }
}

function startTimer() {
  timeInterval = setInterval(updateTime, 1000);
}

function updateTime() {
  secondsElapsed++;
  seconds = Math.floor(secondsElapsed % 60);
  minutes = Math.floor(secondsElapsed / 60);
  let timer = document.getElementsByClassName("timer")[0];
  if (minutes < 10 && seconds < 10) {
    timer.textContent = `0${minutes} : 0${seconds} `;
  } else if (minutes < 10) {
    timer.textContent = `0${minutes} : ${seconds} `;
  } else if (seconds < 10) {
    timer.textContent = `${minutes} : 0${seconds} `;
  }
}

function clearTimer() {
  clearInterval(timeInterval);
  seconds = 0;
  minutes = 0;
  secondsElapsed = 0;
  let timer = document.getElementsByClassName("timer")[0];
  if (minutes < 10 && seconds < 10) {
    timer.textContent = `0${minutes} : 0${seconds} `;
  } else if (minutes < 10) {
    timer.textContent = `0${minutes} : ${seconds} `;
  } else if (seconds < 10) {
    timer.textContent = `${minutes} : 0${seconds} `;
  }
}

function stopTimer() {
  clearInterval(timeInterval);
}
function handleModal() {
  modal.innerHTML = `
  <div class="modal-content">
    <span class="close"><i class="fa fa-times"></i></span>
    <div class="modal-text">
      <h2>Congratulations</h2>
      <h3>${moves} Moves</h3>
      <h3>${starCount} Stars</h3>
      <h3>${minutes} m ${seconds} s</h3>
      <h3>Prize Value:</h3>
      <h3>Score Multiplier:</h3>
      <h2>TOTAL:</h2>
      </div>

    </div>`;
  let close = document.getElementsByClassName("close")[0];
  modal.style.display = "flex";
  close.onclick = function() {
    modal.style.display = "none";
  };
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
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
