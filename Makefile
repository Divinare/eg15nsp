DATABASE = shared/database.sqlite

all:

mock: $(DATABASE)
	docker-compose build
	docker-compose up

$(DATABASE): schema.sql
	sqlite3 $(DATABASE) < schema.sql
