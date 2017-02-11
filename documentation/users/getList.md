# Users: GET

## /users

Returns list of details for all users

---

## URL Query Example

```
http://138.197.7.194/api/users
```

---

## Response

The response will include a JSON object with an array of all user objects

- User Object:
 - **id**: Id number from database
 - **fName**: First name of user
 - **lName**: Last name of user
 - **email**: Email for user
 - **password**: Password for user
 - **timeCreated**: Date and time the user account was created
 - **signature**: File location of user's signature
 - **dept**: Id number of department corresponding to division (foreign key)
 - **deptName**: The name of the department

### JSON Object

```
[
  {
    "id": 12345,
    "fName": "Joe",
    "lName": "Black",
	"email": "jblack@oregonstate.edu",
	"password": "pword123",
    "timeCreated": "Oct 22, 2016 12:24:09 AM",
    "signature": "http://hostname/img/blackSig.jpg",
    "dept": 3,
	"deptName": "Marketing"
  },
  {
    "id": 24680,
    "fName": "Jane",
    "lName": "Smith",
	"email": "jsmith@oregonstate.edu",
	"password": "mypass1",
    "timeCreated": "Oct 22, 2016 12:26:09 AM",
    "signature": "http://hostname/img/smithSig.jpg",
    "dept": 2,
	"deptName": "Engineering"
  }
]
```