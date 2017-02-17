# Admins: PUT

## /admins

Modify admin's account information

---

## URL Query Example

```
http://138.197.7.194/api/admins
```

## Request Body

- **id** *(required)*: Long for id of admin to modify
- **adminName** *(required)*: String for admin's username
- **password** *(required)*: String for admin's password

---

## Response

The response will include a JSON object of the newly created admin

- Admin Object:
 - **id**: Id number from database
 - **adminName**: Username of admin
 - **password**: Password for admin

### JSON Object

```
{
	"id": 12345,
    "adminName": "abcdAdmin",
	"password": "pword123"
}
```