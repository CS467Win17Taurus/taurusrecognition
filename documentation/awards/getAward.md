# Awards: GET

## /awards?id=

Returns details for specified award

---

## URL Query Example

```
http://{hostname}/api/awards?id=23490
```

- **id** *(required)*: Database id of award

---

## Response

The response will include a JSON object of the award specified

- Award Object:
 - **id**: Id number from database
 - **title**: Type of award

### JSON Object

```
{
	"id": 23490,
    "type": "Employee of the Month"
}

```