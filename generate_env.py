
var_names = [
    'DJANGO_SUPERUSER_USERNAME',
    'DJANGO_SUPERUSER_PASSWORD',
    'DJANGO_SUPERUSER_EMAIL',
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
    'POSTGRES_DB',
]
with open('./src/.env', 'w') as f :
    for i in var_names :
        value = input(i + '=')
        f.write(i+'='+value+'\n')