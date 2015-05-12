-- 1st database schema draft
DROP TABLE IF EXISTS measurements;
DROP TABLE IF EXISTS sensors;
DROP TABLE IF EXISTS devices;

CREATE TABLE devices (
       id INTEGER NOT NULL,
       description TEXT,
       PRIMARY KEY (id));

CREATE TABLE sensors (
       id INTEGER NOT NULL,
       device_id INTEGER NOT NULL,
       type VARCHAR(32) NOT NULL,
       description TEXT,
       PRIMARY KEY(id),
       FOREIGN KEY(device_id) REFERENCES devices (id));

CREATE TABLE measurements (
	id INTEGER NOT NULL,
	device_id INTEGER NOT NULL,
	sensor_id INTEGER NOT NULL,
	sensed_time DATETIME NOT NULL,
	stored_time DATETIME NOT NULL,
	createdAt DATETIME,
	updatedAt DATETIME,
	value DOUBLE NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY(device_id) REFERENCES devices (id),
	FOREIGN KEY(sensor_id) REFERENCES sensors (id));

-- dummy test data
INSERT INTO devices (id, description) VALUES
       (1, 'Plant box');
INSERT INTO sensors (id, device_id, type, description) VALUES
       (1, 1, 'temperature', 'Temperature sensor');
INSERT INTO measurements (id, device_id, sensor_id, sensed_time, createdAt, updatedAt, stored_time, value) VALUES
       (1, 1, 1, '2015-05-11T11:03:00', '2015-05-11T11:03:00', '2015-05-11T11:03:00', '2015-05-11T11:03:00', 24.5),
       (2, 1, 1, '2015-05-11T11:05:00', '2015-05-11T11:05:00', '2015-05-11T11:05:00', '2015-05-11T11:05:00', 24.8),
       (3, 1, 1, '2015-05-11T11:06:00', '2015-05-11T11:07:00', '2015-05-11T11:06:00', '2015-05-11T11:07:00', 24.2),
       (4, 1, 1, '2015-05-11T11:06:30', '2015-05-11T11:07:00', '2015-05-11T11:06:30', '2015-05-11T11:07:00', 23.9),
       (5, 1, 1, '2015-05-11T11:07:00', '2015-05-11T11:07:00', '2015-05-11T11:07:00', '2015-05-11T11:07:00', 24.1);
