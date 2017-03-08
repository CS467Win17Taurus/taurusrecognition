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
		document.getElementById("createAwardError").style.display = "none";
		addUserOptions();
		addTypeOptions();
		addAmountOptions();
	}
}

//Add options to recipients based on values in db
function addUserOptions(){
	makeRequest('GET', "http://138.197.7.194/api/users/", null, true, userOptionsResponse);
	event.preventDefault();
}

//Handle user options response
function userOptionsResponse(response){
	var id = getId('user_id');
	var sel = document.getElementById("user");
	var opt = document.createElement("option");
	response.forEach(function(type){
		//Reference: http://stackoverflow.com/a/6194450
		if (type.id != id)
			sel.add(new Option(captialize(type.fName) + " " + captialize(type.lName), type.id));
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
	$("#dateFromPicker").datepicker("clearDates");
	document.getElementById("createAwardError").style.display = "none";
}

//Submit award information to create new award in db
function submitAward(){
	var user = document.getElementById("user").value;
	var type = document.getElementById("type").value;
	var amount = document.getElementById("amount").value;
	
	//Get From Date
	var date = $('#dateFromPicker').datepicker('getDate');
	if (date != null)
	{
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day = date.getDate();
	}
	if (month < 10)
		month = '0' + month;
	if (day < 10)
		day = '0' + day;
	var awardDate = year + "-" + month + "-" + day;
	console.log("Award date: " + awardDate);
	
	//Validate all fields are filled in
	if (user == " " || type == " " || amount == " " || date == null){
		document.getElementById("createAwardError").textContent = "Error: Please fill in all the fields.";
		document.getElementById("createAwardError").style.display = "block";
	}
	else{
		var data = new FormData();
		data.append("recipient", user);
		data.append("giver",getId('user_id'));
		data.append("awardId", type);
		data.append("bonusId", amount);
		data.append("date", awardDate);

		makeRequestFormData('POST', "http://138.197.7.194/api/userAwards/", data, true, awardResponse);
	}
}

//Handle award creation response
function awardResponse(response){
	clearForm();
	window.location.href = 'userAccount.html';
}


//Event Listeners
document.getElementById("clearForm").addEventListener('click', clearForm);
document.getElementById("submit").addEventListener('click', submitAward);

//Initialize Page
document.addEventListener('DOMContentLoaded', initializePage);