# ft_transcendence API documentation

## Creating an account

`POST /api/register`
```json
{
    "username": "<username>",
    "email": "<email>",
    "password1": "<password>",
    "password2": "<password_again>"
}
```

## Retrieving Token

`POST /api/token-auth`
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

`GET /api/account`
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
`UPDATE /api/account/update`
```json
{
    "password" : "<mandatory:current_password>",
    "email" : "<optional:email>",
    "username" : "<optional:username>",
    "new_password" : "<optional:new_password>"
}
```