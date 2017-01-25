# Awards: GET

## /awards

Returns list of details for all awards

---

## URL Query Example

```
http://{hostname}/api/awards
```

---

## Response

The response will include a JSON object with an array of all award objects

- Award Object:
 - **aid**: Id number from database
 - **title**: Type of award

### JSON Object

```
[
  {
    "id": 23490,
    "title": "Employee of the Month"
  },
  {
    "id": 76512,
	"title": "Highest Sales"
  }
]
```
