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
		var id = getId('user_id');
		getUserName(id);
		createTable();
	}
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
	
	//Send request to get user awards
	var id = getId('user_id');
	makeRequest('GET', "http://138.197.7.194/api/userAwards/?userId=" + id, null, true, addDataToTable);
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
		button.addEventListener('click', function(){showConfirm(data.uaid);});
		cell.appendChild(button);
		
		//Create confirmation div
		var div = document.createElement("div");
		div.id = "div" + data.uaid;
		var par = document.createElement("p");
		par.textContent = "Confirm?";
		div.appendChild(par);
		
		//Create Yes Button
		var button = document.createElement("button");
		button.setAttribute("type","button");
		button.innerHTML = 'Yes';
		button.className = "btn btn-success";
		button.addEventListener('click', function(){deleteAward(data.uaid);});
		div.appendChild(button);
			
		//Create No Button
		var button = document.createElement("button");
		button.setAttribute("type","button");
		button.innerHTML = 'No';
		button.className = "btn btn-warning";
		button.addEventListener('click', function(){hideConfirm(data.uaid);});
		div.appendChild(button);
		
		div.style.display = "none";
		cell.appendChild(div);
		row.appendChild(cell);
	});
}

//Show confirmation division with buttons
function showConfirm(uaid){
	document.getElementById("div" + uaid).style.display = "block";
}

//Hide confirmation division with buttons
function hideConfirm(uaid){
	document.getElementById("div" + uaid).style.display = "none";
}

//Delete award
function deleteAward(awardId){
	console.log("Award id: " + awardId);
	//makeRequestWithExtraParams('DELETE', "http://mockbin.org/bin/12982588-4834-49f8-985e-bdcf7842cfb8?id=" + awardId, null, true, userAcctDelAwdResp, null, awardId); //Good
	makeRequestWithExtraParams('DELETE', "http://138.197.7.194/api/userAwards/?id=" + awardId, null, true, userAcctDelAwdResp, null, awardId);
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