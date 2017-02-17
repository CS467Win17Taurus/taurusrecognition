# Bonuses: GET

## /bonuses

Returns list of details for all bonuses

---

## URL Query Example

```
http://138.197.7.194/api/bonuses
```

---

## Response

The response will include a JSON object with an array of all bonus objects

- Bonus Object:
 - **bid**: Id number from database
 - **amount**: Level of bonus

### JSON Object

```
[
  {
    "bid": 36990,
    "amount": "$25"
  },
  {
    "bid": 75211,
	"amount": "$35"
  }
]
```