# Divisions: GET

## /divisions?id=

Returns details for specified division

---

## URL Query Example

```
http://{hostname}/api/divisions?id=23490
```

- **id** *(required)*: Database id of division

---

## Response

The response will include a JSON object of the division specified

- Division Object:
 - **id**: Id number from database
 - **name**: Name of division/department

### JSON Object

```
{
	"id": 23490,
    "name": "Finance"
}

```