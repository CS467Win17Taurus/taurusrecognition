# Users: GET

## /users?id=

Returns details for specified user

---

## URL Query Example

```
http://{hostname}/api/users?id=12345
```

- **id** *(required)*: Database id of user

---

## Response

The response will include a JSON object of the user specified

- User Object:
 - **id**: Id number from database
 - **fName**: First name of user
 - **lName**: Last name of user
 - **email**: Email for user
 - **password**: Password for user
 - **timeCreated**: Date and time the user account was created
 - **signature**: File location of user's signature
 - **dept**: Id number of department corresponding to division (foreign key)

### JSON Object

```
{
	"id": 12345,
    "fName": "Joe",
    "lName": "Black",
	"email": "jblack@oregonstate.edu",
	"password": "pword123",
    "timeCreated": "Oct 22, 2016 12:24:09 AM",
    "signature": "http://hostname/img/blackSig.jpg",
    "dept": 3
}

```