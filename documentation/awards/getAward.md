# Awards: GET

## /awards?id=

Returns details for specified award

---

## URL Query Example

```
http://138.197.7.194/api/awards?id=23490
```

- **id** *(required)*: Database id of award

---

## Response

The response will include a JSON object of the award specified

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
