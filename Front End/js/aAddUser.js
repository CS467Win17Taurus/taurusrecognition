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
		
		getDepts();
	}
}

//Get department list
function getDepts(){
	makeRequest('GET', "http://138.197.7.194/api/divisions/", null, true, usersDeptResponse);
}

//Handle get depts response
function usersDeptResponse(response){
	var sel = document.getElementById("dept");
	var opt = document.createElement("option");
	response.forEach(function(type){
		//Reference: http://stackoverflow.com/a/6194450
		sel.add(new Option(type.name, type.did));
	});
}

//Validate form data
function validate(){
	//Ceheck that each field is filled in and passwords match
	var errorHTML = "";
	var numErrors = 0;
	
	//First name check
	if (document.getElementById('fName').value == ""){
		errorHTML += "***Please inlcude a first name.";
		numErrors++;
	}
	
	//Last name check
	if (document.getElementById('lName').value == ""){
		if (numErrors > 0)
			errorHTML += "<br>";
		errorHTML += "***Please inlcude a last name.";
		numErrors++;
	}
	
	//Email check
	if (document.getElementById('email').value == ""){
		if (numErrors > 0)
			errorHTML += "<br>";
		errorHTML += "***Please inlcude an email.";
		numErrors++;
	}
	
	//Department check
	if (document.getElementById('dept').value == ""){
		if (numErrors > 0)
			errorHTML += "<br>";
		errorHTML += "***Please select a department.";
		numErrors++;
	}
	
	//Signature check
	var file = document.getElementById("sig");
	if (file.files.length < 1){
		if (numErrors > 0)
			errorHTML += "<br>";
		errorHTML += "***Please select a signature image file.";
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
		document.getElementById("addError").innerHTML = errorHTML;
		document.getElementById("addError").className = "badStatus";
	}
	else
		sendData();
}

//Send data
function sendData(){
	//Get form data
	var data = new FormData();
	data.append("fName", document.getElementById("fName").value);
	data.append("lName", document.getElementById("lName").value);
	data.append("email", document.getElementById("email").value);
	data.append("dept", document.getElementById("dept").value);
	data.append("password", document.getElementById("pword").value);
	
	//Ref: http://www.w3schools.com/jsref/prop_fileupload_files.asp
	var file = document.getElementById("sig");
	if (file.files.length > 0){
		var thisFile = file.files[0];
		data.append("signature", thisFile);
		console.log(thisFile);
	}
	
	console.log(data);
	makeRequestFormData('POST', "http://138.197.7.194/api/users/", data, false, aUserAddResponse);
}

//Handle response after adding user
function aUserAddResponse(response){
	if (response == "User already exists"){
		document.getElementById("addError").textContent = "Error: " + response;
		document.getElementById("addError").style.display = "block";
	}
	else
		window.location.href = 'aUserAccounts.html';
}

//Clear form input to blank
function clear(){
	document.getElementById("fName").value = "";
	document.getElementById("lName").value = "";
	document.getElementById("email").value = "";
	document.getElementById("pword").value = "";
	document.getElementById("confPw").value = "";
	document.getElementById("dept").value = " ";
	document.getElementById("sig").value = "";
	document.getElementById("addError").innerHTML = "";
}	

//Event Listeners
document.getElementById("clear").addEventListener('click', clear);
document.getElementById("submit").addEventListener('click', validate);

//Initialize Page
document.addEventListener('DOMContentLoaded', initializePage);