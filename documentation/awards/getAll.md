# Awards: GET

## /awards

Returns list of details for all awards, both active and inactive

---

## URL Query Example
```
http://138.197.7.194/api/awards/?action=getall
```

---

## Response

The response will include a JSON object with an array of all award objects, active or not

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
    "active": 0
  },
  {
    "aid": 76512,
    "title": "Highest Sales",
    "active": 1
  }
]
```