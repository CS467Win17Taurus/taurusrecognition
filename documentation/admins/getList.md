# Admins: GET

## /admins

Returns list of details for all admins

---

## URL Query Example

```
http://138.197.7.194/api/admins
```

---

## Response

The response will include a JSON object with an array of all admin objects

- Admin Object:
 - **id**: Id number from database
 - **adminName**: Username of admin
 - **password**: Password for admin

### JSON Object

```
[
  {
    "id": 12345,
    "adminName": "abcAdmin",
	"password": "pword123"
  },
  {
    "id": 97531,
    "adminName": "xyzAdmin",
	"password": "mypw999"
  }
]
```