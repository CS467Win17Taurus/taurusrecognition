/*Taurus Employee Recognition
General functions to support front end
Data In Depth
*/

//initialize page
function initializePage(){
	//Check user is logged in
	if (!checkLogIn('admin_id')){
		window.location.href = 'index.html';
	}
	else{
		console.log("Logged in = true");
		$('#topToggle').bootstrapToggle('on');
		
		updateChart();
		
		//Populate filters
		getOptionData('type');
		getOptionData('amount');
		getOptionData('dept');
		getOptionData('giver');
		getOptionData('user');
	}
}

//Populate selection menus
//Get data
function getOptionData(type){
	var queryStr = "";
	
	switch (type){
		case 'type':
			queryStr = "awards/";
			break;
		case 'amount':
			queryStr = "bonuses/";
			break;
		case 'dept':
			queryStr = "divisions/";
			break;
		case 'giver':
		case 'user':
			queryStr = "users/";
			break;
	}
	
	makeRequestWithExtraParams('GET', "http://138.197.7.194/api/" + queryStr, null, false, true, addOptionsToMenu, type, null);
}

//Add options to menu
function addOptionsToMenu(response, type, blank){
	var id, sel, str, name, lastName;

	response.forEach(function(data){
		//Reference: http://stackoverflow.com/a/6194450
		switch (type){
		case 'type':
			id = data.aid;
			str = data.title;
			break;
		case 'amount':
			id = data.bid;
			str = '$' + data.amount;
			break;
		case 'dept':
			id = data.did;
			str = captialize(data.name);	
			break;
		case 'giver':
		case 'user':
			id = data.id;
			str = captialize(data.fName) + ' ' + captialize(data.lName);
			break;
	}
		sel = document.getElementById(type);
		opt = document.createElement("option");
		sel.add(new Option(str, id));
	});
}

//Update chart with filter criteria
function updateChart(){
	var queryStr = "";
	var type = document.getElementById("type").value;
	var amount = document.getElementById("amount").value;
	var dept = document.getElementById("dept").value;
	var giver = document.getElementById("giver").value;
	var numParams = 0;
	
	if (type != 0){
		queryStr += numParams > 0 ? "&" : "?";
		queryStr += "awardId=" + type;
		numParams++;
	}
	if (amount != 0){
		queryStr += numParams > 0 ? "&" : "?";
		queryStr += "bonusId=" + amount;
		numParams++;
	}
	if (dept != 0){
		queryStr += numParams > 0 ? "&" : "?";
		queryStr += "deptId=" + dept;
		numParams++;
	}
	if (giver != 0){
		queryStr += numParams > 0 ? "&" : "?";
		queryStr += "userId=" + giver;
	}
	
	console.log("Query string: " + queryStr);
	makeRequestWithExtraParams('GET', "http://138.197.7.194/api/userAwards/" + queryStr, null, false, true, filterData, 'top', null);
}

//Get user stats
function getUserStats(userData, awardData, blank){
	//Create user arrays to sum totals
	var userNames = [];
	var userIds = [];
	var giversNum = [];
	var giversAmount = []
	var receiversNum = [];
	var receiversAmount = [];
	
	userData.forEach(function(data){
		//Get user data arrays
		userNames.push(captialize(data.fName) + " " + captialize(data.lName));
		userIds.push(data.id);
		
		//Initialize counter arrays
		giversNum.push(0);
		giversAmount.push(0);
		receiversNum.push(0);
		receiversAmount.push(0);
	});
	
	//Calculate totals
	var giverIndex, receiverIndex;
	awardData.forEach(function(aData){
		giverIndex = userIds.indexOf(aData.giverId);
		receiverIndex = userIds.indexOf(aData.receiverId);
		if (giverIndex != -1){
			giversNum[giverIndex] += 1;
			giversAmount[giverIndex] += aData.bonus;
		}
		if (receiverIndex != -1){
			receiversNum[receiverIndex] += 1;
			receiversAmount[receiverIndex] += aData.bonus;
		}
	});
	
	//Get toggle value for data in-depth page
	var toggleOpt = document.getElementById('topToggle').checked;

	var giverStr = "", receiverStr = "";
	var countGiver = 0, countReceiver = 0, giverIndex = 0, receiverIndex = 0;
	//If no awards returned, print blanks for summary
	console.log("Award data");
	console.log(awardData);
	if (awardData.length == 0){
		giverStr = "--";
		receiverStr = "--";
	}
	//Find max and display
	else{
		if (toggleOpt){
			//Find max for number
			var maxGiver = giversNum[0];
			var maxReceiver = receiversNum[0];
			for (var i = 1; i < userIds.length; i++){
				if (giversNum[i] > maxGiver){
					maxGiver = giversNum[i];
					giverIndex = i;
				}
				if (receiversNum[i] > maxReceiver){
					maxReceiver = receiversNum[i];
					receiverIndex = i;
				}
			}
			
			//Get Names for number
			for (var i = 0; i < userIds.length; i++){
				
				if (giversNum[i] == maxGiver){
					if (countGiver > 0)
						giverStr += "<br>";
					giverStr += userNames[i] + " (" + maxGiver + ")";
					countGiver++;
				}
				
				if (receiversNum[i] == maxReceiver){
					if (countReceiver > 0)
						receiverStr += "<br>";
					receiverStr += userNames[i] + " (" + maxReceiver + ")";
					countReceiver++;
				}
			}		
		}
		else{
			//Find max for amount
			var maxGiver = giversAmount[0];
			var maxReceiver = receiversAmount[0];
			for (var i = 1; i < userIds.length; i++){
				if (giversAmount[i] > maxGiver){
					maxGiver = giversAmount[i];
					giverIndex = i;
				}
				if (receiversAmount[i] > maxReceiver){
					maxReceiver = receiversAmount[i];
					receiverIndex = i;
				}
			}
			
			//Get Names for amount
			for (var i = 0; i < userIds.length; i++){
				if (giversAmount[i] == maxGiver){
					if (countGiver > 0)
						giverStr += "<br>";
					giverStr += userNames[i] + " ($" + maxGiver + ")";
					countGiver++;
				}
				if (receiversAmount[i] == maxReceiver){
					if (countReceiver > 0)
						receiverStr += "<br>";
					receiverStr += userNames[i] + " ($" + maxReceiver + ")";
					countReceiver++;
				}
			}
		}
	}
	
	document.getElementById("topGiver").innerHTML = giverStr;
	document.getElementById("topReceiver").innerHTML = receiverStr;
}

//Clear filters
function clearFilters(){
	console.log("clear filters");
	
	document.getElementById("giver").value = 0;
	document.getElementById("type").value = 0;
	document.getElementById("amount").value = 0;
	document.getElementById("dept").value = 0;
	$("#dateFromPickertop").datepicker("clearDates");
	$("#dateToPickertop").datepicker("clearDates");
	$('#topToggle').bootstrapToggle('on');
	updateChart();
}

//Create table of past awards
function createTable(){
	var table = document.getElementById("awardsTbl");
	
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
	
	//Create table body
	var body = document.createElement('tbody');
	body.id = "tblBody";
	table.appendChild(body);
	
	//Send request to get user awards
	var id = document.getElementById("user").value;
	makeRequest('GET', "http://138.197.7.194/api/userAwards/?userId=" + id, null, true, addDataToTable);
}

//Add awards data to table
function addDataToTable(response){
	var row, cell, button;
	document.getElementById("totalTblNum").textContent = response.length + " Total Awards Given";
	
	var body = document.getElementById("tblBody");
	
	//Create start of data array for csv file
	var dataArr = [["Id", "Date", "Recipient", "Type", "Amount"]];
	var dataTmpArr = [];
	
	response.forEach(function(data){
		row = document.createElement('tr');
		row.id = data.uaid;
		body.appendChild(row);
		
		//Add cells
		//Id
		cell = document.createElement('td');
		cell.textContent = data.uaid;
		dataTmpArr.push(data.uaid);
		row.appendChild(cell);
		
		//Date
		cell = document.createElement('td');
		var date = new Date(data.awardDate);
		date.setDate(date.getDate() + 1);
		cell.textContent = date.toLocaleDateString();
		dataTmpArr.push(date.toLocaleDateString());
		row.appendChild(cell);
		
		//Recipient
		cell = document.createElement('td');
		cell.textContent = captialize(data.recipientFName) + " " + captialize(data.recipientLName);
		dataTmpArr.push(captialize(data.recipientFName) + " " + captialize(data.recipientLName));
		row.appendChild(cell);
		
		//Type
		cell = document.createElement('td');
		cell.textContent = data.awardTitle;
		dataTmpArr.push(data.awardTitle);
		row.appendChild(cell);
		
		//Amount
		cell = document.createElement('td');
		cell.textContent = "$" + data.bonusAmount;
		dataTmpArr.push("$" + data.bonusAmount);
		row.appendChild(cell);
		
		dataArr.push(dataTmpArr);
		dataTmpArr = [];
	});
	
	//Create csv data
	//Ref: http://stackoverflow.com/questions/17836273/export-javascript-data-to-csv-file-without-server-interaction
	var csvData = [];
	console.log("Data arr for csv");
	console.log(dataArr);
	for (var i = 0; i < dataArr.length; i++)
		csvData.push(dataArr[i] + ',');
	var csvText = csvData.join("\r\n");
	console.log("CSV text:");
	console.log(csvText);
	
	//Delete prior button from div
	var downloadDiv = document.getElementById("downloadDiv");
	while (downloadDiv.hasChildNodes())
		downloadDiv.removeChild(downloadDiv.firstChild);
	
	//Create download button
	var btn = document.createElement('a');
	btn.innerHTML = '<button id="download" class="btn btn-info"><span class="glyphicon glyphicon-download"></span> Download</button>';
	btn.href = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csvText);
	btn.target = '_blank';
	btn.download = "awardsData.csv";
	downloadDiv.append(btn);
}

//Event Listeners
document.getElementById("topRefresh").addEventListener('click', updateChart);
document.getElementById("remove").addEventListener('click', clearFilters);
document.getElementById("user").addEventListener('change', createTable);

//Initialize Page
document.addEventListener('DOMContentLoaded', initializePage);