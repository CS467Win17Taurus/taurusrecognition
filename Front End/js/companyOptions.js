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
		document.getElementById(sect + "Error").textContent = "Error: " + data.message;
		document.getElementById(sect + "Error").className = "badStatus";
		document.getElementById(sect + "Error").style.display = "block";
	}
}

//Edit list
function editList(response, name, entity){
	var div = document.getElementById(entity + "List");
	var par;
	
	if (response.status == "success" || response.active == 1){
		getEntityId(entity, name);
	}
	else{
		//No items, display error message
		document.getElementById(entity + "Error").textContent = response.message;
		document.getElementById(entity + "Error").className = "badStatus";
		document.getElementById(entity + "Error").style.display = "block";
	}
}

//Get id for entity
function getEntityId(entity, name){
	if (entity == "dept")
		var queryStr = "divisions/";
	else if (entity == "award")
		var queryStr = "awards/";
	else if (entity == "bonus")
		var queryStr = "bonuses/";
	makeRequestWithExtraParams('GET', "http://138.197.7.194/api/" + queryStr, null, false, true, handleEntityIdResponse, name, entity);
}

//Handle response for entity id
function handleEntityIdResponse(response, name, entity){	
	//Find id for name, format name, and create par
	var id = -1;
	var nameStr;
	console.log("In handle entity id response, name = " + name + ", entity = " + entity);
	console.log(response);
	response.forEach(function(data){
		if (entity == "dept"){
			if (data.name.toLowerCase() == name.toLowerCase())
				id = data.did;
			nameStr = captialize(name);
			par = createPar(entity, id, nameStr, deleteDeptReq);
		}
		else if (entity == "award"){
			if (data.title.toLowerCase() == name.toLowerCase())
				id = data.aid;
			nameStr = captialize(name);
			par = createPar(entity, id, nameStr, deleteAwardReq);
		}
		else if (entity == "bonus"){
			if (data.amount == name)
				id = data.bid;
			nameStr = "$" + name;
			par = createPar(entity, id, nameStr, deleteBonusReq);
		}
	});
	
	//Create new list item
	var div = document.getElementById(entity + "List");
	div.appendChild(par);
}

//Initialize page
function initializePage(){
	
	//Check user is logged in
	if (!checkLogIn('admin_id')){
		window.location.href = 'index.html';
	}
	else{
		console.log("Logged in = true");
		clearErrors();
		makeRequest('GET', "http://138.197.7.194/api/divisions/", null, true, createDeptList);
		makeRequest('GET', "http://138.197.7.194/api/awards/", null, true, createAwardList);
		makeRequest('GET', "http://138.197.7.194/api/bonuses/", null, true, createBonusList);
	}
}


//Departments----------------------------------------------------------
//Create department list
function createDeptList(response){
	var div = document.getElementById("deptList");
	var par;
	
	if (response.length >= 1){
		response.forEach(function(data){
			par = createPar('dept', data.did, captialize(data.name), deleteDeptReq);
			div.appendChild(par);
		});
	}
	else{
		//No items, create message
		document.getElementById("deptError").textContent = "There are no departments for your company, add some now!";
		document.getElementById("deptError").className = "goodStatus";
		document.getElementById("deptError").style.display = "block";
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
}

//Add new dept to list
function addDept(){
	var data = {}
	data.name = document.getElementById("dept").value;
	makeRequestWithExtraParams('POST', "http://138.197.7.194/api/divisions/", data, true, true, editList, data.name, "dept");
	document.getElementById("dept").value = "";
	clearErrors();
}

//Awards----------------------------------------------------------
//Create award list
function createAwardList(response){
	var div = document.getElementById("awardList");
	var par;
	
	if (response.length >= 1){
		response.forEach(function(data){
			par = createPar('award', data.aid, data.title, deleteAwardReq);
			div.appendChild(par);
		});
	}
	else{
		//No items, create message
		document.getElementById("awardError").textContent = "There are no award types for your company, add some now!";
		document.getElementById("awardError").className = "goodStatus";
		document.getElementById("awardError").style.display = "block";
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
}

//Add new award to list
function addAward(){
	var data = {}
	data.title = document.getElementById("award").value;
	makeRequestWithExtraParams('POST', "http://138.197.7.194/api/awards/", data, true, true, editList, data.title, "award");
	document.getElementById("award").value = "";
	clearErrors();
}


//Bonuses----------------------------------------------------------
//Create bonus list
function createBonusList(response){
	var div = document.getElementById("bonusList");
	var par;
	
	if (response.length >= 1){
		response.forEach(function(data){
			par = createPar('bonus', data.bid, "$" + data.amount, deleteBonusReq);
			div.appendChild(par);
		});
	}
	else{
		//No items, create message
		document.getElementById("bonusError").textContent = "There are no bonus amounts for your company, add some now!";
		document.getElementById("bonusError").className = "goodStatus";
		document.getElementById("bonusError").style.display = "block";
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
}

//Add new bonus to list
function addBonus(){
	clearErrors();
	var data = {}
	data.amount = document.getElementById("bonus").value;
	
	if (data.amount > 0){
		makeRequestWithExtraParams('POST', "http://138.197.7.194/api/bonuses/", data, true, true, editList, data.amount, "bonus");
		document.getElementById("bonus").value = "";
	}
	else
		document.getElementById("bonusError").style.display = "block";
		document.getElementById("bonusError").textContent = "Error: Please make sure the bonus amount is positive";
		document.getElementById("bonusError").className = "badStatus";
	
}

//Clear errors
function clearErrors(){
	document.getElementById("bonusError").style.display = "none";
	document.getElementById("awardError").style.display = "none";
	document.getElementById("deptError").style.display = "none";
}


//Event Listeners
document.getElementById("deptBtn").addEventListener('click', addDept);
document.getElementById("awardBtn").addEventListener('click', addAward);
document.getElementById("bonusBtn").addEventListener('click', addBonus);

//Initialize Page
document.addEventListener('DOMContentLoaded', initializePage);