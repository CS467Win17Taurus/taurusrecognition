# User awards: GET

## /userAwards?userId=

Returns list of details for all user awards created by the specified user

---

## URL Query Example

```
http://138.197.7.194/api/userAwards?userId=
```

- **userId** *(required)*: Database id of user

---

## Response

The response will include a JSON object with an array of all user award objects

- User award Object:
 - **uaid**: Id number from database
 - **recipientFName**: First name of user receiving award
 - **recipientLName**: Last name of user receiving award
 - **giverFName**: First name of user creating award
 - **giverLName**: Last name of user creating award
 - **awardTitle**: Title of award type (foreign key)
 - **bonusAmount**:Amount of bonus level (foreign key)
 - **awardDate**: Date of when the award is created

### JSON Object

```
[
  {
    "uaid": 45600,
	"recipientFName": "Joe",
	"recipientLName": "Black",
	"giverFName": "Jane",
	"giverLName": "Smith",
	"awardTitle": "Employee of the Month",
	"bonusAmount": 50,
    "awardDate": "Oct 22, 2016 12:24:09 AM"
  },
  {
    "uaid": 45679,
	"recipientFName": "Mike",
	"recipientLName": "Bonney",
	"giverFName": "Jane",
	"giverLName": "Smith",
	"awardTitle": "New Sales Record",
	"bonusAmount": 100,
    "awardDate": "Oct 22, 2016 12:24:09 AM"
  },
]
```