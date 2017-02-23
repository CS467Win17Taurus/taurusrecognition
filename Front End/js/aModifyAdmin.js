/*Taurus Employee Recognition
General functions to support front end
Modify User Account by Admin
*/

var adminPw = "";

//Initialize page by getting info
function initializePage(){
	//Check user is logged in
	if (!checkLogIn('admin_id')){
		window.location.href = 'index.html';
	}
	else{
		console.log("Logged in = true");
		getFormData();
	}
}

//Get form data
function getFormData(){
	var id = getParameterByName('adminId');
	makeRequest('GET', "http://138.197.7.194/api/admins/?id=" + id, null, true, fillForm);
}

//Function to fill fields of form
function fillForm(data){
	document.getElementById("username").value = data.adminName;
	document.getElementById("adminName").textContent = data.adminName;
	adminPw = data.password;
}

//Validate form data
function validate(){
	//Ceheck that a field is filled in and passwords match if applicable
	var errorHTML = "";
	var numErrors = 0;
	
	//Username check
	if (document.getElementById('username').value == ""){
		errorHTML += "***Please inlcude a username.";
		numErrors++;
	}
	
	var oldPw = document.getElementById('oldPw').value;
	var newPw = document.getElementById("newPw").value;
	var newPw2 = document.getElementById("newPw2").value;
	
	if (oldPw != "" || newPw != "" || newPw2 != ""){
		//Password check
		if (oldPw != adminPw){
			if (numErrors > 0)
				errorHTML += "<br>";
			errorHTML += "***Current password is incorrect.";
			numErrors++;
		}
		
		//Check that new passwords match
		if (newPw != newPw2){
			if (numErrors > 0)
				errorHTML += "<br>";
			errorHTML += "***Passwords do not match.";
			numErrors++;
		}
	}
		if (numErrors > 0){
			document.getElementById("errors").innerHTML = errorHTML;
			document.getElementById("errors").className = "badStatus";
		}
		else
			sendData();
}

//Send data
function sendData(){
	//Get form data
	var data = {};
	var id = getParameterByName('adminId');
	data.id = id;
	data.adminName = document.getElementById("username").value;
	if (document.getElementById("newPw").value != "")
		data.password = document.getElementById("newPw").value;
	
	makeRequest('PUT', "http://138.197.7.194/api/admins/", data, true, adminAddResponse);
}

//Handle response after adding user
function adminAddResponse(response){
	window.location.href = 'aAdminAccounts.html';
}

//Clear form input to blank
function cancel(){
	window.location.href = 'aAdminAccounts.html';
}	

//Event Listeners
document.getElementById("cancel").addEventListener('click', cancel);
document.getElementById("submit").addEventListener('click', validate);

//Initialize Page
document.addEventListener('DOMContentLoaded', initializePage);