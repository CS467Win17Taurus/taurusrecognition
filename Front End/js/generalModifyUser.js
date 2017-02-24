/*Taurus Employee Recognition
General functions to support front end
General modify user account functions to support
page in user section and admin section
*/

var userPw = "";
var userId = -1;

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
	getFormData();
}

//Function to fill fields of form
function fillForm(data){
	document.getElementById("fName").value = data.fName;
	document.getElementById("lName").value = data.lName;
	document.getElementById("email").value = data.email;
	document.getElementById("dept").value = data.dept;
	document.getElementById("sigImg").src = " http://138.197.7.194/static/" + data.signature;
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
		return false;
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
	//Clear prior error messages
	document.getElementById("formErrors").textContent = "";
	document.getElementById("pwordErrors").textContent = "";
	
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


