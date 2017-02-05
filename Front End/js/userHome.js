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
	//Create and send request
	var req = new XMLHttpRequest();

	email = document.getElementById("inputEmail").value;
	password = document.getElementById("inputPassword").value;
	req.open('GET', "http://mockbin.org/bin/6f8d5595-cbb2-4ad6-97ee-4f2f46cf46e8?email=" + email + "&password=" + password, true); //Good
	//req.open('GET', "http://mockbin.org/bin/98c424e3-1bd0-4be5-9835-45d68e073164?email=" + email + "&password=" + password, true); //Bad
	req.addEventListener('load', function(){
		//Check for error message
		if (req.status >= 200 && req.status < 400)
		{
			var response = JSON.parse(req.responseText);
			console.log(response);
			//Update depending on actual response ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
		else
			console.log("Error in network request: " + req.StatusText);
	});
	req.send();
	event.preventDefault();
}


//Event Listeners
document.getElementById("signInBtn").addEventListener('click', login);