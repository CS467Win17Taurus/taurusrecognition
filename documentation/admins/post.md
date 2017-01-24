# Admins: POST

## /admins

Adds new admin to database

---

## URL Query Example

```
http://{hostname}/api/admins
```

## Request Body

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
    "adminName": "abcAdmin",
	"password": "pword123"
}
```