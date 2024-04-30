import requests as req
import json

from urllib3.exceptions import InsecureRequestWarning
 
# Suppress the warnings from urllib3
req.packages.urllib3.disable_warnings(category=InsecureRequestWarning)

url='https://localhost:8000/'

players = {
    'bob' : 'a@gmail.com',
    'alice' : 'aa@gmail.com',
    'john' : 'aaa@gmail.com',
    'victor' : 'aaaa@gmail.com'
}

print('Registering players ...')
for i in players :
    data = {
        "username": i,
        "email": players[i],
        "password1": "salutsalut",
        "password2": "salutsalut"
    }
    resp = req.post(url + 'api/register/', data=data, verify=False)
    print(f'[{resp.status_code}] {resp.text}')

print('Logging in ...')
tokens = {}
for i in players :
    data = {
        "username": i,
        "password": "salutsalut"
    }
    resp = req.post(url + 'api/token-auth/', data=data, verify=False)
    token = json.loads(resp.text)
    print(f'[{resp.status_code}] {resp.text}')
    tokens[i] = token["token"]

print('Creating a tournament ...')
resp = req.get(url+'api/tournament/create', headers=
        {
            'authorization' : 'Token ' + tokens['bob'],
        },
        verify=False)
data = json.loads(resp.text)
print(f'[{resp.status_code}] {resp.text}')
tournament_code = data['code']

print('Joining tournaments ...')
for i in tokens :
    resp = req.get(url+'api/tournament/join?code='+tournament_code, headers=
            {
                'authorization' : 'Token ' + tokens[i],
            },
            verify=False)
    data = json.loads(resp.text)
    print(f'[{resp.status_code}] {resp.text}')

print('Starting tournament')
resp = req.get(url+'api/tournament/start?code='+tournament_code, headers=
        {
            'authorization' : 'Token ' + tokens['bob'],
        },
        verify=False)
print(f'[{resp.status_code}] {resp.text}')