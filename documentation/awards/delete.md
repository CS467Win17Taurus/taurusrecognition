# Awards: DELETE

## /awards?id=

Remove award from database

---

## URL Query Example

```
http://138.197.7.194/api/awards?id=23490
```

- **id** *(required)*: Database id of award

---

## Response

The response will include an object with status and message: 


```
{"status":"success","message":"Award type successfully deleted"}
```

```
{"status":"failed","message":"Award type not deleted"}
```