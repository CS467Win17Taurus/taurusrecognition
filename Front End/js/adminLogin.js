/*Taurus Employee Recognition
General functions to support front end
Admin login page
*/

//Login
function login()
{
	adminName = document.getElementById("username").value;
	password = document.getElementById("password").value;
	makeRequest('GET', "http://mockbin.org/bin/2fe094f6-7525-4eb2-8eaf-a0f5a8f417ca?adminName=" + adminName + "&password=" + password + "&action=login", null, true, processLoginResponse) //Good
	//makeRequest('GET', "http://mockbin.org/bin/2574bd7c-04a9-4141-81a8-23bfcb41162a?adminName=" + adminName + "&password=" + password + "&action=login", null, true, processLoginResponse) //Bad
	event.preventDefault();
}

function processLoginResponse(response){
	if (response.status.toLowerCase() == "success"){
		window.location.href = 'adminTemplate.html'; 
		logIn('admin', response.id);
		document.getElementById("loginStatus").textContent = "";
	}
	else{
		document.getElementById("loginStatus").textContent = "Login failed, username and/or password incorrect";
		document.getElementById("loginStatus").className = "badStatus";
		document.getElementById("password").value = "";
	}
}

//Cancel
function cancel(){
	window.location.href = 'index.html'; 
}

//Event Listeners
document.getElementById("cancel").addEventListener('click', cancel);
document.getElementById("login").addEventListener('click', login);