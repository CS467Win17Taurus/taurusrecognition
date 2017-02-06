/*Taurus Employee Recognition
General functions to support front end
Create Award
*/

//Initialize page by filling in select options
function initializePage(){
	//Check user is logged in
	if (!checkLogIn('user_id')){
		window.location.href = 'index.html';
	}
	else{
		console.log("Logged in = true");
		addUserOptions();
		addTypeOptions();
		addAmountOptions();
	}
}

//Add options to recipients based on values in db
function addUserOptions(){
	makeRequest('GET', "http://mockbin.org/bin/96211a1a-4861-4d41-90d5-048a616c6515", null, true, userOptionsResponse);
	event.preventDefault();
}

//Handle user options response
function userOptionsResponse(response){
	var sel = document.getElementById("user");
	var opt = document.createElement("option");
	response.forEach(function(type){
		//Reference: http://stackoverflow.com/a/6194450
		sel.add(new Option(type.fName + " " + type.lName, type.id));
	});
}

//Add options to award type based on values in db
function addTypeOptions(){
	makeRequest('GET', "http://138.197.7.194/api/awards/", null, true, typeOptionsResponse);
	event.preventDefault();
}

//Handle award type response
function typeOptionsResponse(response){
	var sel = document.getElementById("type");
	var opt = document.createElement("option");
	response.forEach(function(type){
		//Reference: http://stackoverflow.com/a/6194450
		sel.add(new Option(type.title, type.aid));
	});
}

//Add options to bonus amount based on values in db
function addAmountOptions(){
	makeRequest('GET', "http://138.197.7.194/api/bonuses/", null, true, amountOptionsResponse);
	event.preventDefault();
}

//Handle bonus amount response
function amountOptionsResponse(response){
	var sel = document.getElementById("amount");
	var opt = document.createElement("option");
	response.forEach(function(type){
		//Reference: http://stackoverflow.com/a/6194450
		sel.add(new Option("$" + type.amount, type.bid));
	});
}

//Reset select menus to blank
function clearForm(){
	document.getElementById("user").value = " ";
	document.getElementById("type").value = " ";
	document.getElementById("amount").value = " ";
}

//Submit award information to create new award in db
function submitAward(){
	var data = {};
	data.recipient = document.getElementById("user").value;
	data.giver = getId('user_id');
	data.awardId = document.getElementById("type").value;
	data.bonusId = document.getElementById("amount").value;
	data.awardDate = new Date();
	makeRequest('POST', "http://mockbin.org/bin/e95fd964-aac4-4558-90d3-02dd5b070e7e", data, true, awardResponse);
}

//Handle award creation response
function awardResponse(response){
	clearForm();
}


//Event Listeners
document.getElementById("clearForm").addEventListener('click', clearForm);
document.getElementById("submit").addEventListener('click', submitAward);

//Initialize Page
document.addEventListener('DOMContentLoaded', initializePage);