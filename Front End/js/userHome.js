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
	makeRequest('GET', "http://mockbin.org/bin/6f8d5595-cbb2-4ad6-97ee-4f2f46cf46e8?email=" + email + "&password=" + password, null, true, userLoginResponse); //Good
	//makeRequest('GET', "http://mockbin.org/bin/98c424e3-1bd0-4be5-9835-45d68e073164?email=" + email + "&password=" + password, null, true, userLoginResponse); //Good
	event.preventDefault();
}

//Handle login response
function userLoginResponse(response){
	if (response.id != -1){
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