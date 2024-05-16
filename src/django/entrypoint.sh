mkdir -p /var/www/frontend/media/
cd /var/www/backend/rest_api
python3 manage.py collectstatic --noinput
for i in $(seq 2);
do
    python3 manage.py makemigrations
    python3 manage.py migrate --run-syncdb
    python3 manage.py migrate
done
python3 manage.py createsuperuser --noinput
python3 manage.py shell < init_db.py
python3 manage.py runserver 0.0.0.0:8000