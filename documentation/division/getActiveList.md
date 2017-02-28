# Divisions: GET

## /divisions

Returns list of details for all divisions

---

## URL Query Example

```
http://138.197.7.194/api/divisions
```

---

## Response

The response will include a JSON object with an array of all *active* division objects

- Division Object:
 - **did**: Id number from database
 - **name**: Name of division/department
 - **active**: 1 or 0

### JSON Object

```
[
  {
    "did": 23490,
    "name": "Finance",
    "active": 1
    
  },
  {
    "did": 76512,
	"name": "Engineering",
	"active": 1
  }
]
```
