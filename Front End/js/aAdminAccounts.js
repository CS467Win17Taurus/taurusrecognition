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
	}
}

//Create table of admins
function createTable(){
	var table = document.getElementById("adminsTbl");
	
	//Delete rows from table body
	while (table.hasChildNodes())
		table.removeChild(table.firstChild);
	
	//Create table head with row
	var head = document.createElement('thead');
	table.appendChild(head);
	var row = document.createElement('tr');
	head.appendChild(row);
	
	//Create header cells
	var headCell = document.createElement('th');
	headCell.textContent = 'Id';
	row.appendChild(headCell);
	headCell = document.createElement('th');
	headCell.textContent = 'Username';
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
	
	//Send request to get list of admins
	makeRequest('GET', "http://138.197.7.194/api/admins/", null, true, addDataToTable);
}

//Add admins data to table
function addDataToTable(response){
	var adminId = getId('admin_id');
	var row, cell, button;
	var body = document.getElementById("tblBody");
	console.log("Table data:");
	console.log(response);
	
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
		cell.textContent = data.adminName;
		row.appendChild(cell);
		
		//Edit Button
		cell = document.createElement("td");
		button = document.createElement("button");
		button.setAttribute("type", "button");
		button.innerHTML = '<span class="glyphicon glyphicon-pencil"></span>';
		button.className = "btn btn-primary";
		button.value = data.id;
		button.addEventListener('click', function(){editAdmin(data.id);});
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
		if (adminId == data.id)
			button.disabled = true;
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
		button.addEventListener('click', function(){deleteAdmin(data.id);});
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
}

//Hide confirmation division with buttons
function hideConfirm(id){
	document.getElementById("div" + id).style.display = "none";
}

//Delete admin
function deleteAdmin(id){
	console.log("Admin id: " + id);
	
	makeRequestWithExtraParams('DELETE', "http://138.197.7.194/api/admins/?id=" + id, null, false, false, adminDelResp, null, id);
}

//Handle response for deleting row
function adminDelResp(response, type, id){
	//Delete row if successful
	if (response == "Admin successfully deleted"){
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

//Edit admin
function editAdmin(id){
	window.location.href = 'aModifyAdmin.html?adminId=' + id;
}

//Initialize Page
document.addEventListener('DOMContentLoaded', initializePage);