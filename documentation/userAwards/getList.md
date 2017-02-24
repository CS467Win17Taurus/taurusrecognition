# User awards: GET

## /userAwards

Returns list of user awards

---

## URL Query Example

```
http://138.197.7.194/api/userAwards?awardId=#&bonusId=#&deptId=#&userId=#
```

- **awardId** *(optional)*: Database id of award type
- **bonusId** *(optional)*: Database id of bonus level
- **deptId** *(optional)*: Database id of department
- **userId** *(optional)*: Database id of user who created award

---

## Response

The response will include a JSON object with an array of all user award objects

- User award Object:
 - **uaid**: Id number from database
 - **recipientFName**: First name of user receiving award
 - **recipientLName**: Last name of user receiving award
 - **recipientId**: Id of user receiving award
 - **recipientDeptName**: Name of department user receiving award is in
 - **recipientDeptId**: Id of deparment user receiving award is in 
 - **giverFName**: First name of user creating award
 - **giverLName**: Last name of user creating award
 - **giverId**: Id of user giving award
 - **awardTitle**: Title of award type (foreign key)
 - **awardId**: Award type id
 - **bonusAmount**: Amount of bonus level (foreign key)
 - **bonusId**: Bonus amount id
 - **awardDate**: Date of when the award is created

### JSON Object

```
[
  {
    "uaid": 45600,
	"recipientFName": "Joe",
	"recipientLName": "Black",
	"recipientId": 12,
	"recipientDeptName": "sales",
	"recipientDeptId": 2,
	"giverFName": "Jane",
	"giverLName": "Smith",
	"giverId": 3,
	"awardTitle": "Employee of the Month",
	"awardId": 3,
	"bonusAmount": 50,
	"bonusId": 2,
    "awardDate": "Oct 22, 2016 12:24:09 AM"
  },
  {
    "uaid": 45679,
	"recipientFName": "Mike",
	"recipientLName": "Bonney",
	"recipientId": 2,
	"recipientDeptName": "accounting",
	"recipientDeptId": 1,
	"giverFName": "Jane",
	"giverLName": "Smith",
	"giverId": 3,
	"awardTitle": "New Sales Record",
	"awardId": 1,
	"bonusAmount": 100,
	"bonusId": 3,
    "awardDate": "Oct 22, 2016 12:24:09 AM"
  },
]
```