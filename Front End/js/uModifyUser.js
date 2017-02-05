/*Taurus Employee Recognition
General functions to support front end
Modify User Account by User
*/

//Initialize page by getting info
function initializePage(){
	//Check user is logged in
	if (!checkLogIn('user_id')){
		window.location.href = 'index.html';
	}
	else{
		console.log("Logged in = true");
		getDepts();
	}
}

//Get department list
function getDepts(){
	var sel = document.getElementById("dept");
	
	//Create and send request
	var req = new XMLHttpRequest();
	req.open('GET', "http://138.197.7.194/api/divisions/", true);
	req.addEventListener('load', function(){
		//Check for error message
		if (req.status >= 200 && req.status < 400)
		{
			var response = JSON.parse(req.responseText);
			console.log(response);
			var opt = document.createElement("option");
			response.forEach(function(type){
				//Reference: http://stackoverflow.com/a/6194450
				sel.add(new Option(type.name, type.did));
			});
			getFormData();
		}
		else
			console.log("Error in network request: " + req.StatusText);
	});
	req.send();
}

//Get form data
function getFormData(){
	//Create and send request
	var req = new XMLHttpRequest();
	
	var id = getId('user_id');
	//var id = 234; //hardcoded for testing locally without use of cookies
	
	req.open('GET', "http://mockbin.org/bin/b7509746-76ca-43c3-aeea-8bc0ce25d9fa?id=" + id, true);
	req.addEventListener('load', function(){
		//Check for error message
		if (req.status >= 200 && req.status < 400)
		{
			var response = JSON.parse(req.responseText);
			console.log(response);
			fillForm(response);
		}
		else
			console.log("Error in network request: " + req.StatusText);
	});
	req.send();
}

//Function to fill fields of form
function fillForm(data){
	document.getElementById("fName").value = data.fName;
	document.getElementById("lName").value = data.lName;
	document.getElementById("email").value = data.email;
	document.getElementById("dept").value = data.dept;
	document.getElementById("sigImg").src = data.signature;
	userPw = data.password;
	userId = data.id;
}

//Validate form
function validateForm(){
	var errorHTML = "";
	var numErrors = 0;
	
	//Check that fields are not empty
	if (document.getElementById('fName').value == ""){
		errorHTML += "***Please inlcude a first name.";
		numErrors++;
	}
	if (document.getElementById('lName').value == ""){
		if (numErrors > 0)
			errorHTML += "<br>";
		errorHTML += "***Please inlcude a last name.";
		numErrors++;
	}
	if (document.getElementById('email').value == ""){
		if (numErrors > 0)
			errorHTML += "<br>";
		errorHTML += "***Please inlcude an email.";
		numErrors++;
	}
	if (document.getElementById('dept').value == ""){
		if (numErrors > 0)
			errorHTML += "<br>";
		errorHTML += "***Please select a department.";
		numErrors++;
	}
	
	if (numErrors > 0){
		document.getElementById("formErrors").innerHTML = errorHTML;
		document.getElementById("formErrors").className = "badStatus";
		return false
	}
	else
		return true;
}

//Validate password
function validatePassword(){
	var numErrors = 0;
	var errorHTML = "";
	
	//Check old password is correct
	if (document.getElementById("oldPw").value != userPw){
		errorHTML += "***Current password is incorrect.";
		numErrors++;
	}
	
	//Check that new passwords match
	if (document.getElementById("newPw").value != document.getElementById("newPw2").value){
		if (numErrors > 0)
			errorHTML += "<br>";
		errorHTML += "***New passwords do not match.";
		numErrors++;
	}
	
	//Print any errors
	if (numErrors > 0){
		errorHTML += "<br>";
		document.getElementById("pwordErrors").innerHTML = errorHTML;
		document.getElementById("pwordErrors").className = "badStatus";
		return false;
	}
	else
		return true;
}

//Save Data
function save(){
	if (validateForm()){
		if (document.getElementById("newPw").value != ""){
			if (validatePassword()){
				sendData();
			}
		}
		else
			sendData();
	}
}

//Send data
function sendData(){
	//Create and send request
	var req = new XMLHttpRequest();
	var data = new FormData();
	data.append("id", userId);
	data.append("fName", document.getElementById("fName").value);
	data.append("lName", document.getElementById("lName").value);
	data.append("email", document.getElementById("email").value);
	data.append("dept", document.getElementById("dept").value);
	
	var file = document.getElementById("sig");
	if (file.files.length > 0){
		//Ref: http://www.w3schools.com/jsref/prop_fileupload_files.asp
		var thisFile = file.files[0];
		console.log("Num files: " + file.files.length);
		console.log("Filename: " + thisFile.name + ", Size: " + thisFile.size + ", Type: " + thisFile.type);
		data.append("signature", thisFile);
	}
	if (document.getElementById("newPw").value != "")
		data.append("password", document.getElementById("newPw").value);
	
	req.open('PUT', "http://mockbin.org/bin/fbca1ddd-dc5d-4a4d-9640-bc4c0e4514e5", true); 
	req.addEventListener('load', function(){
		//Check for error message
		if (req.status >= 200 && req.status < 400)
		{
			var response = JSON.parse(req.responseText);
			console.log(response);
			window.location.href = 'userAccount.html';
		}
		else
			console.log("Error in network request: " + req.StatusText);
	});
	req.send(data);
}

//Cancel
function cancel(){
	window.location.href = 'userAccount.html'; 
}

//Event Listeners
document.getElementById("cancel").addEventListener('click', cancel);
document.getElementById("save").addEventListener('click', save);

//Initialize Page
document.addEventListener('DOMContentLoaded', initializePage);