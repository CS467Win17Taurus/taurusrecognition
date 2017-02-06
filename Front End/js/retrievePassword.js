/*Taurus Employee Recognition
General functions to support front end
Retrieve Password
*/

//Cancel retrieval and navigate back to home page
function cancel(){
	window.location.href = 'http://web.engr.oregonstate.edu/~broedera/CS467/index.html';
}

//Send request with email and update with response
function submitEmail(){
	email = document.getElementById("inputEmail").value;
	makeRequest('GET', "http://138.197.7.194/api/users/?email=" + email + "&action=retrieve", null, false, displayMessage)
}

//Display response message
function displayMessage(response){
	document.getElementById("pwordStatus").textContent = response;
	
	if (response == "Password has been sent to your email")
		document.getElementById("pwordStatus").className = "goodStatus";
	else
		document.getElementById("pwordStatus").className = "badStatus";
}

//Event Listeners
document.getElementById("cancel").addEventListener('click', cancel);
document.getElementById("submit").addEventListener('click', submitEmail);