
## database.sqlite can be made from schema.sql with this command when at project root:
sqlite3 shared/database.sqlite <schema.sql


## Routes explained:

GET /api/sensors

-> Returns All sensors

GET /api/measurements

-> Returns  All measurements of all sensors

GET /api/measurements/:id

-> Returns: all measurements of sensor with certain id

GET /api/controls

-> Returns: all controls

GET /api/value/:id

-> Returns: value of a control with certain id (each control has one row of values)

## License
MIT
