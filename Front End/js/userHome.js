/*Taurus Employee Recognition
General functions to support front end
User Home Page/Login
*/

var USER_ID = -1;

function initializePage(){
	USER_ID = -1;
}

//login
//Description: Sends login information to backend to verify
//user information
//Input: Form data from email and password fields
//Output: Ok if registered user, no if not
function login()
{
	//Create and send request
	var req = new XMLHttpRequest();
	var data = {};
	data.email = document.getElementById("inputEmail").value;
	data.password = document.getElementById("inputPassword").value;
	req.open('POST', "http://httpbin.org/post", true);
	req.setRequestHeader('Content-Type', 'application/json');
	req.addEventListener('load', function(){
		//Check for error message
		if (req.status >= 200 && req.status < 400)
		{
			var response = JSON.parse(req.responseText);
			console.log(response);
			window.location.href = 'http://web.engr.oregonstate.edu/~broedera/CS467/userTemplate.html';
		}
		else
			console.log("Error in network request: " + req.StatusText);
	});
	req.send(JSON.stringify(data));
	event.preventDefault();
}


//Event Listeners
document.getElementById("signInBtn").addEventListener('click', login);

//Initialize Page
document.addEventListener('DOMContentLoaded', initializePage);