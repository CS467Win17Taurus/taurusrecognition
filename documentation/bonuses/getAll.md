# Bonuses: GET

## /bonuses

Returns list of details for all bonuses

---

## URL Query Example

```
http://138.197.7.194/api/bonuses/?action=getall
```

## Response

The response will include a JSON object with an array of all bonus objects

- Bonus Object:
 - **bid**: Id number from database
 - **amount**: Level of bonus
 - **active**: 1 or 0

### JSON Object

```
[
  {
    "bid": 36990,
    "amount": "$25",
    "active": 1
  },
  {
    "bid": 75211,
    "amount": "$35",
    "active": 0
  }
]
```