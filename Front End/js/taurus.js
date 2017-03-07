/*Taurus Employee Recognition
General functions to support front end
General User/Admin Support
*/

function logOut(){
	setCookie('user_id',-1);
	setCookie('admin_id',-1);
	console.log("Everyone logged out");
	console.log("User id: " + getId('user_id') + ", Admin id: " + getId('admin_id'));
	window.location.href = 'index.html';
}

function logIn(type, id){
	if (type == "user"){
		setCookie('user_id',id);
		setCookie('admin_id',-1);
		console.log('User id: ' + getId('user_id'));
	}
	else{
		setCookie('user_id',-1);
		setCookie('admin_id',id);
		console.log('Admin id: ' + getId('admin_id'));
	}
}

//Cookie reference: http://www.w3schools.com/js/js_cookies.asp
function setCookie(cookieName, cookieVal){
	//Set exipiration to 24 hours, 
	var thisDate = new Date();
	thisDate.setTime(thisDate.getTime() + 24*60*60*1000);
	var expireDate = thisDate.toUTCString();
	//console.log(expireDate);
	
	document.cookie = cookieName + "=" + cookieVal + ";expires=" + expireDate + ";path=/";
}

function getId(cookieName) {
	console.log(document.cookie);
    var name = cookieName + "=";
    var cookieSplit = document.cookie.split(';');
	//console.log("Cookie split: " );
	//console.log(cookieSplit);
    for(var i = 0; i < cookieSplit.length; i++) {
        var c = cookieSplit[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
			//console.log("Get ID result: " + c.substring(name.length, c.length));
            return c.substring(name.length, c.length);
        }
    }
    return -1;
}

function checkLogIn(cookieName){
	var id = getId(cookieName);
	console.log("Login Check Id: " + id);
	if (Number(id) != -1)
		return true;
	else	
		return false;
}

//Make HTTP request
function makeRequest(type, url, data, parse, resFunc){
	console.log(url);
	//Create and send request
	var req = new XMLHttpRequest();
	req.open(type, url, true);
	req.addEventListener('load', function(){
		//Check for error message
		if (req.status >= 200 && req.status < 400)
		{
			if (parse){
				var response = JSON.parse(req.responseText);
				console.log(response);
				resFunc(response);
			}
			else{
				var response = req.responseText;
				console.log(response);
				resFunc(response);
			}
		}
		else
			console.log("Error in network request: " + req.StatusText);
	});
	if (data != null)
		req.send(JSON.stringify(data));
	else
		req.send();
}

//Make HTTP request with form data
function makeRequestFormData(type, url, data, parse, resFunc){
	console.log(url);
	//Create and send request
	var req = new XMLHttpRequest();
	req.open(type, url, true);
	req.addEventListener('load', function(){
		//Check for error message
		if (req.status >= 200 && req.status < 400)
		{
			if (parse){
				var response = JSON.parse(req.responseText);
				console.log(response);
				resFunc(response);
			}
			else{
				var response = req.responseText;
				console.log(response);
				resFunc(response);
			}
		}
		else
			console.log("Error in network request: " + req.StatusText);
	});
	req.send(data);
}

//Make HTTP request and pass up to two extra params
function makeRequestWithExtraParams(verb, url, data, inDataJson, parse, resFunc, type, id){
	console.log(url);
	
	//Create and send request
	var req = new XMLHttpRequest();
	req.open(verb, url, true);
	req.addEventListener('load', function(){
		//Check for error message
		if (req.status >= 200 && req.status < 400)
		{
			if (parse){
				console.log("Parsing data");
				var response = JSON.parse(req.responseText);
				console.log(response);
				resFunc(response, type, id);
			}
			else{
				var response = req.responseText;
				console.log(response);
				resFunc(response, type, id);
			}
		}
		else
			console.log("Error in network request: " + req.StatusText);
	});
	if (data != null && !inDataJson){
		req.send(data);
	}
	else if (data != null && inDataJson){
		req.send(JSON.stringify(data));
	}
	else{
		req.send();
	}
}

//Get user's name for header
function getUserName(id){
	makeRequest('GET', "http://138.197.7.194/api/users/?id=" + id, null, true, userAcctGetNameResp);
}

//Handle get user name response
function userAcctGetNameResp(response){
	//Ref: http://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
	var name = response.fName;
	var capitalName = name.charAt(0).toUpperCase() + name.slice(1);	
	document.getElementById("userName").textContent = capitalName;
}

//Capitalize first letter
function captialize(word){
	return word.charAt(0).toUpperCase() + word.slice(1);
}

//Ref: http://stackoverflow.com/a/901144
function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}