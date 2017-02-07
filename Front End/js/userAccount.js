/*Taurus Employee Recognition
General functions to support front end
User account page to view past awards and delete
*/

//Initialize page
function initializePage(){
	//Check user is logged in
	if (!checkLogIn('user_id')){
		window.location.href = 'index.html';
	}
	else{
		console.log("Logged in = true");
		getUserName();
		createTable();
	}
}

//Get user's name for header
function getUserName(){
	var id = getId('user_id');
	makeRequest('GET', "http://mockbin.org/bin/b7509746-76ca-43c3-aeea-8bc0ce25d9fa?id=" + id, null, true, userAcctGetNameResp);
}

//Handle get user name response
function userAcctGetNameResp(response){
	document.getElementById("userName").textContent = response.fName;
}

//Create table of past awards
function createTable(){
	var table = document.getElementById("awardsTbl");
	
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
	headCell.textContent = 'Date';
	row.appendChild(headCell);
	headCell = document.createElement('th');
	headCell.textContent = 'Recipient';
	row.appendChild(headCell);
	headCell = document.createElement('th');
	headCell.textContent = 'Type';
	row.appendChild(headCell);
	headCell = document.createElement('th');
	headCell.textContent = 'Amount';
	row.appendChild(headCell);
	headCell = document.createElement('th');
	headCell.textContent = 'Delete';
	row.appendChild(headCell);
	
	//Create table body
	var body = document.createElement('tbody');
	body.id = "tblBody";
	table.appendChild(body);
	
	//Send request
	var id = getId('user_id');
	makeRequest('GET', "http://mockbin.org/bin/34d688d0-3d0b-45a2-863a-37443538bb4d?userId=" + id, null, true, addDataToTable);
}

//Add awards data to table
function addDataToTable(response){
	var row, cell, button;
	var body = document.getElementById("tblBody");
	
	response.forEach(function(data){
		row = document.createElement('tr');
		row.id = data.uaid;
		body.appendChild(row);
		
		//Add cells
		//Id
		cell = document.createElement('td');
		cell.textContent = data.uaid;
		row.appendChild(cell);
		
		//Date
		cell = document.createElement('td');
		cell.textContent = data.awardDate;
		row.appendChild(cell);
		
		//Recipient
		cell = document.createElement('td');
		cell.textContent = data.recipientFName + " " + data.recipientLName;
		row.appendChild(cell);
		
		//Type
		cell = document.createElement('td');
		cell.textContent = data.awardTitle;
		row.appendChild(cell);
		
		//Amount
		cell = document.createElement('td');
		cell.textContent = "$" + data.bonusAmount;
		row.appendChild(cell);
		
		//Delete Button
		cell = document.createElement("td");
		button = document.createElement("button");
		button.setAttribute("type", "button");
		button.innerHTML = '<span class="glyphicon glyphicon-trash"></span>';
		button.className = "btn btn-danger";
		button.value = data.uaid;
		button.addEventListener('click', function(){showModal(this);});
		cell.appendChild(button);
		row.appendChild(cell);
	});
}

//Show confirmation modal
function showModal(uaid){
	$('#modal1').modal('show');
	var awardId = uaid.value;
	document.getElementById("submit").addEventListener('click', function(){deleteAward(awardId)});
	document.getElementById("deleteMsg").textContent = "";
}

//Delete award
function deleteAward(awardId){
	console.log("Award id: " + awardId);
	makeRequestWithExtraParams('DELETE', "http://mockbin.org/bin/12982588-4834-49f8-985e-bdcf7842cfb8?id=" + awardId, null, true, userAcctDelAwdResp, null, awardId); //Good
	//makeRequestWithExtraParams('DELETE', "http://mockbin.org/bin/a664f0ad-eec0-4fa5-90a9-80a51738d197?id=" + awardId, null, true, userAcctDelAwdResp, null, awardId); //Bad
}

//Handle response for deleting row
function userAcctDelAwdResp(response, type, id){
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

//Initialize Page
document.addEventListener('DOMContentLoaded', initializePage);