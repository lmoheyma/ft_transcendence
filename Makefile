CMPS_PATH	= -f ./src/docker-compose.yml

all : run

build :
	docker-compose $(CMPS_PATH) build

run : build
	docker-compose $(CMPS_PATH) up

stop :
	docker-compose $(CMPS_PATH) stop

fclean :
	docker-compose $(CMPS_PATH) down

.PHONY : all build run stop fclean

