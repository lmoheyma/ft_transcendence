CMPS_PATH	= -f ./src/docker-compose.yml

all : build run

build :
	docker-compose $(CMPS_PATH) build

run : 
	docker-compose $(CMPS_PATH) up

stop :
	docker-compose $(CMPS_PATH) stop

fclean :
	docker-compose $(CMPS_PATH) down -v

re: fclean build run

.PHONY : all build run stop fclean re

