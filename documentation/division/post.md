# Divisions: POST

## /divisions

Adds new division to database

---

## URL Query Example

```
http://138.197.7.194/api/divisions
```

## Request Body

- **name** *(required)*: Name of division/department

---

## Response

The response will include a JSON object of the newly created division

- Division Object:
 - **did**: Id number from database
 - **name**: Name of division/department

### JSON Object

```
{
	"did": 23490,
    "name": "Finance"
}
```
