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
	}
}


//Departments----------------------------------------------------------
//Create department list
function createDeptList(response){
	var div = document.getElementById("deptList");
	var par;
	
	if (response.length > 1){
		response.forEach(function(data){
			par = createPar('dept', data.did, data.name, deleteDeptReq);
			div.appendChild(par);
		});
	}
	else if (response.did){
		par = createPar('dept', response.did, response.name, deleteDeptReq);
		div.appendChild(par);
	}
	else{
		//No items, create message
		par = document.createElement('p');
		par.textContent = "There are no departments for your company, add some now!";
		div.appendChild(par);
	}
}

//Create delete request to remove dept
function deleteDeptReq(obj){
	console.log(obj);
	var deptId = obj.value;
	var parts = deptId.split("-");
	if (parts.length >= 2){
		var sect = parts[0];
		var id = parts[1];
		console.log("id: " + id);
		console.log(sect + " " + id);
		makeRequestWithExtraParams('DELETE', "http://138.197.7.194/api/divisions/?id=" + id, null, true, deletePar, sect, id);
		//makeRequestWithExtraParams('DELETE', "http://mockbin.org/bin/b294d061-e572-4b37-bcd1-6c46ba272ab6?id=" + id, null, true, deletePar, sect, id);
		//makeRequestWithExtraParams('DELETE', "http://mockbin.org/bin/dffef58e-7bf9-4dd7-8f63-a3ee7d5ba0cc?id=" + id, null, true, deletePar, sect, id);
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

//Create delete request to remove award
function deleteAwardReq(obj){
	console.log(obj);
	var awardId = obj.value;
	var parts = awardId.split("-");
	if (parts.length >= 2){
		var sect = parts[0];
		var id = parts[1];
		console.log(sect + " " + id);
		makeRequestWithExtraParams('DELETE', "http://138.197.7.194/api/awards/?id=" + id, null, true, deletePar, sect, id);
		//makeRequestWithExtraParams('DELETE', "http://mockbin.org/bin/cbfd4e07-166a-4bc5-b834-c9bd16611462?id=" + id, null, true, deletePar, sect, id);
		//makeRequestWithExtraParams('DELETE', "http://mockbin.org/bin/e91012d0-c92d-4a0b-9e54-6fe3afc632b6?id=" + id, null, true, deletePar, sect, id);
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
}


//Bonuses----------------------------------------------------------
//Create bonus list
function createBonusList(response){
	var div = document.getElementById("bonusList");
	var par;
	
	if (response.length > 1){
		response.forEach(function(data){
			par = createPar('bonus', data.bid, data.amount, deleteBonusReq);
			div.appendChild(par);
		});
	}
	else if (response.bid){
		par = createPar('bonus', response.bid, response.amount, deleteBonusReq);
		div.appendChild(par);
	}
	else{
		//No items, create message
		par = document.createElement('p');
		par.textContent = "There are no bonus amounts for your company, add some now!";
		div.appendChild(par);
	}
}

//Create delete request to remove bonus
function deleteBonusReq(obj){
	console.log(obj);
	var awardId = obj.value;
	var parts = awardId.split("-");
	if (parts.length >= 2){
		var sect = parts[0];
		var id = parts[1];
		console.log(sect + " " + id);
		makeRequestWithExtraParams('DELETE', "http://138.197.7.194/api/bonuses/?id=" + id, null, true, deletePar, sect, id);
		//makeRequestWithExtraParams('DELETE', "http://mockbin.org/bin/836cc9f0-0775-489c-a491-b1d202d02fea?id=" + id, null, true, deletePar, sect, id);
		//makeRequestWithExtraParams('DELETE', "http://mockbin.org/bin/6118e0e1-1eea-4689-be96-39704eb759da?id=" + id, null, true, deletePar, sect, id);
	}

	document.getElementById("error").textContent = "";
}

//Add new bonus to list
function addBonus(){
	var data = {}
	data.amount = document.getElementById("bonus").value;
	makeRequest('POST', "http://138.197.7.194/api/bonuses/", data, true, createBonusList);
	document.getElementById("error").textContent = "";
	document.getElementById("bonus").value = "";
}


//Event Listeners
document.getElementById("deptBtn").addEventListener('click', addDept);
document.getElementById("awardBtn").addEventListener('click', addAward);
document.getElementById("bonusBtn").addEventListener('click', addBonus);

//Initialize Page
document.addEventListener('DOMContentLoaded', initializePage);