DATABASE = shared/database.sqlite

all:

mock: $(DATABASE)
	docker-compose build
	docker-compose up

$(DATABASE): schema.sql
	sqlite3 $(DATABASE) < schema.sql

# This works on eg15nsp.hopto.org, it'll copy stuff to correct places
# and restart services as required.
#
# MISSING: run storer and api backend
deploy-backend:
	apt-get install mosquitto
	cp backend-broker/mosquitto*.conf /etc/mosquitto
	echo "log_dest syslog" >>/etc/mosquitto/mosquitto.conf
	service mosquitto restart
	mkdir -p /var/run/mosquitto
	chown mosquitto /var/run/mosquitto
