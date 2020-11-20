
-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!
CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR (100) NOT NULL,
    "username" VARCHAR (80) UNIQUE NOT NULL, --expect emails as the username
    "password" VARCHAR (1000) NOT NULL
    
);

CREATE TABLE " equipment" (
    "id" SERIAL PRIMARY KEY,
    "equipment_item" VARCHAR (255),
    "serial_number" VARCHAR (255),
    "nddf_code" VARCHAR (40),

);
