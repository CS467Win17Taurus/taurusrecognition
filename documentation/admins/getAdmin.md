# Admins: GET

## /admins?id=

Returns details for specified admin

---

## URL Query Example

```
http://138.197.7.194/api/admins?id=12345
```

- **id** *(required)*: Database id of admin

---

## Response

The response will include a JSON object of the admin specified

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