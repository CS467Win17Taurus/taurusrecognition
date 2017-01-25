# Divisions: GET

## /divisions

Returns list of details for all divisions

---

## URL Query Example

```
http://{hostname}/api/divisions
```

---

## Response

The response will include a JSON object with an array of all division objects

- Division Object:
 - **id**: Id number from database
 - **name**: Name of division/department

### JSON Object

```
[
  {
    "did": 23490,
    "name": "Finance"
  },
  {
    "did": 76512,
	"name": "Engineering"
  }
]
```
