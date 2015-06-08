DATABASE = shared/database.sqlite

all:
	$(MAKE) -C raspi all

clean:
	$(MAKE) -C raspi clean
	if which docker-compose >/dev/null; then docker-compose kill && docker-compose rm -f; fi

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
	mkdir -p /var/mosquitto
	chown mosquitto /var/mosquitto
	id eg15nsp 2>/dev/null >/dev/null || useradd eg15nsp
	mkdir -p /var/eg15nsp
	if [ ! -e /var/eg15nsp/database.sqlite ]; then rm -f /var/eg15nsp/database.sqlite;  sqlite3 /var/eg15nsp/database.sqlite <schema.sql; fi
	chown -R eg15nsp:eg15nsp /var/eg15nsp
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
