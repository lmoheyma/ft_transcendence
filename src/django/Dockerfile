FROM debian:bullseye

RUN apt update -y && apt install -y python3 pip

ADD ./rest_api/      /var/www/app/rest_api
ADD ./entrypoint.sh /

RUN ls -la /var/www/app/rest_api/
RUN pip install -r /var/www/app/rest_api/requirements.txt

RUN chmod u+x entrypoint.sh
ENTRYPOINT /entrypoint.sh