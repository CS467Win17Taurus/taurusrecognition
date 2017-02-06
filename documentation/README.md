# Taurus Recognition API Documentation

This documentation describes the endpoints and provides examples of an expected response for the Taurus Recognition API, http://138.197.7.194/api/.

Status Tracker: https://docs.google.com/spreadsheets/d/1JHfhs341gMmlq9I5tzRdzTwGusWv5DotPvL8eJmDQ9A/edit#gid=0

## Users

### GET
- [/users](https://github.com/CS467Win17Taurus/taurusrecognition/tree/master/documentation/users/getList.md): Returns list of details for all users
- [/users?id=](https://github.com/CS467Win17Taurus/taurusrecognition/tree/master/documentation/users/getUser.md): Returns details for specified user
- [/users?email=&action=retrieve](https://github.com/CS467Win17Taurus/taurusrecognition/tree/master/documentation/users/getPword.md): Sends password to user of email and returns status message
- [/users?email=&password=&action=login](https://github.com/CS467Win17Taurus/taurusrecognition/tree/master/documentation/users/getLogin.md): Returns details for specified user

### POST
- [/users](https://github.com/CS467Win17Taurus/taurusrecognition/tree/master/documentation/users/post.md): Adds new user to database

### PUT
- [/users](https://github.com/CS467Win17Taurus/taurusrecognition/tree/master/documentation/users/put.md): Modify details of user

### DELETE
- [/users?id=](https://github.com/CS467Win17Taurus/taurusrecognition/tree/master/documentation/users/delete.md): Remove user from database.


## Admins

### GET
- [/admins](https://github.com/CS467Win17Taurus/taurusrecognition/tree/master/documentation/admins/getList.md): Returns list of details for all admins
- [/admins?id=](https://github.com/CS467Win17Taurus/taurusrecognition/tree/master/documentation/admins/getAdmin.md): Returns details for specified admin
- [/admins?adminName=&password=&action=login](https://github.com/CS467Win17Taurus/taurusrecognition/tree/master/documentation/admins/getLogin.md): Returns details for specified user

### POST
- [/admins](https://github.com/CS467Win17Taurus/taurusrecognition/tree/master/documentation/admins/post.md): Adds new admin to database

### PUT
- [/admins](https://github.com/CS467Win17Taurus/taurusrecognition/tree/master/documentation/admins/put.md): Modify details of admin

### DELETE
- [/admins?id=](https://github.com/CS467Win17Taurus/taurusrecognition/tree/master/documentation/admins/delete.md): Remove admin from database.


## Divisions

### GET
- [/divisions](https://github.com/CS467Win17Taurus/taurusrecognition/tree/master/documentation/division/getList.md): Returns list of details for all divisions
- [/divisions?id=](https://github.com/CS467Win17Taurus/taurusrecognition/tree/master/documentation/division/getDivision.md): Returns details for specified division

### POST
- [/divisions](https://github.com/CS467Win17Taurus/taurusrecognition/tree/master/documentation/division/post.md): Adds new division to database

### DELETE
- [/divisions?id=](https://github.com/CS467Win17Taurus/taurusrecognition/tree/master/documentation/division/delete.md): Remove division from database.


## Awards

### GET
- [/awards](https://github.com/CS467Win17Taurus/taurusrecognition/tree/master/documentation/awards/getList.md): Returns list of details for all awards
- [/awards?id=](https://github.com/CS467Win17Taurus/taurusrecognition/tree/master/documentation/awards/getAward.md): Returns details for specified award

### POST
- [/awards](https://github.com/CS467Win17Taurus/taurusrecognition/tree/master/documentation/awards/post.md): Adds new award to database

### DELETE
- [/awards?id=](https://github.com/CS467Win17Taurus/taurusrecognition/tree/master/documentation/awards/delete.md): Remove award from database.


## Bonuses

### GET
- [/bonuses](https://github.com/CS467Win17Taurus/taurusrecognition/tree/master/documentation/bonuses/getList.md): Returns list of details for all bonuses
- [/bonuses?id=](https://github.com/CS467Win17Taurus/taurusrecognition/tree/master/documentation/bonuses/getBonus.md): Returns details for specified bonus

### POST
- [/bonuses](https://github.com/CS467Win17Taurus/taurusrecognition/tree/master/documentation/bonuses/post.md): Adds new bonus to database

### DELETE
- [/bonuses?id=](https://github.com/CS467Win17Taurus/taurusrecognition/tree/master/documentation/bonuses/delete.md): Remove bonus from database.


## User Awards

### GET
- [/userAwards](https://github.com/CS467Win17Taurus/taurusrecognition/tree/master/documentation/userAwards/getList.md): Returns list of details for all userAwards
- [/userAwards?id=](https://github.com/CS467Win17Taurus/taurusrecognition/tree/master/documentation/userAwards/getUserAward.md): Returns details for specified user 
award
- [/userAwards?userId=](https://github.com/CS467Win17Taurus/taurusrecognition/tree/master/documentation/userAwards/getListbyUser.md): Returns list of awards created by specified user

### POST
- [/userAwards](https://github.com/CS467Win17Taurus/taurusrecognition/tree/master/documentation/userAwards/post.md): Adds new user award to database

### DELETE
- [/userAwards?id=](https://github.com/CS467Win17Taurus/taurusrecognition/tree/master/documentation/userAwards/delete.md): Remove user award from database.
