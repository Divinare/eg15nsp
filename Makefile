DATABASE = database.sqlite

all:

setup-database: schema.sql
	sqlite3 $(DATABASE) < schema.sql
