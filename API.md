# ft_transcendence API documentation

## Creating an account

`POST /api/register/` \
Body example :
```json
{
    "username": "<username>",
    "email": "<email>",
    "password1": "<password>",
    "password2": "<password_again>"
}
```

## Retrieving Token

`POST /api/token-auth` \
Body example :
```json
{
    "username " : "<username>",
    "password" : "<password>"
}
```

You must add this header in order to authentify :
```
Authorization: Token <your_token>
```

## Getting account info

`GET /api/account` \
Response example : 
```json
{
	"email": "boba@email.com",
	"username": "hello",
	"avatar": "default.jpeg",
	"games_no": 0,
	"wins": 0,
	"losses": 0
}
```

## Updating account info
`UPDATE /api/account/update` \
Body example :
```json
{
    "password" : "<mandatory:current_password>",
    "email" : "<optional:email>",
    "username" : "<optional:username>",
    "new_password" : "<optional:new_password>"
}
```

## Uploading a new avatar
`PUT /api/account/avatar_upload` \
The header Content-Disposition as such : `Content-Disposition : attachement; filename=upload.jpg`. Where the filename can be anything as it won't be taken into account in the upload process.

## View friendlist
`GET /api/friends`

## Delete from friendlist
`DELETE /api/freinds`
Body example :
```json
{
    "id" : <id>
}
```

## Send friend invite
`POST /api/invites`
Body example :
```json
{
    "id" : <id>
}
```

## View friend invite
`GET /api/invites` \
Response example :
```json
[
	{
		"code": "P_2TppzhdgpjNg",
		"sender": {
			"id": 2,
			"username": "hello",
			"avatar": null,
			"games_no": 0,
			"wins": 0,
			"losses": 0,
			"history": [
				{
					"player1": 2,
					"player2": null,
					"score_player1": 0,
					"score_player2": 0,
					"created_on": "2024-04-25T09:12:51.947106Z"
				}
			]
		},
		"created_on": "2024-04-25T09:33:52.165015Z"
	}
]
```
## Accept friend invite
`GET /api/invites?accept=<invite_code>` \
Response example :
```json
{
	"success": "Invite accepted."
}
```
