/*Taurus Employee Recognition
General functions to support front end
Analytics dashboard
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
		document.getElementById('midAmt').textContent = "$ -";
		document.getElementById('midNum').textContent = "--";
		document.getElementById('botAmt').textContent = "$ -";
		document.getElementById('botNum').textContent = "--";
		
		document.getElementById("midError").style.display = "none";
		document.getElementById("botError").style.display = "none";
		
		updateTopChart();
		createEmptyPieChart();
		createEmptyBarChart();
	}
}

//Update top section chart
function updateTopChart(){
	makeRequestWithExtraParams('GET', "http://138.197.7.194/api/userAwards/", null, false, true, filterData, 'top', null);
}

//Update selection chart
function updateSelectChart(sect){
	//Get selection
	var validateFlag = true;
	var selectOpt = document.getElementById('select' + sect).value;
	console.log("Select Opt: " + selectOpt);
	if (selectOpt == " "){
		document.getElementById(sect + "Error").style.display = "block";
		validateFlag = false;
	}
	
	//If selection made, get data to make dataset objects
	var queryStr = "";
	if (validateFlag){
		//Get data field
		if (selectOpt == 'award')
			queryStr = "awards/";
		else if (selectOpt == 'bonus')
			queryStr = "bonuses/";
		else if (selectOpt == 'dept')
			queryStr = "divisions/";
	
		makeRequestWithExtraParams('GET', "http://138.197.7.194/api/" + queryStr + "?action=getall", null, false, true, createDatasetObjs, sect, null);
	}
}

//Create dataset objects
function createDatasetObjs(dataIn, sect, blank){
	var labels = [];
	var theData, theId;
	
	//Get selection
	var selectOpt = document.getElementById('select' + sect).value;
	console.log("Select Opt: " + selectOpt);
	
	//Make dataset objects and get data
	var title = document.getElementById(sect + 'Title');
	dataIn.forEach(function(data){
		//Get data field
		if (selectOpt == 'award'){
			theData = data.title;	
			theId = data.aid;
			title.textContent = "Total Number of each Award Type Given";
		}
		else if (selectOpt == 'bonus'){
			theData = '$' + data.amount;
			theId = data.bid;
			title.textContent = "Total Amount of each Bonus Amount Given";
		}
		else if (selectOpt == 'dept'){
			theData = data.name;
			theId = data.did;
			title.textContent = "Total Number of Awards Received in each Department";
		}
		
		//Add dataset object
		labels.push(new dataObj(theData, theId));
	});
	
	makeRequestWithExtraParams('GET', "http://138.197.7.194/api/userAwards/", null, false, true, filterData, sect, labels);
}

//Create bar Chart
//Ref: chart.js documentation
function createBarChart(dataIn, sect, labels){
	//Remove current chart
	var div = document.getElementById(sect + "ChartDiv");
	while (div.hasChildNodes())
		div.removeChild(div.firstChild);
	
	//Add new chart
	var chart = document.createElement("canvas");
	chart.id = sect + 'Chart';
	chart.height = "100";
	chart.width = "400";
	div.appendChild(chart);
	
	console.log(dataIn);
	document.getElementById(sect + "Error").style.display = "none";

	//Update numbers
	calculateTotals(dataIn, sect);
	
	//Get label from selection
	var selectOpt = document.getElementById('select' + sect).value;
	console.log("Select Opt: " + selectOpt);
	
	//Data id array
	var dataIdArr = [];
	labels.forEach(function(lbl){
		dataIdArr.push(lbl.id);
	});

	//Initialize variables
	var tmpData = [];
	for (i = 0; i < labels.length; i++)
		tmpData.push(0);

	var compareDate = "Jan-1977";
	var index = 1;
	var newMonthFlag;
	var labelArr = [];
	
	dataIn.forEach(function(data){
		//Get id
		if (selectOpt == 'award')
			theData = data.awardId;	
		else if (selectOpt == 'bonus')
			theData = data.bonusId;
		else if (selectOpt == 'dept')
			theData = data.deptId;
		
		//Get data label and add to array
		var date = new Date(data.date);
		var dateLbl = getMonthStr(date.getMonth() + 1) + "-" + date.getFullYear();
		if (!labelArr.includes(dateLbl))
			labelArr.push(dateLbl);
		
		//Determine if new month
		if (compareDate != dateLbl)
			newMonthFlag = true;
		else
			newMonthFlag = false;
		
		//Add data to datasets
		if (newMonthFlag && (index != 1)){
			var i = 0;
			labels.forEach(function(lbl){
				lbl.data.push(tmpData[i]);
				i++;
			});
			
			//Reset tmp data
			tmpData.length = 0;
			for (i = 0; i < labels.length; i++)
				tmpData.push(0);
		}
			
		//Increment current data
		if (selectOpt == 'bonus')
			tmpData[dataIdArr.indexOf(theData)] = tmpData[dataIdArr.indexOf(theData)] + data.bonus;
		else
			tmpData[dataIdArr.indexOf(theData)] = tmpData[dataIdArr.indexOf(theData)] + 1;
		
		//Add last data
		if (index == dataIn.length){
			var i = 0;
			labels.forEach(function(lbl){
				lbl.data.push(tmpData[i]);
				i++;
			});
		}
		
		compareDate = dateLbl;
		index++;
	});
	console.log("Label array:");
	console.log(labelArr);
	
	//Create dataset from data objects
	var datasetArr = [];
	var sum;
	var colorCount = 0;
	labels.forEach(function(lbl){
		//Sum to see if dataset contains any nonzero data
		sum = 0;
		lbl.data.forEach(function(pt){
			sum += pt;
		});
		
		//Add dataset object
		if (sum > 0){
			datasetArr.push(new datasetObj(lbl.label, fillColors[colorCount], lbl.data));
			colorCount++;
		}
		
		//If at end of fill color array, reset to index 0
		if (colorCount == fillColors.length)
			colorCount = 0;
	});
	console.log("Datasets:");
	console.log(datasetArr);
	
	//Create chart
	//Ref for colors: https://www.w3schools.com/CSSref/tryit.asp?filename=trycss_color_rgba
	//Ref for multiple bars: http://stackoverflow.com/questions/28180871/grouped-bar-charts-in-chart-js
	var myChart = new Chart(chart, {
		type: 'bar',
		data: {
			labels: labelArr,
			datasets: datasetArr
		},
		options: {
			multiTooltipTemplate: "<%= label %> - <%= value %>",
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero:true
					}
				}]
			}
		}
	});
}

//Create pie Chart
//Ref: chart.js documentation
function createPieChart(dataIn, sect, labels){
	//Remove current chart
	var div = document.getElementById(sect + "ChartDiv");
	while (div.hasChildNodes())
		div.removeChild(div.firstChild);
	
	//Add new chart
	var chart = document.createElement("canvas");
	chart.id = sect + 'Chart';
	chart.height = "100";
	chart.width = "400";
	div.appendChild(chart);
	
	console.log(dataIn);
	document.getElementById(sect + "Error").style.display = "none";

	//Update numbers
	calculateTotals(dataIn, sect);
	
	//Get label from selection
	var selectOpt = document.getElementById('select' + sect).value;
	console.log("Select Opt: " + selectOpt);
	
	//Create Temp label and color array, as well as id array
	var dataIdArr = [];
	var tmpLabels = [];
	var tmpData = [];
	labels.forEach(function(lbl){
		tmpLabels.push(lbl.label);
		dataIdArr.push(lbl.id);
		tmpData.push(0);
	});

	var index = 1;
	dataIn.forEach(function(data){
		//Get id
		if (selectOpt == 'award')
			theData = data.awardId;	
		else if (selectOpt == 'bonus')
			theData = data.bonusId;
		else if (selectOpt == 'dept')
			theData = data.deptId;
		
		//Increment current data
		if (selectOpt == 'bonus')
			tmpData[dataIdArr.indexOf(theData)] = tmpData[dataIdArr.indexOf(theData)] + data.bonus;
		else
			tmpData[dataIdArr.indexOf(theData)] = tmpData[dataIdArr.indexOf(theData)] + 1;
	});
	
	//Create dataset from data objects
	var dataArr = [];
	var labelArr = [];
	var colorArr = [];
	var colorCount = 0;
	for (var i = 0; i < tmpData.length; i++){
		if (tmpData[i] > 0){
			dataArr.push(tmpData[i]);
			labelArr.push(tmpLabels[i]);
			colorArr.push(fillColors[colorCount]);
			colorCount++;
		}
		
		//If at end of fill color array, reset to index 0
			if (colorCount == fillColors.length)
				colorCount = 0;
	}
	
	console.log("Label array:");
	console.log(labelArr);
	console.log("Data:");
	console.log(dataArr);
	
	//Create chart
	//Ref for colors: https://www.w3schools.com/CSSref/tryit.asp?filename=trycss_color_rgba
	var myChart = new Chart(chart, {
		type: 'pie',
		data: {
			labels: labelArr,
			datasets: [{
				data: dataArr,
				backgroundColor: colorArr
			}]
		}
	});	
}

//Create empty Charts
//Ref: chart.js documentation
function createEmptyBarChart(){
	var midChart = document.getElementById("midChart");
	
	var myChart = new Chart(midChart, {
		type: 'line',
		data: {
			datasets: [{
				label: "Empty",
				data: []
			}]
		},
		options: {
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero:true
					}
				}]
			}
		}
	});
}	
	
//Create empty pie chart
function createEmptyPieChart(){
	var chart = document.getElementById("botChart");
	var myChart = new Chart(chart, {
		type: 'pie',
		data: {
			labels: ["Empty"],
			datasets: [{
				data: [1],
				backgroundColor: ["lightgray"]
			}]
		}
	});	
}

//Event Listeners
document.getElementById("topRefresh").addEventListener('click', updateTopChart);
document.getElementById("midRefresh").addEventListener('click', function(){updateSelectChart('mid');});
document.getElementById("botRefresh").addEventListener('click', function(){updateSelectChart('bot');});

//Initialize Page
document.addEventListener('DOMContentLoaded', initializePage);