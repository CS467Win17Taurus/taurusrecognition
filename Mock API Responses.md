# Mock API Endpoints

Below are mock responses I created to test various endpoints. These should match the API documentation in terms of response provided, to make integrating the front end with the back end easier when the time comes.

## Users
- GET /users: http://mockbin.org/bin/96211a1a-4861-4d41-90d5-048a616c6515/view (note: missing signature file link field in response data)
- GET /users?id=: http://mockbin.org/bin/7adbe39b-6504-41c0-9c42-4e8c88a05741/view
- GET /users?email=&action=retrieve: http://mockbin.org/bin/fb1bd010-c776-4f35-8558-7060a0c98341/view
- GET /users?email=&password=&action=login (Success): http://mockbin.org/bin/6f8d5595-cbb2-4ad6-97ee-4f2f46cf46e8/view
- GET /users?email=&password=&action=login (Failure): http://mockbin.org/bin/98c424e3-1bd0-4be5-9835-45d68e073164/view
- PUT /users: http://mockbin.org/bin/fbca1ddd-dc5d-4a4d-9640-bc4c0e4514e5/view

## Admins
- GET /admins?adminName=&password=&action=login (success): http://mockbin.org/bin/2fe094f6-7525-4eb2-8eaf-a0f5a8f417ca/view
- GET /admins?adminName=&password=&action=login (failed): http://mockbin.org/bin/2574bd7c-04a9-4141-81a8-23bfcb41162a/view

## Divisions
- GET /divisions: http://mockbin.org/bin/2059eece-cb9b-45cf-9f3e-943349bf60e5/view

## Awards
- GET /awards: http://mockbin.org/bin/428a3a4e-7338-4619-a8cf-153e5cddb200/view

## Bonuses
- GET /bonuses: http://mockbin.org/bin/7e45cbeb-d369-4c92-8aa7-3cbea65efc49/view

## User Awards
- GET /userAwards?userId= : http://mockbin.org/bin/34d688d0-3d0b-45a2-863a-37443538bb4d/view
- POST /userAwards: http://mockbin.org/bin/e95fd964-aac4-4558-90d3-02dd5b070e7e/view
- DELETE /userAwards?id= (success): http://mockbin.org/bin/8f4dfb8a-aae0-4b9e-aed1-84bc391722ad/view
- DELETE /userAwards?id= (failed): http://mockbin.org/bin/1bb346bc-b687-470c-88d3-4fbdb1ca3e9b/view
