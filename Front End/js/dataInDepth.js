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

//Clear filters
function clearFilters(){
	console.log("clear filters");
	
	document.getElementById("giver").value = 0;
	document.getElementById("type").value = 0;
	document.getElementById("amount").value = 0;
	document.getElementById("dept").value = 0;
	$("#dateFromPickertop").datepicker("clearDates");
	$("#dateToPickertop").datepicker("clearDates");
	updateChart();
}

//Event Listeners
document.getElementById("topRefresh").addEventListener('click', updateChart);
document.getElementById("remove").addEventListener('click', clearFilters);

//Initialize Page
document.addEventListener('DOMContentLoaded', initializePage);