NAME_SERVER_RPI=trx/server-rpi:runtime
VOLUME_SERVER_RPI=trx__server_rpi

build-volumes:
	docker volume create --name=$(VOLUME_SERVER_RPI)

build-server:
	docker build -t "$(NAME_SERVER_RPI)" ./Docker/ServerRPI/

up-server:
	docker run --rm -it --privileged -p 2222:2222 -p 80:80 -p 443:443 -v $(VOLUME_SERVER_RPI):/images "$(NAME_SERVER_RPI)"

down-server:
	docker stop $(shell docker ps -a -q --filter ancestor=$(NAME_SERVER_RPI))