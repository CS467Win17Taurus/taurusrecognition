# User awards: GET

## /userAwards?id=

Returns details for specified user award

---

## URL Query Example

```
http://{hostname}/api/userAwards?id=45600
```

- **id** *(required)*: Database id of user award

---

## Response

The response will include a JSON object of the user award specified

- User award Object:
 - **uaid**: Id number from database
 - **recipient**: Id number of user receiving award (foreign key)
 - **giver**: Id number of user creating award (foreign key)
 - **awardID**: Id number of award type (foreign key)
 - **bonusID**: Id number of bonus level (foreign key)
 - **awardDate**: Date of when the award is created

### JSON Object

```
{
	"uaid": 45600,
	"recipient": 12345,
	"giver": 24680,
	"awardID": 76512,
	"bonusID": 36990,
    "awardDate": "Oct 22, 2016 12:24:09 AM"
}

```