FROM debian:bullseye

RUN apt update -y && apt install -y python3 pip
ADD ./requirements.txt /

RUN pip install -r /requirements.txt

ADD ./entrypoint.sh /

RUN chmod u+x entrypoint.sh
ENTRYPOINT /entrypoint.sh