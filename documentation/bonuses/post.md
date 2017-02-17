# Bonuses: POST

## /bonuses

Adds new bonus to database

---

## URL Query Example

```
http://138.197.7.194/api/bonuses
```

## Request Body

- **amount** *(required)*: Level of bonus

---

## Response

The response will include a JSON object of the newly created bonus

- Bonus Object:
 - **bid**: Id number from database
 - **amount**: Level of bonus

### JSON Object

```
{
	"bid": 36990,
    "amount": "$25"
}
```
