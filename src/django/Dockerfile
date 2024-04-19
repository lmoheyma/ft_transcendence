FROM debian:bullseye

RUN apt update -y && apt install -y python3 pip

ADD ./entrypoint.sh /
ADD ./requirements.txt /

RUN mkdir -p /var/www/html/frontend/
RUN pip install -r /requirements.txt

RUN chmod u+x entrypoint.sh
ENTRYPOINT /entrypoint.sh