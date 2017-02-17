# Awards: POST

## /awards

Adds new award to database

---

## URL Query Example

```
http://138.197.7.194/api/awards
```

## Request Body

- **title** *(required)*: Type of award

---

## Response

The response will include a JSON object of the newly created award

- Award Object:
 - **aid**: Id number from database
 - **title**: Type of award

### JSON Object

```
{
	"aid": 23490,
    "title": "Employee of the Month"
}
```
