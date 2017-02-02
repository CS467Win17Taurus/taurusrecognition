/*Taurus Employee Recognition
General functions to support front end
Create Award
*/

//Initialize page by filling in select options
function initializePage(){
	//Check user is logged in
	if (!checkLogIn('user_id')){
		//window.location.href = 'http://web.engr.oregonstate.edu/~broedera/CS467/index.html';
		window.location.href = 'index.html'; //local testing
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
	var sel = document.getElementById("user");
	
	//Create and send request
	var req = new XMLHttpRequest();
	req.open('GET', "http://mockbin.org/bin/96211a1a-4861-4d41-90d5-048a616c6515", true);
	req.addEventListener('load', function(){
		//Check for error message
		if (req.status >= 200 && req.status < 400)
		{
			var response = JSON.parse(req.responseText);
			console.log(response);
			var opt = document.createElement("option");
			response.forEach(function(type){
				//Reference: http://stackoverflow.com/a/6194450
				sel.add(new Option(type.fName + " " + type.lName, type.id));
			});
		}
		else
			console.log("Error in network request: " + req.StatusText);
	});
	req.send();
	event.preventDefault();
}

//Add options to award type based on values in db
function addTypeOptions(){
	var sel = document.getElementById("type");
	
	//Create and send request
	var req = new XMLHttpRequest();
	req.open('GET', "http://mockbin.org/bin/428a3a4e-7338-4619-a8cf-153e5cddb200", true);
	req.addEventListener('load', function(){
		//Check for error message
		if (req.status >= 200 && req.status < 400)
		{
			var response = JSON.parse(req.responseText);
			console.log(response);
			var opt = document.createElement("option");
			response.forEach(function(type){
				//Reference: http://stackoverflow.com/a/6194450
				sel.add(new Option(type.title, type.aid));
			});
		}
		else
			console.log("Error in network request: " + req.StatusText);
	});
	req.send();
	event.preventDefault();
}

//Add options to bonus amount based on values in db
function addAmountOptions(){
	var sel = document.getElementById("amount");
	
	//Create and send request
	var req = new XMLHttpRequest();
	req.open('GET', "http://mockbin.org/bin/7e45cbeb-d369-4c92-8aa7-3cbea65efc49", true);
	req.addEventListener('load', function(){
		//Check for error message
		if (req.status >= 200 && req.status < 400)
		{
			var response = JSON.parse(req.responseText);
			console.log(response);
			var opt = document.createElement("option");
			response.forEach(function(type){
				//Reference: http://stackoverflow.com/a/6194450
				sel.add(new Option("$" + type.amount, type.bid));
			});
		}
		else
			console.log("Error in network request: " + req.StatusText);
	});
	req.send();
	event.preventDefault();
}

//Reset select menus to blank
function clearForm(){
	document.getElementById("user").value = " ";
	document.getElementById("type").value = " ";
	document.getElementById("amount").value = " ";
}

//Submit award information to create new award in db
function submitAward(){
	//Create and send request
	var req = new XMLHttpRequest();
	
	var data = {};
	data.recipient = document.getElementById("user").value;
	
	data.giver = getId('user_id');
	//data.giver = "121";  //hardcoded, replace with actual user id ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	
	data.awardId = document.getElementById("type").value;
	data.bonusId = document.getElementById("amount").value;
	data.awardDate = new Date();

	req.open('POST', "http://mockbin.org/bin/e95fd964-aac4-4558-90d3-02dd5b070e7e", true);
	req.addEventListener('load', function(){
		//Check for error message
		if (req.status >= 200 && req.status < 400)
		{
			var response = JSON.parse(req.responseText);
			console.log(response);
			
			clearForm();
		}
		else
			console.log("Error in network request: " + req.StatusText);
	});
	req.send(JSON.stringify(data));
}

//Event Listeners
document.getElementById("clearForm").addEventListener('click', clearForm);
document.getElementById("submit").addEventListener('click', submitAward);

//Initialize Page
document.addEventListener('DOMContentLoaded', initializePage);