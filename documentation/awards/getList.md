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
    "aid": 23490,
    "title": "Employee of the Month"
  },
  {
    "aid": 76512,
	"title": "Highest Sales"
  }
]
```
