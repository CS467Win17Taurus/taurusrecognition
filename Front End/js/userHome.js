/*Taurus Employee Recognition
General functions to support front end
User Home Page/Login
*/

//login
//Description: Sends login information to backend to verify
//user information
//Input: Form data from email and password fields
//Output: Ok if registered user, no if not
function login()
{
	email = document.getElementById("inputEmail").value;
	password = document.getElementById("inputPassword").value;
	makeRequest('GET', "http://138.197.7.194/api/users/?email=" + email + "&password=" + password + "&action=login", null, true, userLoginResponse);
	event.preventDefault();
}

//Handle login response
function userLoginResponse(response){
	console.log("Login response:");
	console.log(response);
	if (response.status.toLowerCase() == "success"){
		window.location.href = 'userAccount.html'; 
		logIn('user', response.id);
	}
	else{
		document.getElementById("loginStatus").textContent = "Login failed, email and/or password incorrect";
		document.getElementById("loginStatus").className = "badStatus";
		document.getElementById("inputPassword").value = "";
	}
}

//Event Listeners
document.getElementById("signInBtn").addEventListener('click', login);