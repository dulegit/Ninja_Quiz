"use strict";

var quiz = {
	"name" : "Super Hero Name Quiz",
	"description" : "How many super heroes can you name?",
	"question" : "What is the real name of ",
	"questions" : [
		{"question" : "Superman", "answer" : "Clark Kent", "asked": false},
		{"question" : "Batman", "answer" : "Bruce Wayne", "asked": false},
		{"question" : "Wonder Woman", "answer" : "Dianna Prince", "asked": false},
		{"question": "Black Panther", "answer": "T'Challa", "asked": false},
		{"question" : "Spider-Man", "answer" : "Peter Parker", "asked": false},
		{"question": "Catwoman", "answer": "Selina Kyle", "asked": false},
		{"question": "The Hulk", "answer": "Bruce Banner", "asked": false},
		{"question": "Iron Man", "answer": "Tony Stark", "asked": false},
		{"question": "Two Face", "answer": "Harvey Dent", "asked": false},
		{"question": "The Riddler", "answer": "Edward Nigma", "asked": false}
	]
}	

//// dom references ////
var $question = document.getElementById("question");
var $score = document.getElementById("score");
var $feedback = document.getElementById("feedback");
var $start = document.getElementById("start");
var $form = document.getElementById("answer");
var $timer = document.getElementById("timer");

//// function definitions /////
function random(a,b,callback){
	if (b === undefined) {
		// if only one argument is suplied, assume the lower limit is 1
		b = a, a = 1;
	}
	var result = Math.floor((b-a+1) * Math.random()) + a;
	if (typeof callback === "function") {
		result = callback(result);
	}
	return result;
}
// when you answer on question, 'asked' got a property 'true'. This function return 'asked' to be false
function askedToFalse(){
	for (var i = 0; i < quiz.questions.length; i++) {
		quiz.questions[i].asked = false;
	}
}
// view functions
function update(element, content, klass) {
	var p = element.firstChild || document.createElement("p");
	p.textContent = content;
	element.appendChild(p);
	if (klass) {
		p.className = klass;
	}
}
// hide element
function hide(element) {
	element.style.display = "none";
}
// show element
function show(element) {
	element.style.display = "block";
}

// Event Listeners
$start.addEventListener('click', function(){play(quiz);}, false);

// hide the form at the start of the game
hide($form);

// PLAY FUNCTION
function play(quiz) {

	// hide button and show form
	hide($start);
	hide($feedback);
	hide($question);
	show($form);
	show($timer);

	//initialize score
	var score = 0;
	update($score, score);

	// define question variable and call func
	var question = null;
	chooseQuestion();

	//initialize timer and set up an interval that counts down
	var time = 30;
	update($timer, time);

	var interval = window.setInterval(countDown, 1000);
	$form.addEventListener("click", btnClicked);

	function btnClicked(event) {
		event.preventDefault();
		check(event.target.value);
	}

	function check(answer) {
		
		console.log("check() invoked");
		if(answer === question.answer) { // quiz[i][1] is the answer
			update($feedback, "Correct!", "right");
			show($feedback);
			score++;
			update($score, score);
		} else {
			update($feedback, "Wrong!", "wrong");
			show($feedback);
		}
		$form.innerHTML = "";
		chooseQuestion();
	}

	function chooseQuestion(){
		
		console.log("chooseQuestion() called");
		var questions = quiz.questions.filter(function(question){
			return question.asked === false;
		});
		// set the current question
		question = questions[random(questions.length) - 1];
		console.log('questions left: ', questions.length);
		if(questions.length < 1){
			console.log("number of unanswered questions is less than 1");
			gameOver();	
		} else {
			ask(question);
		}	
	}

	function ask(question) {
		console.log("ask() invoked");
		// set the question.asked property to true so it's not asked again
		question.asked = true;
		update($form, quiz.question + question.question + "?");
		// create an array to put the different options in and a button variable
		var options = [], button;
		var option1 = chooseOption();
		options.push(option1.answer);
		var option2 = chooseOption();
		options.push(option2.answer);
		// add the actual answer at a random place in the options array
		options.splice(random(0,2), 0, question.answer);
		// loop through each option and display it as a button
		options.forEach(function(name){
			button = document.createElement("button");
			button.value = name;
			button.textContent = name;
			$form.appendChild(button);

		});
		// choose an option from all the posible answers but without choosing the same option twice
		function chooseOption(){
			var option = quiz.questions[random(quiz.questions.length) - 1];
			// check to see if the option chosen is the current question or already one of the options, if it is then recursively call this function until it isn’ t
			if (option === question || options.indexOf(option.answer) !== -1) {
				return chooseOption();
			}
			return option;
		}
	}

	// this is called every second and decreases the time
	function countDown(){
		time --;
		update($timer, time);

		if (time <= 0){
			hide($timer);
			gameOver();
		}
	}

	function gameOver(){
		console.log("gameOver() invoked");
		// inform the player that the game has finished and tell them how many points they have scored
		update($question, "Game Over, you scored " + score + " points");
		// stop the countdown interval
		window.clearInterval(interval);
		askedToFalse();
		hide($form);
		hide($feedback);
		show($question);
		show($start);
		$form.innerHTML = "";
		$form.removeEventListener("click", btnClicked);
	}
}
// END OF PLAY FUNCTION