-- 1st database schema draft
DROP TABLE IF EXISTS measurements;
DROP TABLE IF EXISTS sensors;
DROP TABLE IF EXISTS devices;
DROP TABLE IF EXISTS controls;
DROP TABLE IF EXISTS `values`;

CREATE TABLE devices ( -- pot
       id INTEGER NOT NULL,
       description TEXT,
       last_active DATETIME,
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
	value DOUBLE NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY(device_id) REFERENCES devices (id),
	FOREIGN KEY(sensor_id) REFERENCES sensors (id));

CREATE TABLE controls (
       id INTEGER NOT NULL,
       device_id INTEGER NOT NULL,
       type VARCHAR(32) NOT NULL,
       description TEXT,
       PRIMARY KEY(id),
       FOREIGN KEY(device_id) REFERENCES devices (id));

CREATE TABLE `values` (
       id INTEGER NOT NULL,
       control_id INTEGER NOT NULL,
       current DOUBLE,
       target DOUBLE,
       current_time DATETIME,
       target_time DATETIME,
       UNIQUE(control_id),
       FOREIGN KEY(control_id) REFERENCES controls (id));

INSERT INTO devices (id, description, last_active) VALUES
       (1, 'Plant box', NULL),
       (2, 'Mock box', NULL);
INSERT INTO sensors (id, device_id, type, description) VALUES
       (1, 1, 'temperature', 'Temperature sensor'),
       (2, 1, 'light', 'Luminosity sensor'),
       (3, 2, 'temperature', 'Mock temperature sensor');
INSERT INTO measurements (id, device_id, sensor_id, sensed_time, stored_time, value) VALUES
       (1, 2, 3, '2015-05-11T11:03:00', '2015-05-11T11:03:00', 24.5),
       (2, 2, 3, '2015-05-11T11:05:00', '2015-05-11T11:05:00', 24.8),
       (3, 2, 3, '2015-05-11T11:06:00', '2015-05-11T11:07:00', 24.2),
       (4, 2, 3, '2015-05-11T11:06:30', '2015-05-11T11:07:00', 23.9),
       (5, 2, 3, '2015-05-11T11:07:00', '2015-05-11T11:07:00', 24.1);
INSERT INTO controls (id, device_id, type, description) VALUES
       (1, 1, 'light/red', 'RED led'),
       (2, 1, 'light/green', 'RED led'),
       (3, 1, 'light/blue', 'RED led'),
       (4, 1, 'light/uv', 'RED led');
 INSERT INTO `values` (id, control_id, target, target_time) VALUES
       (1, 1, .5, '2015-05-18T12:30'),
       (2, 2, .5, '2015-05-18T12:30'),
       (3, 3, .5, '2015-05-18T12:30'),
       (4, 4, .5, '2015-05-18T12:30');
