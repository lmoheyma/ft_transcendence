FROM debian:bullseye

RUN apt update -y && apt install -y nginx openssl

ADD ./conf/nginx.conf /etc/nginx/nginx.conf
ADD ./conf/transcendance.conf /etc/nginx/sites-available/
RUN ln -s /etc/nginx/sites-available/transcendance.conf /etc/nginx/sites-enabled/
RUN rm -f /etc/nginx/sites-enabled/default

EXPOSE      80
ENTRYPOINT  nginx