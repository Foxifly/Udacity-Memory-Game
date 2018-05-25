document.body.onload = newGame();

function newGame() {
	setTimeout(function () {
		listOfCards.forEach(card => {
			card.className = "card";
		});
		shuffle(cardFaces);
		addCardFaces();
		moveCount = 0;
		handleMoves();
		openCards = [];
		startTimer();
	}, 500);
}

$(".restart").on("click", function () {
	resetMultiplier();
	clearTimer();
	newGame();
});

/**
* C A R D  F A C E S

*@description Flip, click, and completion handlers for each card and its match.
*/
const listOfCards = document.querySelectorAll(".card");

let emptyCards = document.querySelectorAll(".card");
shuffledCardFaces = [];

let cardFaces = [
  "fa-money-bill-wave", "fa-money-bill-wave", "fa-sun", "fa-sun", "fa-rocket", "fa-rocket", "fa-gem", "fa-gem", "fa-dice", "fa-dice", "fa-trophy", "fa-trophy", "fa-bell", "fa-bell", "fa-dollar-sign", "fa-dollar-sign", "fa-crown", "fa-crown"
];

function addCardFaces() {
	for (let i = 0; i < emptyCards.length; i++) {
		let indexFaces = shuffledCardFaces[i];
		emptyCards[i].innerHTML = `<i class="fa ${indexFaces}"></i>`;
	}
}

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


/**
* C A R D S

*@description Flip, click, and completion handlers for each card and its match.
*/
let openCards = [];
let cardPrevious;
$(".card").on("click", function () {
	if (this !== cardPrevious && this.className !== "card match") {
		if (openCards.length < 2) {
			let thisCard = $(this);

			thisCard.toggleClass("show open");
			openCards.push(thisCard);
		}

		if (openCards.length == 2) {
			moveCount++;
			handleMoves();
			let cardOne = openCards[0][0].children[0].className;
			let cardTwo = openCards[1][0].children[0].className;
			if (cardOne === cardTwo) {
				handleMatch();
				openCards = [];
				setTimeout(function () {
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
		setTimeout(function () {
			flip.toggleClass("open");
			flip.toggleClass("incorrect");
		}, 500);
		setTimeout(function () {
			flip.toggleClass("show incorrect");
		}, 1000);
	});
}

function handleMatch() {
	openCards.forEach(flip => {
		setTimeout(function () {
			flip.toggleClass("open show");
			flip.toggleClass("match");
		}, 500);
	});
}

function monitorCompletion() {
	let allCards = document.querySelectorAll(".card");
	let matchedCards = document.querySelectorAll(".card.match");
	if (allCards.length === matchedCards.length) {
		totalScore = 45000;
		handleFinalScore();
		handleModal();
		stopTimer();
	}
}
/**
* M U L T I P L I E R

*@description On the clicking of the multiplier, a multiplier value is assigned and this multiplier is used to calculate the final score. If not clicked, it doesn't play a role. Multiplier seperate from other cards.
*/
let multiplierOptions = [
  "fa-bomb", "fa-bomb", "fa-bomb", "fa-bomb", "fa-dice-one", "fa-dice-one", "fa-dice-one", "fa-dice-two", "fa-dice-two", "fa-dice-two", "fa-dice-three", "fa-dice-four", "fa-dice-five", "fa-dice-six"
];
let multiplierValue = 0;
let multiplierIndex;
let multiplierIsClicked = false;

$(".multiplier").on("click", function () {
	let thisCard = $(this);
	console.log(thisCard);
	if (thisCard[0].className !== "multiplier show open") {
		resetMultiplier();
		thisCard[0].innerHTML = `<i class="fa ${
      multiplierOptions[multiplierIndex]
    }"></i>`;
		thisCard[0].className = "multiplier show open";
		multiplierIsClicked = true;
	}
});

function resetMultiplier() {
	document.getElementsByClassName("multiplier")[0].className = "multiplier";
	multiplierIndex = Math.floor(Math.random() * multiplierOptions.length);
	multiplierIndex >= 0 && multiplierIndex <= 3 ?
		(multiplierValue = 0) : multiplierIndex >= 4 && multiplierIndex <= 6 ?
		(multiplierValue = 1) : multiplierIndex >= 7 && multiplierIndex <= 9 ?
		(multiplierValue = 2) : multiplierIndex === 10 ?
		(multiplierValue = 3) : multiplierIndex === 11 ?
		(multiplierValue = 4) : multiplierIndex === 12 ?
		(multiplierValue = 5) : multiplierIndex == 13 ?
		(multiplierValue = 6) : (multiplierValue = 0);
    multiplierValue == 0 ? handleBombModal() : multiplierValue;

}


/**
* R A T I N G -&- M O V E S

*@description handler for the move counter and for the rating assignment.
*/
let star = {
  count: 5,
  bonus: false,
  bonusAmount: 0,
  string: ""
};

let time = {
  seconds: 0,
  minutes: 0,
  secondsElapsed: 0,
  interval: 0,
  bonus: false,
  bonusAmount: 0,
  string: ""
}

let moveCount = 0;

function handleMoves() {
	handleRating();
	if (moveCount == 1) {
		document.querySelector(".moves").textContent = `${moveCount} Move`;
	} else {
		document.querySelector(".moves").textContent = `${moveCount} Moves`;
	}
}

function handleRating() {
	let stars = document.getElementsByClassName("star");
	if (moveCount == 16) {
		stars[4].children[0].className = "fa fa-star-o";
		star.count--;
	} else if (moveCount == 22) {
		stars[3].children[0].className = "fa fa-star-o";
		star.count--;
	} else if (moveCount == 28) {
		stars[2].children[0].className = "fa fa-star-o";
		star.count--;
	} else if (moveCount == 34) {
		stars[1].children[0].className = "fa fa-star-o";
		star.count--;
	}

}

/**
* T I M E R

*@description This timer was built using setInterval. The timer is started in the newGame function, and is cleared if a game is restarted. The time is updated every second.
*/
let secondsElapsed = 0;
let seconds = 0;
let timeInterval = 0;
let minutes = 0;

function startTimer() {
	time.interval = setInterval(updateTime, 1000);
}

function updateTime() {
	time.secondsElapsed++;
	time.seconds = Math.floor(time.secondsElapsed % 60);
	time.minutes = Math.floor(time.secondsElapsed / 60);
	let timer = document.getElementsByClassName("timer")[0];
	if (time.minutes < 10 && time.seconds < 10) {
		timer.textContent = `0${time.minutes} : 0${time.seconds} `;
	} else if (time.minutes < 10) {
		timer.textContent = `0${time.minutes} : ${time.seconds} `;
	} else if (time.secomds < 10) {
		timer.textContent = `${minutes} : 0${seconds} `;
	}
}

function clearTimer() {
	clearInterval(time.interval);
	time.seconds = 0;
	time.minutes = 0;
	time.secondsElapsed = 0;
	let timer = document.getElementsByClassName("timer")[0];
	if (time.minutes < 10 && time.seconds < 10) {
		timer.textContent = `0${time.minutes} : 0${time.seconds} `;
	} else if (time.minutes < 10) {
		timer.textContent = `0${time.minutes} : ${time.seconds} `;
	} else if (time.seconds < 10) {
		timer.textContent = `${time.minues} : 0${time.seconds} `;
	}
}

function stopTimer() {
	clearInterval(time.interval);
}

/**
* M O D A L

*@description When the game is complete, a modal will pop up congratulating the user and giving the final score value along with the break down of each item (move count, stars, time, etc)
*/
function handleModal() {

  let addHTML = "";
  for (let i = 0; i < star.count; i++) {
    addHTML +=  '<li class="star"><i class="fa fa-star"></i></li> '
  }
  star.bonus === true ? star.string = "Bonus" : star.string  = "Penalty";
  time.bonus === true ? time.string = "Bonus" : time.string  = "Penalty";
	modal.innerHTML = `
  <div class="modal-content">
    <span class="close"><i class="fa fa-times"></i></span>
    <div class="modal-text">
      <h2>Congratulations</h2>
      <ul class="star-display">${addHTML} <br> ${moveCount} Moves <br> ${document.getElementsByClassName("timer")[0].textContent}</ul>
      <h4>Prize Value: $45,000</h4>
      <h4>Star ${star.string}: $45,000</h4>
      <h4>Time ${time.string}: $45,000</h4>

      <h4>Score Multiplier: ${multiplierValue} X</h4>
      <h2>TOTAL: ${totalScore}</h2>
      </div>

    </div>`;
	let close = document.getElementsByClassName("close")[0];
	modal.style.display = "flex";
	close.onclick = function () {
		modal.style.display = "none";
	};
	window.onclick = function (event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	};
}

function handleBombModal() {
modal.style.display = "flex";
	modal.innerHTML = `
  <div class="modal-content">
    <span class="close"><i class="fa fa-times"></i></span>
    <div class="modal-text">
      <h2 class="lose">YOU LOSE!</h2>
      <h3>Instead of a multiplier, you've uncovered a bomb!<br>Please try again!</h3>
      <p class="bomb-modal"><i class="fa fa-skull"></i> <i class="fa fa-bomb"></i> <i class="fa fa-skull"></i></p>
    </div>
    <button class="try-again">Try Again</button>
    `;

    let tryAgain = document.getElementsByClassName("try-again")[0];
    tryAgain.onclick = function () {
      modal.style.display = "none";
      resetMultiplier();
      clearTimer();
      newGame();




	};
}
/**
* S C O R I N G

*@description Three functions that are used to calculate the total user score. This score will translate to the amount of 'money' gained from the lottery. It takes into account the move count, minute count, and the multiplier at the bottom of the board.If the multiplier isn't clicked, it will just calculate the score based on the move score and time score.
*/
let totalScore = 0;

function moveScore() {
	if (star.count === 5 && moveCount === 9) {
		totalScore += 12500;

	} else {
		star.count === 5 ?
			(totalScore += 2500) :
			star.count === 3 ?
			(totalScore -= 2500) :
			star.count === 2 ?
			(totalScore -= 7500) :
			star.count === 1 ? (totalScore -= 12500) : (totalScore += 0);
	}
  star.count >= 4 ? star.bonus = true : star.bonus = false;
}

function timeScore() {
	time.secondsElapsed <= 60 ?
		(totalScore += 5000) :
		time.minutes <= 120 ?
		(totalScore += 2500) :
		time.minutes <= 180 ?
		(totalScore += 0) :
		time.minutes <= 240 ? (totalScore -= 2500) : (totalScore -= 5000);
  time.minutes <= 180 ? time.bonus = true : time.bonus = false;
}

function handleFinalScore() {
	moveScore();
	timeScore();
	if (multiplierIsClicked === true) {
		totalScore *= multiplierValue;
	}
}

//NEED TO FIX STAR COUNT ON RESET GAME
