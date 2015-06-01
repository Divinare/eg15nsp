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
	id eg15nsp 2>/dev/null >/dev/null || useradd eg15nsp
	mkdir -p /var/run/eg15nsp
	rm -f /var/run/eg15nsp/database.sqlite
	sqlite3 /var/run/eg15nsp/database.sqlite <schema.sql
	chown -R eg15nsp:eg15nsp /var/run/eg15nsp
	cp backend-storer/storer.conf.init /etc/init/storer.conf
	cp backend-storer/storer /usr/sbin/eg15nsp-storer
	service storer restart
	cp -r backend-api /usr/sbin/eg15nsp-api
	cp backend-api/api.conf.init /etc/init/api.conf
	service api restart

setup-backend:
	apt-get install -y python3-pip sqlite3 npm nodejs-legacy
	pip3 install -r backend-storer/requirements.txt
	cd backend-api && npm install -g
