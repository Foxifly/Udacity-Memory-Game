document.body.onload = newGame();
function newGame() {
	setTimeout(function () {
		cards.list.forEach(card => {
			card.className = "card";
		});
		cards.shuffle(cards.faces);
		cards.addFaces();
		move.count = 0;
		move.handleMoves();
		cards.open = [];
		time.start();
    star.reset();
	}, 500);
}

$(".restart").on("click", function () {
	multiplier.reset();
	time.clear();
	newGame();
});

/**
* C A R D S

*@description Flip, click, and completion handlers for each card and its match.
*/
// Shuffle function from http://stackoverflow.com/a/2450976

let cards = {
	list: document.querySelectorAll(".card"),
	open: [],
	faces: [
    "fa-money-bill-wave", "fa-money-bill-wave", "fa-sun", "fa-sun", "fa-rocket", "fa-rocket", "fa-gem", "fa-gem", "fa-dice", "fa-dice", "fa-trophy", "fa-trophy", "fa-bell", "fa-bell", "fa-dollar-sign", "fa-dollar-sign", "fa-crown", "fa-crown"
  ],
	shuffledFaces: [],
	previous: null,
	flipBack() {
		cards.open.forEach(flip => {
			setTimeout(function () {
				flip.toggleClass("open");
				flip.toggleClass("incorrect");
			}, 500);
			setTimeout(function () {
				flip.toggleClass("show incorrect");
			}, 1000);
		});
	},
	addFaces() {
		for (let i = 0; i < cards.list.length; i++) {
			let indexFaces = cards.shuffledFaces[i];
			cards.list[i].innerHTML = `<i class="fa ${indexFaces}"></i>`;
		}
	},
	handleMatch() {
		cards.open.forEach(flip => {
			setTimeout(function () {
				flip.toggleClass("open show");
				flip.toggleClass("match");
			}, 500);
		});
	},
  shuffle(array) {
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
  	cards.shuffledFaces = array;
  }
}

$(".card").on("click", function () {
	if (this !== cards.previous && this.className !== "card match") {
		if (cards.open.length < 2) {
			let thisCard = $(this);

			thisCard.toggleClass("show open");
			cards.open.push(thisCard);
		}

		if (cards.open.length == 2) {
			move.count++;
			move.handleMoves();
			let cardOne = cards.open[0][0].children[0].className;
			let cardTwo = cards.open[1][0].children[0].className;
			if (cardOne === cardTwo) {
				cards.handleMatch();
				cards.open = [];
				setTimeout(function () {
					monitorCompletion();
				}, 2000);
			} else {
				cards.flipBack();
				cards.open = [];
			}
		}
	}
	cards.previous = this;
});


function monitorCompletion() {
	let allCards = document.querySelectorAll(".card");
	let matchedCards = document.querySelectorAll(".card.match");
	if (allCards.length === matchedCards.length) {
		totalScore = 45000;
		handleFinalScore();
		handleModal();
		time.stop();
	}
}
/**
* M U L T I P L I E R

*@description On the clicking of the multiplier, a multiplier value is assigned and this multiplier is used to calculate the final score. If not clicked, it doesn't play a role. Multiplier seperate from other cards.
*/


let multiplier = {
	options: [
    "fa-bomb", "fa-bomb", "fa-bomb", "fa-bomb", "fa-dice-one", "fa-dice-one", "fa-dice-one", "fa-dice-two", "fa-dice-two", "fa-dice-two", "fa-dice-three", "fa-dice-four", "fa-dice-five", "fa-dice-six"
  ],
	value: 0,
	index: 0,
	isClicked: false,
	reset() {
		document.getElementsByClassName("multiplier")[0].className = "multiplier";
		multiplier.index = Math.floor(Math.random() * multiplier.options.length);
		multiplier.index >= 0 && multiplier.index <= 3 ?
			(multiplier.value = 0) : multiplier.index >= 4 && multiplier.index <= 6 ?
			(multiplier.value = 1) : multiplier.index >= 7 && multiplier.index <= 9 ?
			(multiplier.value = 2) : multiplier.index === 10 ?
			(multiplier.value = 3) : multiplier.index === 11 ?
			(multiplier.value = 4) : multiplier.index === 12 ?
			(multiplier.value = 5) : multiplier.index == 13 ?
			(multiplier.value = 6) : (multiplier.value = 0);
	}

}

$(".multiplier").on("click", function () {
	let thisCard = $(this);
	console.log(thisCard);
	if (thisCard[0].className !== "multiplier show open") {
		multiplier.reset();
		multiplier.value == 0 ? handleBombModal() : multiplier.value;
		thisCard[0].innerHTML = `<i class="fa ${
      multiplier.options[multiplier.index]
    }"></i>`;
		thisCard[0].className = "multiplier show open";
		multiplier.isClicked = true;
	}
});


/**
* R A T I N G -&- M O V E S

*@description handler for the move counter and for the rating assignment.
*/
let star = {
	count: 5,
	bonus: false,
	bonusAmount: 0,
	string: "",
  reset() {
    let stars = document.getElementsByClassName("star");
    star.count = 5;
    for (let i = 0; i < star.count; i++)
    stars[i].children[0].className = "fa fa-star";
  }
};


let move = {
	count: 0,
	handleRating() {
		let stars = document.getElementsByClassName("star");
		if (move.count == 16) {
			stars[4].children[0].className = "fa fa-star-o";
			star.count--;
		} else if (move.count == 22) {
			stars[3].children[0].className = "fa fa-star-o";
			star.count--;
		} else if (move.count == 28) {
			stars[2].children[0].className = "fa fa-star-o";
			star.count--;
		} else if (move.count == 34) {
			stars[1].children[0].className = "fa fa-star-o";
			star.count--;
		}
	},
	handleMoves() {
		move.handleRating();
		if (move.count == 1) {
			document.querySelector(".moves").textContent = `${move.count} Move`;
		} else {
			document.querySelector(".moves").textContent = `${move.count} Moves`;
		}
	}
}


/**
* T I M E R

*@description This timer was built using setInterval. The timer is started in the newGame function, and is cleared if a game is restarted. The time is updated every second.
*/
let time = {
	seconds: 0,
	minutes: 0,
	secondsElapsed: 0,
	interval: 0,
	bonus: false,
	bonusAmount: 0,
	string: "",
  start() {
    time.interval = setInterval(time.update, 1000);
  },
  update() {
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
  },
    clear() {
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
    },
    stop() {
      clearInterval(time.interval);
    }

}


/**
* M O D A L

*@description When the game is complete, a modal will pop up congratulating the user and giving the final score value along with the break down of each item (move count, stars, time, etc)
*/
function handleModal() {
	let addHTML = "";
	for (let i = 0; i < star.count; i++) {
		addHTML += '<li class="star"><i class="fa fa-star"></i></li> '
	}
	star.bonus === true ? star.string = "Bonus" : star.string = "Penalty";
	time.bonus === true ? time.string = "Bonus" : time.string = "Penalty";
	modal.innerHTML = `
  <div class="modal-content">
    <span class="close"><i class="fa fa-times"></i></span>
    <div class="modal-text">
      <h2>Congratulations</h2>
      <ul class="star-display">${addHTML} <br> ${move.count} Moves <br> ${document.getElementsByClassName("timer")[0].textContent}</ul>
      <h4>Prize Value: $45,000</h4>
      <h4>Star ${star.string}: $45,000</h4>
      <h4>Time ${time.string}: $45,000</h4>
      <h4>Score Multiplier: ${multiplier.value} X</h4>
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
		multiplier.reset();
		time.clear();
		newGame();
	}
}
/**
* S C O R I N G

*@description Three functions that are used to calculate the total user score. This score will translate to the amount of 'money' gained from the lottery. It takes into account the move count, minute count, and the multiplier at the bottom of the board.If the multiplier isn't clicked, it will just calculate the score based on the move score and time score.
*/
let totalScore = 0;

function moveScore() {
	if (star.count === 5 && move.count === 9) {
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
	if (multiplier.isClicked === true) {
		totalScore *= multiplier.value;
	}
}

//NEED TO FIX STAR COUNT ON RESET GAME
