/*Taurus Employee Recognition
General functions to support front end
Modify User Account by Admin
*/

//Initialize page by getting info
function initializePage(){
	//Check user is logged in
	if (!checkLogIn('admin_id')){
		window.location.href = 'index.html';
	}
	else{
		console.log("Logged in = true");
	}
}

//Validate form data
function validate(){
	//Ceheck that each field is filled in and passwords match
	var errorHTML = "";
	var numErrors = 0;
	
	//Username check
	if (document.getElementById('username').value == ""){
		errorHTML += "***Please inlcude a username.";
		numErrors++;
	}
	
	//Password check
	if (document.getElementById('pword').value == ""){
		if (numErrors > 0)
			errorHTML += "<br>";
		errorHTML += "***Please enter a password.";
		numErrors++;
	}
	
	//Check that new passwords match
	if (document.getElementById("pword").value != document.getElementById("confPw").value){
		if (numErrors > 0)
			errorHTML += "<br>";
		errorHTML += "***Passwords do not match.";
		numErrors++;
	}
	
	if (numErrors > 0){
		document.getElementById("errors").innerHTML = errorHTML;
		document.getElementById("errors").className = "badStatus";
	}
	else{
		console.log("No form errors");
		sendData();
	}
}

//Send data
function sendData(){
	console.log("In send data");
	//Get form data
	var data = {};
	data.adminName = document.getElementById("username").value;
	data.password = document.getElementById("pword").value;
	
	makeRequest('POST', "http://138.197.7.194/api/admins/", data, true, adminAddResponse);
}

//Handle response after adding user
function adminAddResponse(response){
	window.location.href = 'aAdminAccounts.html';
}

//Clear form input to blank
function clear(){
	document.getElementById("username").value = "";
	document.getElementById("pword").value = "";
	document.getElementById("confPw").value = "";
	document.getElementById("errors").innerHTML = "";
}	

//Event Listeners
document.getElementById("clear").addEventListener('click', clear);
document.getElementById("submit").addEventListener('click', validate);

//Initialize Page
document.addEventListener('DOMContentLoaded', initializePage);