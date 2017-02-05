/*Taurus Employee Recognition
General functions to support front end
User account page to view past awards and delete
*/

var awardId = -1;

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
	//Create and send request
	var req = new XMLHttpRequest();
	var data = new FormData();
	var id = getId('user_id');
	data.append("id", id);
	
	req.open('GET', "http://mockbin.org/bin/b7509746-76ca-43c3-aeea-8bc0ce25d9fa?id=" + id, true);
	req.addEventListener('load', function(){
		//Check for error message
		if (req.status >= 200 && req.status < 400)
		{
			var response = JSON.parse(req.responseText);
			console.log(response);
			document.getElementById("userName").textContent = response.fName;
		}
		else
			console.log("Error in network request: " + req.StatusText);
	});
	req.send(data);
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
	table.appendChild(body);
	
	//Create and send request
	var req = new XMLHttpRequest();
	var data = new FormData();
	var id = getId('user_id');
	data.append("id", id);
	
	req.open('GET', "http://mockbin.org/bin/34d688d0-3d0b-45a2-863a-37443538bb4d?userId=" + id, true);
	req.addEventListener('load', function(){
		//Check for error message
		if (req.status >= 200 && req.status < 400)
		{
			var response = JSON.parse(req.responseText);
			console.log(response);
			addDataToTable(body, response);
		}
		else
			console.log("Error in network request: " + req.StatusText);
	});
	req.send(data);
}

//Add awards data to table
function addDataToTable(body, response){
	var row, cell, button;
	
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
	awardId = uaid.value;
	document.getElementById("deleteMsg").textContent = "";
}

//Delete award
function deleteAward(){
	console.log("Award id: " + awardId);
	//Create and send request
	var req = new XMLHttpRequest();
	
	req.open('GET', "http://mockbin.org/bin/8f4dfb8a-aae0-4b9e-aed1-84bc391722ad?id=" + awardId, true); //Good
	//req.open('GET', "http://mockbin.org/bin/1bb346bc-b687-470c-88d3-4fbdb1ca3e9b?id=" + awardId, true); //Good
	req.addEventListener('load', function(){
		//Check for error message
		if (req.status >= 200 && req.status < 400)
		{
			var response = JSON.parse(req.responseText);
			console.log(response);
			
			//Delete row if successful
			if (response.status == "success"){
				//ref: http://stackoverflow.com/questions/4967223/delete-a-row-from-a-table-by-id
				var row = document.getElementById(awardId);
				row.parentNode.removeChild(row);
				document.getElementById("deleteMsg").textContent = response.message;
				document.getElementById("deleteMsg").className = "goodStatus";
			}
			else{
				document.getElementById("deleteMsg").textContent = response.message;
				document.getElementById("deleteMsg").className = "badStatus";
			}
				
		}
		else
			console.log("Error in network request: " + req.StatusText);
	});
	req.send();
}

//Initialize Page
document.addEventListener('DOMContentLoaded', initializePage);