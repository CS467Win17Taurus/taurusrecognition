# Users: GET

## /users?email=&action=retrieve

Sends email to user of email with password and returns status in response

---

## URL Query Example

```
http://138.197.7.194/api/users?email=broder@email.com&action=retrieve
```

- **email** *(required)*: Email of user
- **action** *(required)*: Action to take, for password retrieval this value is "retrieve"

---

## Response

The response will include a phrase indicating status
 
### Response

Success

```
Password has been sent

```

Failed

```
That email is not in the system, please try again

```