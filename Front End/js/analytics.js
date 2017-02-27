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
function chartObj(labelArr, dataArr){
	this.labelArr = labelArr;
	this.dataArr = dataArr;
}

//initialize page
function initializePage(){
	$('#topToggle').bootstrapToggle('on');
	updateTopChart();
}

//Create array of data
function filterData(data, sect, blank){
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
			createLineChart(filteredResults, 'top');
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

//Create line Chart
//Ref: chart.js documentation
function createLineChart(dataIn, sect){
	var chart = document.getElementById("topChart");
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

	//id, award, awardId, bonus, bonusId, dept, deptId, date
	
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

//Initialize Page
document.addEventListener('DOMContentLoaded', initializePage);