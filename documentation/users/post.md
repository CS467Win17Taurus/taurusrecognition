# Users: POST

## /users

Adds new user to database

---

## URL Query Example

```
http://138.197.7.194/api/users
```

## Request Body

- **fName** *(required)*: String for user's first name
- **lName** *(required)*: String for user's last name
- **email** *(required)*: String for user's email
- **password** *(required)*: String for user's password
- **signature** *(required)*: Image file
- **dept** *(required)*: Long number for the division the user is in (foreign key) 

---

## Response

The response will include a JSON object of the newly created user

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
