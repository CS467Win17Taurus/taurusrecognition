# Awards: GET

## /awards

Returns list of details for all awards

---

## URL Query Example

```
http://138.197.7.194/api/awards
```

---

## Response

The response will include a JSON object with an array of all active award objects

- Award Object:
 - **aid**: Id number from database
 - **title**: Type of award
 - **active**: 1 or 0

### JSON Object

```
[
  {
    "aid": 23490,
    "title": "Employee of the Month",
    "active": 1
  },
  {
    "aid": 76512,
	"title": "Highest Sales",
	"active": 1
  }
]
```
