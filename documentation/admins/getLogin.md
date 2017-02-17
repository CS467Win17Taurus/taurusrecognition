# Admins: GET

## /admins?adminName=&password=&action=login

Returns user id and status message for login

---

## URL Query Example

```
http://138.197.7.194/api/admins?adminName=admin1&password=pword1&action=login
```

- **adminName** *(required)*: Name for admin account
- **password** *(required)*: Password for account
- **action** *(required)*: Action to take, for logging in this value is "login"

---

## Response

The response will include a JSON object containing the user id and a status message

- Object:
 - **id**: Id number from database
 - **status**: Status if the admin successfully logged in or not

### JSON Object

```
{
	"id": 12345,
    "status": "success",
}
```

```
{
	"id": -1,
    "status": "failed",
}
```