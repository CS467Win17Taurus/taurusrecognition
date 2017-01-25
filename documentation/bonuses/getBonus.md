# Bonuses: GET

## /bonuses?id=

Returns details for specified bonus

---

## URL Query Example

```
http://{hostname}/api/bonuses?id=36990
```

- **bid** *(required)*: Database id of bonus

---

## Response

The response will include a JSON object of the bonus specified

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
