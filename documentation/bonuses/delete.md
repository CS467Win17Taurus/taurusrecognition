# Bonuses: DELETE

## /bonuses?id=

Remove bonus from database

---

## URL Query Example

```
http://138.197.7.194/api/bonuses?id=36990
```

- **id** *(required)*: Database id of bonus

---

## Response

The response will include a text message: 


```
{"status":"success","message":"Bonus amount successfully deleted"}
```

```
{"status":"failed","message":"Bonus amount not deleted"}
```