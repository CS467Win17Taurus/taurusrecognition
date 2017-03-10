/*Taurus Employee Recognition
General functions to support front end
General functions to support both analytics 
dashboard and data in depth page
*/

//User Awards Result Object Constructor
function awardObj(id, award, awardId, bonus, bonusId, dept, deptId, date, giverId, receiverId){
	this.id = id;
	this.award = award;
	this.awardId = awardId;
	this.bonus = bonus;
	this.bonusId = bonusId;
	this.dept = dept;
	this.deptId = deptId;
	this.date = date;
	this.giverId = giverId;
	this.receiverId = receiverId;
}

//Chart Object for label and data array
function datasetObj(label, fillColor, data){
	this.label = label;
	this.backgroundColor = fillColor;
	this.data = data;
}

//Object to collect data for dataset
function dataObj(label, id){
	this.label = label;
	this.id = id;
	this.data = [];
}

//Object to collect data for userAgent
function userObj(id, name, num, amount){
	this.id = id;
	this.name = name;
	this.num = num;
	this.amount = amount;
}

//Array of colors to use in chart
var fillColors = ['rgba(0,0,255,0.5)', 'rgba(0,255,50,0.5)', 'rgba(255,140,0,0.5)', 'rgba(220,0,255,0.5)', 'rgba(210,255,0,0.5)', 'rgba(255,0,0,0.5)', 'rgba(192,192,192,0.5)'];

var backgroundColors = ['rgba(0,0,255,0.2)', 'rgba(0,255,50,0.2)', 'rgba(255,140,0,0.2)', 'rgba(220,0,255,0.2)', 'rgba(210,255,0,0.2)', 'rgba(255,0,0,0.2)', 'rgba(192,192,192,0.2)'];

var borderColors = ['rgba(0,0,255,1)', 'rgba(0,255,50,1)', 'rgba(255,140,0,1)', 'rgba(220,0,255,1)', 'rgba(210,255,0,1)', 'rgba(255,0,0,1)', 'rgba(192,192,192,1)'];

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
		document.getElementById("fromDate" + sect).value = fromMonth + "/" + fromDay + "/" + fromYear;
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
		document.getElementById("toDate" + sect).value = toMonth + "/" + toDay + "/" + toYear;
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
		
		//Check year
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
		
		//If date within range, add result object
		if (dateFlag)
			filteredResults.push(new awardObj(award.uaid, award.awardTitle, award.awardId, award.bonusAmount, award.bonusId, award.recipientDeptName, award.recipientDeptId, award.awardDate, award.giverId, award.recipientId));
	});
	
	//Send results to function for specified section
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
	 
	//Determine page to display stats
	var url = window.location.href;
	console.log("Url: " + url); 
	var page = url.split("CS467/");
	console.log(page);
	if (page.length == 2){
		if (page[1] == "analytics.html")
			var flag = true;
		else
			var flag = false;
	}
	
	//Get toggle value for data in-depth page
	if (sect == "top")
		var toggleOpt = document.getElementById(sect + 'Toggle').checked;
	
	//Update numbers on analytics page
	if (flag){
		document.getElementById(sect + 'Num').textContent = totalNum;
		document.getElementById(sect + 'Amt').textContent = '$' + totalAmount;
	}
	//Update numbers on data in-depth page
	else{
		if (toggleOpt)
			document.getElementById(sect + 'Num').textContent = totalNum + " awards";
		else
			document.getElementById(sect + 'Num').textContent = '$' + totalAmount;
		
		//Get people stats
		makeRequestWithExtraParams('GET', "http://138.197.7.194/api/users/", null, false, true, getUserStats, dataIn, null);
	}
	
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
	chart.height = "100";
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
	var cumDataArr = [];
	var tmpVal = 0;
	var total = 0;
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
		if (newMonthFlag && (index != 1)){
			dataArr.push(tmpVal);
			cumDataArr.push(total);
			tmpVal = 0;
		}

		//Increment sum with selected value
		tmpVal += toggleOpt ? 1 : data.bonus;
		total += toggleOpt ? 1 : data.bonus;
		
		//Add last data
		if (index == dataIn.length){
			dataArr.push(tmpVal);
			cumDataArr.push(total);
		}
		
		compareDate = dateLbl;
		index++;
	});
	console.log("Label array:");
	console.log(labelArr);
	console.log("Data array:");
	console.log(dataArr);
	console.log("Cumulative data array:");
	console.log(cumDataArr);
	
	//Create chart
	//Ref for colors: https://www.w3schools.com/CSSref/tryit.asp?filename=trycss_color_rgba
	var myChart = new Chart(chart, {
		type: 'line',
		data: {
			labels: labelArr,
			datasets: [{
				label: labelStr,
				data: dataArr,
				borderColor: borderColors[0],
				backgroundColor: backgroundColors[0],
				borderWidth: 1
			},
			{
				label: "Cumulative " + labelStr,
				data: cumDataArr,
				borderColor: borderColors[1],
				backgroundColor: backgroundColors[1],
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