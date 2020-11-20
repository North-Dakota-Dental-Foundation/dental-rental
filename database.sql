
-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!
-- CREATE TABLES --

CREATE TABLE "user" (
"id" SERIAL PRIMARY KEY,
"firstname" VARCHAR (80) NOT NULL,
"lastname" VARCHAR (80) NOT NULL,
"username" VARCHAR (80) UNIQUE NOT NULL, -- Email! --
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
"equipment_id" INTEGER NOT NULL REFERENCES "equipment",
"company" VARCHAR (80) NOT NULL,
"address" VARCHAR (80) NOT NULL,
"point_of_contact" VARCHAR (80) NOT NULL,
"email" VARCHAR (80) NOT NULL,
"phone_number" INTEGER NOT NULL,
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

-- TABLE SELECTS --

SELECT * FROM "user";

SELECT * FROM "equipment";

SELECT * FROM "requests";

SELECT * FROM "equipment_requests";

-- TABLE INSERTS --

INSERT INTO "user"
("firstname", "lastname", "username", "password")
VALUES
('John', 'Cena', 'WWEPogChamp@chadmail.com', 'EndYourCareer'
);

INSERT INTO "user"
("firstname", "lastname", "username", "password", "super_admin")
VALUES
('Jack', 'Sparrow', 'TheCaptainJackSparrow@piratemail.com', 'Pirate4Life', 'true'
);

INSERT INTO "equipment"
("equipment_item", "equipment_status", "serial_number", "nddf_code")
VALUES
('A cool item', 'Available', '1234', '5678'
);

INSERT INTO "requests" 
("equipment_id", "company", "address", "point_of_contact", "email", "phone_number", "city", "state", "zip", "start_date", "end_date", "purpose", "status")
VALUES 
('1', 'The Cool Dudes', '1234 5th St S', 'The main man', 'kuledude420@hotmail.com', '1234567890', 'Chadtown', 'OG', '98765', '2020-12-11', '2020-12-12', 'To be awesome', 'Lit'
);

-- TABLE DROPS -- 

DROP TABLE "user";

DROP TABLE "equipment" CASCADE;

DROP TABLE "requests";