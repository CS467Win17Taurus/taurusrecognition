/*Taurus Employee Recognition
General functions to support front end
Admin's User Account Page
*/

//Initialize page
function initializePage(){
	//Check admin is logged in
	if (!checkLogIn('admin_id')){
		window.location.href = 'index.html';
	}
	else{
		console.log("Logged in = true");
		createTable();
		clearErrors();
	}
}

//Create table of users
function createTable(){
	clearErrors();
	
	var table = document.getElementById("usersTbl");
	
	//Delete rows from table body
	while (table.hasChildNodes())
		table.removeChild(table.firstChild);
	
	//Create table head with row
	var head = document.createElement('thead');
	head.className = "thead-default";
	table.appendChild(head);
	var row = document.createElement('tr');
	head.appendChild(row);
	
	//Create header cells
	var headCell = document.createElement('th');
	headCell.textContent = 'Id';
	row.appendChild(headCell);
	headCell = document.createElement('th');
	headCell.textContent = 'First Name';
	row.appendChild(headCell);
	headCell = document.createElement('th');
	headCell.textContent = 'Last Name';
	row.appendChild(headCell);
	headCell = document.createElement('th');
	headCell.textContent = 'Email';
	row.appendChild(headCell);
	headCell = document.createElement('th');
	headCell.textContent = 'Signature';
	row.appendChild(headCell);
	headCell = document.createElement('th');
	headCell.textContent = 'Department';
	row.appendChild(headCell);
	headCell = document.createElement('th');
	headCell.textContent = 'Created Date';
	row.appendChild(headCell);
	headCell = document.createElement('th');
	headCell.textContent = 'Edit';
	row.appendChild(headCell);
	headCell = document.createElement('th');
	headCell.textContent = 'Delete';
	row.appendChild(headCell);
	
	//Create table body
	var body = document.createElement('tbody');
	body.id = "tblBody";
	table.appendChild(body);
	
	//Send request to get list of users
	makeRequest('GET', "http://138.197.7.194/api/users/", null, true, getActiveDepts);
}

//Get active departments
function getActiveDepts(response){
	//Send request to get list of users
	makeRequestWithExtraParams('GET', "http://138.197.7.194/api/divisions/", null, false, true, addDataToTable, response, null);
}

//Add users data to table
function addDataToTable(deptData, response, blank){
	clearErrors();
	
	//Create dept array
	var depts = [];
	deptData.forEach(function(data){
		depts.push(data.did);
	});
	
	var row, cell, img, button;
	document.getElementById("totalNum").textContent = response.length + " Users";
	
	var body = document.getElementById("tblBody");
	
	response.forEach(function(data){
		row = document.createElement('tr');
		row.id = data.id;
		body.appendChild(row);
		
		//Add cells
		//Id
		cell = document.createElement('td');
		cell.textContent = data.id;
		row.appendChild(cell);
		
		//First name
		cell = document.createElement('td');
		cell.textContent = captialize(data.fName);
		row.appendChild(cell);
		
		//Last name
		cell = document.createElement('td');
		cell.textContent = captialize(data.lName);
		row.appendChild(cell);
		
		//Email
		cell = document.createElement('td');
		cell.textContent = data.email;
		row.appendChild(cell);
		
		//Signature
		cell = document.createElement('td');
		img = document.createElement('img');
		img.src = "http://138.197.7.194/static/" + data.signature;
		img.className = "tablePic";
		cell.appendChild(img);
		row.appendChild(cell);
		
		//Department
		cell = document.createElement('td');
		if (depts.includes(data.dept))
			cell.textContent = captialize(data.name); 
		row.appendChild(cell);
		
		//Date Created
		cell = document.createElement('td');
		var date = new Date(data.timeCreated);
		//date.setDate(date.getDate() + 1);
		cell.textContent = date.toLocaleDateString();
		row.appendChild(cell);
		
		//Edit Button
		cell = document.createElement("td");
		button = document.createElement("button");
		button.setAttribute("type", "button");
		button.innerHTML = '<span class="glyphicon glyphicon-pencil"></span>';
		button.className = "btn btn-primary";
		button.value = data.id;
		button.addEventListener('click', function(){editUser(data.id);});
		cell.appendChild(button);
		row.appendChild(cell);
		
		//Delete Button
		cell = document.createElement("td");
		var button = document.createElement("button");
		button.setAttribute("type", "button");
		button.innerHTML = '<span class="glyphicon glyphicon-trash"></span>';
		button.className = "btn btn-danger";
		button.value = data.id;
		button.addEventListener('click', function(){showConfirm(data.id);});
		cell.appendChild(button);
		
		//Create confirmation div
		var div = document.createElement("div");
		div.id = "div" + data.id;
		var par = document.createElement("p");
		par.textContent = "Confirm?";
		div.appendChild(par);
		
		//Create Yes Button
		var button = document.createElement("button");
		button.setAttribute("type","button");
		button.innerHTML = 'Yes';
		button.className = "btn btn-success";
		button.addEventListener('click', function(){deleteUser(data.id);});
		div.appendChild(button);
			
		//Create No Button
		var button = document.createElement("button");
		button.setAttribute("type","button");
		button.innerHTML = 'No';
		button.className = "btn btn-warning";
		button.addEventListener('click', function(){hideConfirm(data.id);});
		div.appendChild(button);
		
		div.style.display = "none";
		cell.appendChild(div);
		row.appendChild(cell);
	});
}

//Show confirmation division with buttons
function showConfirm(id){
	document.getElementById("div" + id).style.display = "block";
	clearErrors();
}

//Hide confirmation division with buttons
function hideConfirm(id){
	document.getElementById("div" + id).style.display = "none";
	clearErrors();
}

//Deactivate user
function deleteUser(userId){
	console.log("User id: " + userId);
	clearErrors();
	var data = new FormData();
	data.append("id", userId);
	data.append("active", 0);
	makeRequestWithExtraParams('PUT', "http://138.197.7.194/api/users/", data, false, true, aUserAcctDelResp, null, userId); 
}

//Handle response for deleting row
function aUserAcctDelResp(response, type, id){
	//Delete row if successful
	if (response.status == "success"){
		//ref: http://stackoverflow.com/questions/4967223/delete-a-row-from-a-table-by-id
		var row = document.getElementById(id);
		row.parentNode.removeChild(row);
		document.getElementById("deleteMsg").textContent = response.message;
		document.getElementById("deleteMsg").className = "goodStatus";
	}
	else{
		document.getElementById("deleteMsg").textContent = response.message;
		document.getElementById("deleteMsg").className = "badStatus";
	}
}

//Edit user
function editUser(id){
	clearErrors();
	window.location.href = 'aModifyUser.html?userId=' + id;
}

//Clear error messages
function clearErrors(){
	document.getElementById("deleteMsg").style.display = "none";
}

//Initialize Page
document.addEventListener('DOMContentLoaded', initializePage);