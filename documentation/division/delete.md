# Divisions: DELETE

## /divisions?id=

Remove division from database

---

## URL Query Example

```
http://138.197.7.194/api/divisions?id=23490
```

- **id** *(required)*: Database id of division

---

## Response

The response will include an object with status and message: 


```
{"status":"success","message":"Division successfully deleted"}
```

```
{"status":"failed","message":"Division not deleted"}
```