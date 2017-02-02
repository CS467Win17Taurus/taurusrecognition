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



