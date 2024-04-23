cd /var/www/backend/rest_api
python3 manage.py createsuperuser --noinput
python3 manage.py collectstatic --noinput
python3 manage.py makemigrations
python3 manage.py migrate --run-syncdb
python3 manage.py runserver 0.0.0.0:8000