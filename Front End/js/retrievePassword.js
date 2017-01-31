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
	//Create and send request
	var req = new XMLHttpRequest();
	
	var data = {};
	data.email = document.getElementById("inputEmail").value;

	req.open('POST', "http://mockbin.org/bin/fb1bd010-c776-4f35-8558-7060a0c98341", true);
	req.addEventListener('load', function(){
		//Check for error message
		if (req.status >= 200 && req.status < 400)
		{
			var response = JSON.parse(req.responseText);
			console.log(response);
			document.getElementById("pwordStatus").textContent = response;
			//May need to change depending on response message ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			if (response == "Password has been sent to your email")
				document.getElementById("pwordStatus").className = "goodStatus";
			else
				document.getElementById("pwordStatus").className = "badStatus";
		}
		else
			console.log("Error in network request: " + req.StatusText);
	});
	req.send(JSON.stringify(data));
}

//Event Listeners
document.getElementById("cancel").addEventListener('click', cancel);
document.getElementById("submit").addEventListener('click', submitEmail);