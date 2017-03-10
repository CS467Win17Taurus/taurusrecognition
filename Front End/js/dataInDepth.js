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
	/*console.log("User array data");
	console.log(userNames);
	console.log(userIds);
	console.log(giversNum);
	console.log(giversAmount);
	console.log(receiversNum);
	console.log(receiversAmount);*/
	
	//Get toggle value for data in-depth page
	var toggleOpt = document.getElementById('topToggle').checked;

	//Find max and display
	if (toggleOpt){
		//Find max
		var maxGiver = giversNum[0], giverIndex = 0;
		var maxReceiver = receiversNum[0], receiverIndex = 0;
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
		
		//Get Names
		var countGiver = 0, countReceiver = 0;
		var giverStr = "", receiverStr = "";
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
		
		document.getElementById("topGiver").innerHTML = giverStr;
		document.getElementById("topReceiver").innerHTML = receiverStr;
	}
	else{
		//Find max
		var maxGiver = giversAmount[0], giverIndex = 0;
		var maxReceiver = receiversAmount[0], receiverIndex = 0;
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
		
		//Get Names
		var countGiver = 0, countReceiver = 0;
		var giverStr = "", receiverStr = "";
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
		
		document.getElementById("topGiver").innerHTML = giverStr;
		document.getElementById("topReceiver").innerHTML = receiverStr;
	}
	
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

//Event Listeners
document.getElementById("topRefresh").addEventListener('click', updateChart);
document.getElementById("remove").addEventListener('click', clearFilters);

//Initialize Page
document.addEventListener('DOMContentLoaded', initializePage);