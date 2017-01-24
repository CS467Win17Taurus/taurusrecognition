# Bonuses: GET

## /bonuses

Returns list of details for all bonuses

---

## URL Query Example

```
http://{hostname}/api/bonuses
```

---

## Response

The response will include a JSON object with an array of all bonus objects

- Bonus Object:
 - **id**: Id number from database
 - **amount**: Level of bonus

### JSON Object

```
[
  {
    "id": 36990,
    "amount": "$25"
  },
  {
    "id": 75211,
	"amount": "$35"
  }
]
```