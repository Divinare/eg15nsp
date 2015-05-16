DATABASE = shared/database.sqlite

all:

mock: $(DATABASE)
	docker-compose build
	docker-compose up

$(DATABASE):
	sqlite $(DATABASE) < schema.sql
