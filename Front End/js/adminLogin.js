/*Taurus Employee Recognition
General functions to support front end
Admin login page
*/

//Login
function login()
{
	adminName = document.getElementById("username").value;
	password = document.getElementById("password").value;
	makeRequest('GET', "http://138.197.7.194/api/admins/?adminName=" + adminName + "&password=" + password + "&action=login", null, true, processLoginResponse) //Good
	event.preventDefault();
}

function processLoginResponse(response){
	if (response.status.toLowerCase() == "success"){
		window.location.href = 'analytics.html'; 
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