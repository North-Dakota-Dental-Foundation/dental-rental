
-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!

-- SELECT ALL EQUIPMENT FOR ALL REQUESTS
SELECT * FROM "equipment"
JOIN "equipment_requests" ON "equipment_requests"."equipment_id" = "equipment"."id"
JOIN "requests" ON "requests"."id" = "equipment_requests"."request_id";
--WHERE request.id == some id

-- SUBQUERY: SELECT REQUESTS WITH ALL EQUIPMENT IN A REQUEST of APPROVED or PENDING
SELECT * FROM "equipment"
JOIN "equipment_requests" ON "equipment_requests"."equipment_id" = "equipment"."id"
JOIN "requests" ON "requests"."id" = "equipment_requests"."request_id"
WHERE "requests".start_date <= '2020-11-13' -- start_datetime(col) < @upperbound d2
AND "requests".end_date >= '2020-09-17' -- end_datetime(col) > @lowerbound d1
AND "requests".status IN ('PENDING', 'APPROVED');
--------------
-- *** IMPORTNT *** SELECT ALL EQUIPMENT THAT ARE AVAILABLE FOR A GIVEN DATE RANGE
SELECT "equipment".*
FROM "equipment"
WHERE "equipment".id NOT IN (
	SELECT DISTINCT "equipment".id FROM "equipment"
	JOIN "equipment_requests" ON "equipment_requests"."equipment_id" = "equipment"."id"
	JOIN "requests" ON "requests"."id" = "equipment_requests"."request_id"
	WHERE "requests".start_date <= '2020-11-13' -- start_datetime(col) < @upperbound d2
	AND "requests".end_date >= '2020-09-17' -- end_datetime(col) > @lowerbound d1
	AND "requests".status IN ('PENDING', 'APPROVED') -- only want requests that are in the 'PENDING' OR 'APPROVED' status NOT the 'COMPLETED' or 'REJECTED' status
);

-- TABLE SELECTS --

SELECT * FROM "user";

SELECT * FROM "equipment";

SELECT * FROM "requests";

SELECT * FROM "equipment_requests";

-- CREATE TABLES --

CREATE TABLE "user" (
"id" SERIAL PRIMARY KEY,
"firstname" VARCHAR (80) NOT NULL,
"lastname" VARCHAR (80) NOT NULL,
"username" VARCHAR (80) UNIQUE NOT NULL, -- Email! --
"phonenumber" VARCHAR (10) NOT NULL,
"password" VARCHAR (1000) NOT NULL,
"super_admin" BOOLEAN DEFAULT FALSE
);

CREATE TABLE "equipment" (
"id" SERIAL PRIMARY KEY,
"equipment_item" VARCHAR (160) NOT NULL,
"equipment_status" VARCHAR (40) NOT NULL,
"serial_number" VARCHAR (40) NOT NULL,
"nddf_code" VARCHAR (40)
);

CREATE TABLE "requests" (
"id" SERIAL PRIMARY KEY, 
"company" VARCHAR (80) NOT NULL,
"address" VARCHAR (80) NOT NULL,
"point_of_contact" VARCHAR (80) NOT NULL,
"email" VARCHAR (80) NOT NULL,
"phone_number" BIGINT NOT NULL,
"city" VARCHAR (80) NOT NULL,
"state" VARCHAR (80) NOT NULL,
"zip" INTEGER NOT NULL, 
"start_date" DATE NOT NULL, -- format YYYY-MM-DD --
"end_date" DATE NOT NULL, 
"purpose" VARCHAR (255) NOT NULL, 
"status" VARCHAR (40) NOT NULL
);  

-- JUNCTION TABLE --

CREATE TABLE "equipment_requests" (
"id" SERIAL PRIMARY KEY, 
"equipment_id" INTEGER REFERENCES "equipment",
"request_id" INTEGER REFERENCES "requests"
);

-- TABLE INSERTS --

INSERT INTO "user"
("firstname", "lastname", "username", "password")
VALUES
('Matthew', 'Leiman', 'matthewtest123@gmail.com', 'password'
);

INSERT INTO "user"
("firstname", "lastname", "username", "password", "super_admin")
VALUES
('Garret', 'Larson', 'garrettest123@gmail.com', 'password', 'true'
);

INSERT INTO "equipment"
("equipment_item", "equipment_status", "serial_number", "nddf_code")
VALUES
('chair', 'Available', '1234', '5678'),
('toothbrush', 'Unavailable', '2345', '6789'),
('Cordless Prophy', 'Available', 'SMS-AA0687', 'CP006');

INSERT INTO "requests" 
("company", "address", "point_of_contact", "email", "phone_number", "city", "state", "zip", "start_date", "end_date", "purpose", "status")
VALUES 
('Dentistry Plus', '1234 5th St S', 'Dr. Garret', 'garretl@gmail.com', '1234567890', 'Fargo', 'ND', '98765', '2020-12-1', '2020-12-12', 'Charity Dental Work', 'Available'
);

INSERT INTO "equipment_requests"
("equipment_id", "request_id")
VALUES 
('1', '1');

-- TABLE PUTS --

UPDATE "equipment" -- Change equipment status --
SET "equipment_status" = 'Pending...'
WHERE "id" = '2';

UPDATE "requests" -- Change request status --
SET "status" = 'Pending...'
WHERE "id" = '1';

-- TABLE DELETES --

DELETE FROM "user" WHERE "id" = '1';

DELETE FROM "equipment" WHERE "id" = '1';

DELETE FROM "requests" WHERE "id" = '1';

-- JOIN EQUIPMENT AND REQUESTS -- 

SELECT * FROM "equipment"
JOIN "equipment_requests" ON "equipment_requests"."equipment_id" = "equipment"."id"
JOIN "requests" ON "requests"."id" = "equipment_requests"."request_id";

-- TABLE DROPS -- 

-- DROP TABLE "user";

-- DROP TABLE "equipment" CASCADE;

-- DROP TABLE "requests" CASCADE;

-- DROP TABLE "equipment_requests";