/*Taurus Employee Recognition
General functions to support front end
Company options
*/

//Create par item for list
function createPar(sect, id, name, deleteFunc){
	par = document.createElement('p');
	par.id = sect + id;
	
	//Create button and attach event listener
	var button = document.createElement('button');
	button.className = "close pull-left closeBtn";
	button.value = sect + "-" + id;
	button.addEventListener('click', function(){deleteFunc(this);});
	button.innerHTML = "&times;";
	par.appendChild(button);
	
	//Create span
	var span = document.createElement('span');
	span.className = "optionItem";
	span.innerHTML = "&nbsp&nbsp" + name;
	par.appendChild(span);
	
	return par;
}

//Delete list item in section
function deletePar(data, sect, id){
	console.log(sect + "" + id);
	var par = document.getElementById(sect + "" + id);
	
	if (data.status == "success"){
		par.parentNode.removeChild(par);
	}
	else{
		document.getElementById("error").textContent = "Error: " + data.message;
		document.getElementById("error").className = "badStatus";
	}
}

//Initialize page
function initializePage(){
	
	//Check user is logged in
	if (!checkLogIn('admin_id')){
		window.location.href = 'index.html';
	}
	else{
		console.log("Logged in = true");
		makeRequest('GET', "http://138.197.7.194/api/divisions/", null, true, createDeptList);
		makeRequest('GET', "http://138.197.7.194/api/awards/", null, true, createAwardList);
		makeRequest('GET', "http://138.197.7.194/api/bonuses/", null, true, createBonusList);
		clearErrors();
	}
}


//Departments----------------------------------------------------------
//Create department list
function createDeptList(response){
	var div = document.getElementById("deptList");
	var par;
	
	if (response.length > 1){
		response.forEach(function(data){
			par = createPar('dept', data.did, captialize(data.name), deleteDeptReq);
			div.appendChild(par);
		});
	}
	else if (response.did){
		par = createPar('dept', response.did, captialize(response.name), deleteDeptReq);
		div.appendChild(par);
	}
	else{
		//No items, create message
		par = document.createElement('p');
		par.textContent = "There are no departments for your company, add some now!";
		div.appendChild(par);
	}
}

//Create put request to deactivate dept
function deleteDeptReq(obj){
	console.log(obj);
	clearErrors();
	var deptId = obj.value;
	var parts = deptId.split("-");
	if (parts.length >= 2){
		var sect = parts[0];
		var id = parts[1];
		
		var data = new FormData();
		data.append("id", id);
		console.log("id: " + id);
		console.log(sect + " " + id);
		makeRequestWithExtraParams('PUT', "http://138.197.7.194/api/divisions/", data, false, true, deletePar, sect, id);
	}

	document.getElementById("error").textContent = "";
}

//Add new dept to list
function addDept(){
	var data = {}
	data.name = document.getElementById("dept").value;
	makeRequest('POST', "http://138.197.7.194/api/divisions/", data, true, createDeptList);
	document.getElementById("error").textContent = "";
	document.getElementById("dept").value = "";
	clearErrors();
}

//Awards----------------------------------------------------------
//Create award list
function createAwardList(response){
	var div = document.getElementById("awardList");
	var par;
	
	if (response.length > 1){
		response.forEach(function(data){
			par = createPar('award', data.aid, data.title, deleteAwardReq);
			div.appendChild(par);
		});
	}
	else if (response.aid){
		par = createPar('award', response.aid, response.title, deleteAwardReq);
		div.appendChild(par);
	}
	else{
		//No items, create message
		par = document.createElement('p');
		par.textContent = "There are no award types for your company, add some now!";
		div.appendChild(par);
	}
}

//Create put request to deactivate award
function deleteAwardReq(obj){
	console.log(obj);
	clearErrors();
	var awardId = obj.value;
	var parts = awardId.split("-");
	if (parts.length >= 2){
		var sect = parts[0];
		var id = parts[1];
		console.log(sect + " " + id);
		
		var data = new FormData();
		data.append("id", id);
		makeRequestWithExtraParams('PUT', "http://138.197.7.194/api/awards/", data, false, true, deletePar, sect, id);
	}

	document.getElementById("error").textContent = "";
}

//Add new award to list
function addAward(){
	var data = {}
	data.title = document.getElementById("award").value;
	makeRequest('POST', "http://138.197.7.194/api/awards/", data, true, createAwardList);
	document.getElementById("error").textContent = "";
	document.getElementById("award").value = "";
	clearErrors();
}


//Bonuses----------------------------------------------------------
//Create bonus list
function createBonusList(response){
	var div = document.getElementById("bonusList");
	var par;
	
	if (response.length > 1){
		response.forEach(function(data){
			par = createPar('bonus', data.bid, "$" + data.amount, deleteBonusReq);
			div.appendChild(par);
		});
	}
	else if (response.bid){
		par = createPar('bonus', response.bid, "$" + response.amount, deleteBonusReq);
		div.appendChild(par);
	}
	else{
		//No items, create message
		par = document.createElement('p');
		par.textContent = "There are no bonus amounts for your company, add some now!";
		div.appendChild(par);
	}
}

//Create put request to deactivate bonus
function deleteBonusReq(obj){
	console.log(obj);
	clearErrors();
	var awardId = obj.value;
	var parts = awardId.split("-");
	if (parts.length >= 2){
		var sect = parts[0];
		var id = parts[1];
		console.log(sect + " " + id);
		
		var data = new FormData();
		data.append("id", id);
		makeRequestWithExtraParams('PUT', "http://138.197.7.194/api/bonuses/", data, false, true, deletePar, sect, id);
	}

	document.getElementById("error").textContent = "";
}

//Add new bonus to list
function addBonus(){
	clearErrors();
	var data = {}
	data.amount = document.getElementById("bonus").value;
	
	if (data.amount > 0){
		makeRequest('POST', "http://138.197.7.194/api/bonuses/", data, true, createBonusList);
		document.getElementById("error").textContent = "";
		document.getElementById("bonus").value = "";
	}
	else
		document.getElementById("bonusError").style.display = "block";
	
}

//Clear errors
function clearErrors(){
	document.getElementById("bonusError").style.display = "none";
}


//Event Listeners
document.getElementById("deptBtn").addEventListener('click', addDept);
document.getElementById("awardBtn").addEventListener('click', addAward);
document.getElementById("bonusBtn").addEventListener('click', addBonus);

//Initialize Page
document.addEventListener('DOMContentLoaded', initializePage);