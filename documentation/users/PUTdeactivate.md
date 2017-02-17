# Users: PUT

## /users

Modify user's account information to deactivate user in database

## URL Query Example
```
http://138.197.7.194/api/users
```

## Request Body

- **id** *(required)*: Long for id of user to modify
- **active** *(required)*: 0 to signify deactivated

## Response

The response will include a JSON object of the newly created user

### User Object:
- status: Message for success or failure

### JSON Object
```
{
    "status": "success"
}
```
```
{
  "status": "failed"
}
```
