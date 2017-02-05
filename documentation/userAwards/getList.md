# User awards: GET

## /userAwards

Returns list of details for all user awards

---

## URL Query Example

```
http://{hostname}/api/userAwards?awardId=#&bonusId=#&deptId=#
```

- **awardId** *(optional)*: Database id of award type
- **bonusId** *(optional)*: Database id of bonus level
- **deptId** *(optional)*: Database id of department

---

## Response

The response will include a JSON object with an array of all user award objects

- User award Object:
 - **uaid**: Id number from database
 - **recipient**: Id number of user receiving award (foreign key)
 - **giver**: Id number of user creating award (foreign key)
 - **awardID**: Id number of award type (foreign key)
 - **bonusID**: Id number of bonus level (foreign key)
 - **awardDate**: Date of when the award is created

### JSON Object

```
[
  {
    "uaid": 45600,
	"recipient": 12345,
	"giver": 24680,
	"awardID": 76512,
	"bonusID": 36990,
    "awardDate": "Oct 22, 2016 12:24:09 AM"
  },
  {
    "uaid": 89000,
	"recipient": 24680,
	"giver": 12345,
	"awardId": 23490,
	"bonusId": 75211,
    "awardDate": "Oct 27, 2016 12:24:09 AM"
  }
]
```