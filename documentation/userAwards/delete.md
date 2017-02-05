# User awards: DELETE

## /userAwards

Remove user award from database

---

## URL Query Example

```
http://{hostname}/api/userAwards?id=45600
```

- **id** *(required)*: Database id of user award

---

## Response

The response will include an object with a status and response message.


### Message

```
{
	"status": "success",
	"message": "User award was successfully deleted."
}
```

```
{
	"status": "failed",
	"message": "Error: User award was not deleted."
}
```