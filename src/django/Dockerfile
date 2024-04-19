FROM debian:bullseye

RUN apt update -y && apt install -y python3 pip

ADD ./rest_api/     /var/www/backend/
ADD ./entrypoint.sh /

RUN mkdir -p /var/www/html/frontend/
RUN pip install -r /var/www/backend/requirements.txt

RUN chmod u+x entrypoint.sh
ENTRYPOINT /entrypoint.sh