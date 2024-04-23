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

## Getting account info

`GET /api/account`
```json

```