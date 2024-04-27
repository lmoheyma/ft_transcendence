FROM debian:bullseye

RUN apt update -y && apt install -y nginx openssl

ADD     ./conf/nginx.conf /etc/nginx/nginx.conf
ADD     ./conf/transcendance.conf /etc/nginx/sites-available/
RUN     ln -s /etc/nginx/sites-available/transcendance.conf /etc/nginx/sites-enabled/
RUN     rm -f /etc/nginx/sites-enabled/default
RUN     openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/certs/nginx-selfsigned.key -out /etc/ssl/certs/nginx-selfsigned.crt -subj '/CN=localhost /O=Saudade/C=FR'
RUN     openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048

ADD     ./entrypoint.sh /
RUN     chmod u+x /entrypoint.sh
EXPOSE      80
ENTRYPOINT  /entrypoint.sh