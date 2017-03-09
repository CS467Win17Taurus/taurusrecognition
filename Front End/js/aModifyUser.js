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

//Get form data
function getFormData(){
	var id = getParameterByName('userId');
	getUserName(id);
	makeRequest('GET', "http://138.197.7.194/api/users/?id=" + id, null, true, fillForm);
}

//Send data
function sendData(){
	//Get form data
	var data = new FormData();
	var id = getParameterByName('userId');
	data.append("id", id);
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
	
	makeRequestFormData('PUT', "http://138.197.7.194/api/users/", data, true, aUserModResponse);
	
}

//Handle response after modifying user
function aUserModResponse(response){
	if (response.status == "failed"){
		document.getElementById("editError").textContent = response.message;
		document.getElementById("editError").style.display = "block";
	}
	else
		window.location.href = 'aUserAccounts.html';
}

//Cancel
function cancel(){
	window.location.href = 'aUserAccounts.html'; 
}

//Event Listeners
document.getElementById("cancel").addEventListener('click', cancel);
document.getElementById("save").addEventListener('click', save);

//Initialize Page
document.addEventListener('DOMContentLoaded', initializePage);