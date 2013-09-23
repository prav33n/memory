/* Author : Praveen Jelish, praveenjelish@ymail.com
 * Javascript code for the memory game.
 * */


var numCards = 16;
var cards = [];
var pairs = [];
var flipped = [];
var colors = [];
var temp = [];
var pairid = 0;
var selected = 0;
var current,previous;
var pairsFound = 0;
var points = 0;
var moves = 0;
var start = 0;
var loop = 0;
var increment,timer;

function setup() {
	document.getElementById("startpopup").setAttribute("class","popupvisible");
	document.getElementById("startconfirm").focus();
}

/*
 * FUNCTION NAME : CREATEGAMEBOARD 
 * PURPOSE : SEND AJAX REQUEST TO PHP SCRIPT AND GET DATA FROM ANOTHER DOMAIN SERVER
 * THE ALTERNATE WAYS TO ENABLE CROSS DOMAIN REQUEST IS TO CHANGE 
 * 1. ADD THE PHP header("Access-Control-Allow-Origin: http://WWW.GREATERTAMIL.com/"); to server 
 * 2. Header set Access-Control-Allow-Origin: http://WWW.GREATERTAMIL.com/ To .HTACESS FILE 
 * 3. USING jsonp DATAFORMAT TO RETURN THE DATA FROM THE SERVER
 * 
 */

function createGameboard() {

	$.ajax({  //ajax request to get colours data from the php script
		type : 'GET',
		dataType : "json",
		crossDomain : true,
		async : false,
		url : "crossdomain.php",
		success : function(data) {
			colors = data;
		}
	});

	gameboardDiv = document.getElementById("gameboard");
	for ( var i = 0; i < numCards; i++) {
		card = document.createElement("div");
		card.id = "card" + i;
		card.setAttribute("class", "card");
		card.setAttribute("cnumber", i);
		card.setAttribute("flipped", 0);
		gameboardDiv.appendChild(card);
		card.addEventListener("click", flipCard, false); // ADD EVENT LISTENER TO THE INDIVIDUAL CARDS IN THE GAMEBOARD
		cardback = document.createElement("div");
		cardback.setAttribute("class", "card-back");
		card.appendChild(cardback);
		cardfront = document.createElement("div");
		cardfront.setAttribute("class", "card-front");
		cardfront.style.backgroundColor = colors[i];
		card.appendChild(cardfront);
		cards[i] = card;
	}
	cards[0].setAttribute("class", "card-selected");
	current = cards[0];
	document.body.addEventListener("keydown", getKeyCode, false);// ADD EVENTLISTER OT GRAB KEYPRESS EVENT, KEYDOWN IS SUPPORTED IN BOTH CHROME AND FIREFOX BROWSER
	start = 1;
}

/*******************************************************************************
 * FUNCTION NAME : FLIPCARD FUNCTION FOR HANDLING THE CARD CLICK AND COMPARING
 * THE SELECTED CARDS
 IF 2 CARDS ARE SELCTED THEY ARE MACHTED WITH BACKGROUND COLOUR 
	REMOVE THAE CARDS FROM THE BOARD IF THEY HAVE SAME BACKGROUND
	FLIPS THE CARD TO ORIGINAL POSITION IF  THE BACKGROND DOES NOT MATCH
 ******************************************************************************/

function flipCard() {
	card = this;
	card = current;
	card.setAttribute("class", "card active card-selected");  //CHANGE THE STATE OF THE CURRENT CARD WHEN SELECTED
	card.firstChild.setAttribute("class", "card-back-active");
	card.lastChild.setAttribute("class", "card-front-active");
	
	if (flipped.length < 2) {
		card.setAttribute("flipped", 1);
		flipped[selected++] = card;
	}

	if (flipped.length == 2) { //BLOCK TO CHECK IF 2 CARDS ARE SELCTED AND THE BACKGROUND MATCH EACH OTHER
	
		if (flipped[0].lastChild.style.backgroundColor == flipped[1].lastChild.style.backgroundColor) {
			//console.log("matched");
			selected = 0;
			pairs.push(flipped[0]);
			pairs.push(flipped[1]);
			flipped.splice(0,2);
		setTimeout(function() {  //SET TIME OUT TO REMOVE CARDS AFTER 2 SECONDS
				for(var i =0; i<pairs.length; i++){
					pairs[i].removeEventListener("click", flipCard, false);
					pairs[i].setAttribute("flipped", -1);
					pairs[i++].setAttribute("class", "card-matched");
					pairs[i].removeEventListener("click", flipCard, false);
					pairs[i].setAttribute("flipped", -1);
					pairs[i].setAttribute("class", "card-matched");
					pairs.splice(i,1);
					pairs.splice(i-1,1);
					}
			}, 2000);
			points++;
			pairsFound++;
		} 
		else {
			selected = 0;
			temp.push(flipped[0]);
			temp.push(flipped[1]);
			setTimeout(function() { //SET TIME OUT TO  FLIP CARDS BACK AFTER 2 SECONDS
				flipped.splice(0,2);
				for(var i =0;i< temp.length;i++){
				temp[i].firstChild.setAttribute("class", "card-back"); //RETURN THE CARDS TO INITIAL STATE
				temp[i].lastChild.setAttribute("class", "card-front");
				temp[i++].setAttribute("flipped", 0);
				temp[i].firstChild.setAttribute("class", "card-back");
				temp[i].lastChild.setAttribute("class", "card-front");
				temp[i].setAttribute("flipped", 0);
				temp.splice(i,1);
				temp.splice(i-1,1);
					}
	
			}, 2000);
			points--;
		}
		moves++;
		document.getElementById("status").innerHTML = "Moves :" + moves
		+ "<br> Points :" + points;
	}
	
	if (pairsFound == (numCards / 2)) {  //if all the cards in the gameboard  is matched stop timer and show message 
		//console.log("success");
		document.getElementById("popup").setAttribute("class","popupvisible");
		clearInterval(timer);
		document.getElementById("message").innerHTML = "You Won in "
			+ moves + " moves! <br> Your Score :" + points+"<br> Your Time : "+document.getElementById("timer").innerHTML+"<br> Press Enter to Play Again";
	}
}

/*
 * FUNCTION NAME: CLOSEMESSAGE 
	REMOVE THE POPUP SCREEN FROM THE WEB PAGE
 * 
 */
function closemessage(event) {
	if(event.keyCode==13){
	document.getElementById("popup").setAttribute("class", "popuphidden");
	document.getElementById("cancel").blur();}
}

/*
 * FUNTION NAME : RESET 
	RESET THE VARIABLES USED TO STORE THE DATA FOR THE GAME SESSION
 * 
 */

function resetboard(event) {
	if(event.keyCode==13){
	clearInterval(timer);
	pairs = [];
	selected = 0;
	pairsFound = 0;
	moves = 0;
	document.getElementById("status").innerHTML = "Moves : 0 <br> Points : 0 ";
	document.getElementById("timer").innerHTML = "00:00";
	resetGameboard();
	current = cards[0];
	document.getElementById("popup").setAttribute("class", "popuphidden"); 
	document.getElementById("resetbutton").blur();
	document.getElementById("confirm").blur();
	}
}

/*
 * FUNTION NAME : RESETGAMEBOARD RESET THE CARDS TO THE INITIAL GAME STATE
 * 
 */

function resetGameboard() {
	resetCard(0, pairs);
	setTimeout(function() {  //SET THE FOCUS TO THE FIRST CARD IN THE GAME BOARD
		cards[0].setAttribute("class", "card-selected");
		start = 1;
	}, 3000);
}

function resetCard(id, pairs) {  // RESET INDIVIDUAL CARDS IN THE BOARD TO INITIAL STATE
	cards[id].setAttribute("class", "card-reset");
	cards[id].setAttribute("flipped", 0);
	cards[id].firstChild.setAttribute("class", "card-back");
	cards[id].lastChild.setAttribute("class", "card-front");
	cards[id].addEventListener("click", flipCard, false);
	var card = cards[id];
	setTimeout(function() {  //TIME OUT FUNCTION TO STOP THE ANIMATION AFTER 2 SECONDS
		card.setAttribute("class", "card");
	}, 2000);
	if ((id + 1) < numCards) {
		setTimeout(function() {
			resetCard(id + 1, pairs);
		}, 200);
	}

}

/*
 * FUNCTION NAME : GETKEYCODE
 * HANDLE THE KEYPRESS EVENT FOR THE GAMEBOARD USING THE STANDARD KEYCODES
 * FOR SMART TVS THE vk_1, vk_2,..VK_10 OR VK_UP CONSTANTS ARE USED FOR KEYCODES
 * 
 * */
function getKeyCode(e) {
	//console.log(e.keyCode);
	var flippedcount = parseInt(current.getAttribute("flipped"));
	if(pairsFound != (numCards/2)){
	switch (e.keyCode) {
	case 37:  //HANDLE LEFT ARROW KEYPRESS - MOVE BACK SINGLE POSITION
		e.preventDefault();
		increment = -1;
		moveposition(increment);
		break;
		
	case 38: //HANDLE UP ARROW KEYPRESS - MOVE UP FOUR POSITION
		e.preventDefault();
		increment = -4;
		moveposition(increment);
		break;
		
	case 39:  //HANDLE RIGHT ARROW KEYPRESS - MOVE FORWARD SINGLE POSITION
		e.preventDefault(); 
		increment = 1;
		moveposition(increment);

		break;
	case 40:  //HANDLE DOWN ARROW KEYPRESS - MOVE DOWN FOUR POSITION
		e.preventDefault();
		increment = 4;
		moveposition(increment);
		break;

	case 13: //HANDLE ENTER KEYPRESS TO ACTIVATE THE CARDS
		e.preventDefault();
		console.log(flipped.length);
		if (flippedcount == 0 && flipped.length <= 1)  //ACTIVATE CLICK ONLY WHEN LESS THAN 2 CARDS ARE SELECTED
			current.click();
		if(start == 1){
			timer=setInterval(function(){countuptimer()},1000);
			start =0;
		}
		break;
	}
}
else{ 
	document.getElementById("confirm").focus();
	 }
}

/*
 * FUNCTION NAME: MOVEPOSITION
 * HANDLES THE SELECTION OF CARDS WHEN THE ARROW KEYS ARE PRESSED
 * */

function moveposition(increment){
	var flipped = parseInt(current.getAttribute("flipped"));
	var cnumber = parseInt(current.getAttribute("cnumber"));
	var newindex = cnumber + increment;
	if(newindex >= 0 && newindex < cards.length){  
		if(flipped==0 || flipped == 1) //IF THE CARDS ARE NOT MATCHED ENABLE NAVIGATION TO THE CARDS
		current.setAttribute("class", "card"); 
		current = document.getElementById("card" + newindex);
		var cnumber = parseInt(current.getAttribute("cnumber"));
		var flipped = parseInt(current.getAttribute("flipped"));
		if (flipped == -1){ //IF THE CARDS ARE MATCHED, SKIP TO THE NEXT AVAILABLE CARD
			current.setAttribute("class", "card-matched"); 
			//console.log(increment);
			moveposition(increment);
			}
		else 
			current.setAttribute("class", "card-selected"); //SET THE CURRENT CARD AS SELECTED
	}
	else if(flipped == -1 && (newindex < 0 || newindex >= cards.length)){ //IF THE CARDS ARE MATCHED, SKIP TO THE NEXT AVAILABLE CARD
		moveposition(-increment);
	}
}

function countuptimer(){ //TIMER FUNCTION TO CALCULATE THE TOTAL GAME TIME. 
	var time = document.getElementById("timer").innerHTML.split(":");
	//console.log(time);
	var  mins = parseInt(time[0]);
	var seconds = parseInt(time[1]);
	if(seconds >= 60){
		mins++;
		seconds = 0;
		}
	else 
		seconds++;
	if(seconds < 10 && mins < 10)
	document.getElementById("timer").innerHTML = "0"+mins+":0"+seconds;
	else if(mins < 10)
	document.getElementById("timer").innerHTML = "0"+mins+":"+seconds;
	else 
	document.getElementById("timer").innerHTML = mins+":"+seconds;
	
}


function startgame(event){
if(event.keyCode==13){
	document.getElementById("startpopup").setAttribute("class","popuphidden");
	document.getElementById("startconfirm").blur();
	createGameboard();
	
}

}