/*Taurus Employee Recognition
General functions to support front end
Analytics dashboard
*/

//User Awards Result Object Constructor
function awardObj(id, award, awardId, bonus, bonusId, dept, deptId, date){
	this.id = id;
	this.award = award;
	this.awardId = awardId;
	this.bonus = bonus;
	this.bonusId = bonusId;
	this.dept = dept;
	this.deptId = deptId;
	this.date = date;
}

//Chart Object for label and data array
function datasetObj(label, fillColor, data){
	this.label = label;
	this.backgroundColor = fillColor;
	this.data = data;
}

//Object to collect data for dataset
function dataObj(label, fillColor, id){
	this.label = label;
	this.fillColor = fillColor;
	this.id = id;
	this.data = [];
}

//Array of colors to use in chart
var fillColors = ['rgba(0,0,255,0.5)', 'rgba(0,255,50,0.5)', 'rgba(255,140,0,0.5)', 'rgba(220,0,255,0.5)', 'rgba(210,255,0,0.5)', 'rgba(255,0,0,0.5)', 'rgba(192,192,192,0.5)'];

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

//Create array of data within specified date range
function filterData(data, sect, labels){
	var filteredResults = [];
	
	//Get dates for filtering
	var fromDate = $('#dateFromPicker' + sect).datepicker('getDate');
	if (fromDate != null)
	{
		var fromYear = fromDate.getFullYear();
		var fromMonth = fromDate.getMonth() + 1;
		var fromDay = fromDate.getDate();
	}
	else{
		var today = new Date();
		var fromYear = today.getFullYear();
		var fromMonth = 1;
		var fromDay = 1;
	
	}
	console.log("From date: " + fromMonth + "/" + fromDay + "/" + fromYear);
	
	var toDate = $('#dateToPicker' + sect).datepicker('getDate');
	if (toDate != null)
	{
		var toYear = toDate.getFullYear();
		var toMonth = toDate.getMonth() + 1;
		var toDay = toDate.getDate();
	}
	else{
		var today = new Date();
		var toYear = today.getFullYear();
		var toMonth = 12;
		var toDay = 31;
	}
	console.log("To date: " + toMonth + "/" + toDay + "/" + toYear);
	
	//Filter
	data.forEach(function(award){
		var date = new Date(award.awardDate);
		date.setDate(date.getDate() + 1);
		if (date != null){
			var dateYear = date.getFullYear();
			var dateMonth = date.getMonth() + 1;
			var dateDay = date.getDate();
		}
		
		//Check date
		var dateFlag = true;
		//Check year
		if (dateYear < fromYear || dateYear > toYear){
			dateFlag = false;
		}
		
		//Check month
		if (dateFlag && dateYear == fromYear){
			if (dateMonth < fromMonth)
				dateFlag = false;
		}
		if (dateFlag && dateYear == toYear){
			if (dateMonth > toMonth)
				dateFlag = false;
		}
		
		//Check day
		if (dateFlag && dateYear == fromYear && dateMonth == fromMonth){
			if (dateDay < fromDay)
				dateFlag = false;
		}
		if (dateFlag && dateYear == toYear && dateMonth == toMonth){
			if (dateDay > toDay)
				dateFlag = false;
		}
		
		if (dateFlag)
			filteredResults.push(new awardObj(award.uaid, award.awardTitle, award.awardId, award.bonusAmount, award.bonusId, award.recipientDeptName, award.recipientDeptId, award.awardDate));
	});
	
	switch (sect){
		case 'top':
			createLineChart(filteredResults, sect, null);
			break;
		case 'mid':
			createBarChart(filteredResults, sect, labels);
			break;
		case 'bot':
			createPieChart(filteredResults, sect, labels);
			break;
	}
	
}

//Create total numbers for section
function calculateTotals(dataIn, sect){
	//Calculate total numbers
	var totalNum = 0;
	var totalAmount = 0;
	dataIn.forEach(function(data){
		 totalNum++;
		 totalAmount += data.bonus;
	 });
	 
	document.getElementById(sect + 'Num').textContent = totalNum;
	document.getElementById(sect + 'Amt').textContent = '$' + totalAmount;
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
	
	//If selection made, make dataset objects and get data
	var queryStr = "";
	if (validateFlag){
		//Get data field
		if (selectOpt == 'award')
			queryStr = "awards/";
		else if (selectOpt == 'bonus')
			queryStr = "bonuses/";
		else if (selectOpt == 'dept')
			queryStr = "divisions/";
	
		makeRequestWithExtraParams('GET', "http://138.197.7.194/api/" + queryStr, null, false, true, createDatasetObjs, sect, null);
	}
}

//Create dataset objects
function createDatasetObjs(dataIn, sect, blank){
	var labels = [];
	var colorCount = 0;
	var theData, theId;
	
	//Get selection
	var selectOpt = document.getElementById('select' + sect).value;
	console.log("Select Opt: " + selectOpt);
	
	//Make dataset objects and get data
	var title = document.getElementById(sect + 'Title');
	dataIn.forEach(function(data){
		//Get data field
		if (selectOpt == 'award'){
			queryStr = "awards/";
			theData = data.title;	
			theId = data.aid;
			title.textContent = "Total Number of each Award Type Given";
		}
		else if (selectOpt == 'bonus'){
			queryStr = "bonuses/";
			theData = '$' + data.amount;
			theId = data.bid;
			title.textContent = "Total Amount of each Bonus Amount Given";
		}
		else if (selectOpt == 'dept'){
			queryStr = "divisions/";
			theData = data.name;
			theId = data.did;
			title.textContent = "Total Number of Awards Received in each Department";
		}
		
		//Add dataset object
		labels.push(new dataObj(theData, fillColors[colorCount], theId));
		colorCount++;
		
		//If at end of fill color array, reset to index 0
		if (colorCount == fillColors.length)
			colorCount = 0;
	});
	
	makeRequestWithExtraParams('GET', "http://138.197.7.194/api/userAwards/", null, false, true, filterData, sect, labels);
}

//Create line Chart
//Ref: chart.js documentation
function createLineChart(dataIn, sect, labels){
	//Remove current chart
	var div = document.getElementById(sect + "ChartDiv");
	while (div.hasChildNodes())
		div.removeChild(div.firstChild);
	
	//Add new chart
	var chart = document.createElement("canvas");
	chart.id = sect + 'Chart';
	chart.height = "150";
	chart.width = "400";
	div.appendChild(chart);
	
	console.log(dataIn);

	//Update numbers
	calculateTotals(dataIn, sect);
	
	//Get label from toggle
	var toggleOpt = document.getElementById(sect + 'Toggle').checked;
	console.log("Toggle Opt: " + toggleOpt);
	if (toggleOpt)
		var labelStr = "Number of Awards Given";
	else
		var labelStr = "Total Amount Awarded";

	//Create labels and data arrays from data in
	var labelArr = [];
	var dataArr = [];
	var tmpVal = 0;
	var compareDate = "Jan-1977";
	var index = 1;
	var newMonthFlag = false;
	dataIn.forEach(function(data){
		
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
		
		//Sum data to add to array
		if (newMonthFlag){
			if (index != 1)
				dataArr.push(tmpVal);
			tmpVal = toggleOpt ? 1 : data.bonus;
		}
		//If last element in input array, push total to data array
		else{
			tmpVal += toggleOpt ? 1 : data.bonus;
		}
		
		//Add last data
		if (index == dataIn.length)
			dataArr.push(tmpVal);
		
		compareDate = dateLbl;
		index++;
	});
	console.log("Label array:");
	console.log(labelArr);
	console.log("Data array:");
	console.log(dataArr);
	
	//Create chart
	//Ref for colors: https://www.w3schools.com/CSSref/tryit.asp?filename=trycss_color_rgba
	var myChart = new Chart(chart, {
		type: 'line',
		data: {
			labels: labelArr,
			datasets: [{
				label: labelStr,
				data: dataArr,
				backgroundColor: 'rgba(0,50,255,0.4)',
				borderColor: 'rgba(0,50,255,0.8)',
				borderWidth: 1
			}]
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
	chart.height = "150";
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

	console.log(tmpData);
	var compareDate = "Jan-1977";
	var index = 1;
	var newMonthFlag = false;
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
	labels.forEach(function(lbl){
		//Sum to see if dataset contains any nonzero data
		sum = 0;
		lbl.data.forEach(function(pt){
			sum += pt;
		});
		
		if (sum > 0)
			datasetArr.push(new datasetObj(lbl.label, lbl.fillColor, lbl.data));
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
	chart.height = "150";
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

	//Temp label and color array
	var tmpLabels = [];
	var tmpColors = [];
	labels.forEach(function(lbl){
		tmpLabels.push(lbl.label);
		tmpColors.push(lbl.fillColor);
	});
	
	//Initialize variables
	var tmpData = [];
	for (i = 0; i < labels.length; i++)
		tmpData.push(0);

	console.log(tmpData);
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
	for (var i = 0; i < tmpData.length; i++){
		if (tmpData[i] > 0){
			dataArr.push(tmpData[i]);
			labelArr.push(tmpLabels[i]);
			colorArr.push(tmpColors[i]);
		}
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
	
	//Create chart
	//Ref for colors: https://www.w3schools.com/CSSref/tryit.asp?filename=trycss_color_rgba
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

//Get month name for number
function getMonthStr(num){
	var month = "";
	
	switch (num){
		case 1:
			month = 'Jan';
			break;
		case 2:
			month = 'Feb';
			break;
		case 3:
			month = 'Mar';
			break;
		case 4:
			month = 'Apr';
			break;
		case 5:
			month = 'May';
			break;
		case 6:
			month = 'Jun';
			break;
		case 7:
			month = 'Jul';
			break;
		case 8:
			month = 'Aug';
			break;
		case 9:
			month = 'Sep';
			break;
		case 10:
			month = 'Oct';
			break;
		case 11:
			month = 'Nov';
			break;
		case 12:
			month = 'Dec';
			break;
	}
	
	return month;
}

//Event Listeners
document.getElementById("topRefresh").addEventListener('click', updateTopChart);
document.getElementById("midRefresh").addEventListener('click', function(){updateSelectChart('mid');});
document.getElementById("botRefresh").addEventListener('click', function(){updateSelectChart('bot');});

//Initialize Page
document.addEventListener('DOMContentLoaded', initializePage);