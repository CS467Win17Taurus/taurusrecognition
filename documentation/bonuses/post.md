# Bonuses: POST

## /bonuses

Adds new bonus to database

---

## URL Query Example

```
http://{hostname}/api/bonuses
```

## Request Body

- **title** *(required)*: Type of bonus

---

## Response

The response will include a JSON object of the newly created bonus

- Bonus Object:
 - **id**: Id number from database
 - **amount**: Level of bonus

### JSON Object

```
{
	"id": 36990,
    "amount": "$25"
}
```