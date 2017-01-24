# User awards: POST

## /userAwards

Adds new user award to database

---

## URL Query Example

```
http://{hostname}/api/userAwards
```

## Request Body

- **recipient** *(required)*: Id number of user receiving award (foreign key)
- **giver** *(required)*: Id number of user creating award (foreign key)
- **awardId** *(required)*: Id number of award type (foreign key)
- **bonusId** *(required)*: Id number of bonus level (foreign key)
- **awardDate** *(required)*: Date of when the award is created

---

## Response

The response will include a JSON object of the newly created user award

- User award Object:
 - **id**: Id number from database
 - **recipient**: Id number of user receiving award (foreign key)
 - **giver**: Id number of user creating award (foreign key)
 - **awardId**: Id number of award type (foreign key)
 - **bonusId**: Id number of bonus level (foreign key)
 - **awardDate**: Date of when the award is created

### JSON Object

```
{
	"id": 45600,
	"recipient": 12345,
	"giver": 24680,
	"awardId": 76512,
	"bonusId": 36990,
    "awardDate": "Oct 22, 2016 12:24:09 AM"
}
```