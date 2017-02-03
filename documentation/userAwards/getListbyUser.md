# User awards: GET

## /userAwards?userId=

Returns list of details for all user awards created by the specified user

---

## URL Query Example

```
http://{hostname}/api/userAwards?userId=
```

- **userId** *(required)*: Database id of user

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
    "auid": 45600,
	"recipient": 12345,
	"giver": 24680,
	"awardID": 76512,
	"bonusID": 36990,
    "awardDate": "Oct 22, 2016 12:24:09 AM"
  },
  {
    "id": 89000,
	"recipient": 34567,
	"giver": 24680,
	"awardId": 23490,
	"bonusId": 75211,
    "awardDate": "Oct 27, 2016 12:24:09 AM"
  }
]
```