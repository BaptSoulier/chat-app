CREATE TABLE IF NOT EXISTS "User" (
    "UID" SERIAL PRIMARY KEY,
    "lastName" VARCHAR(100) NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL UNIQUE,
    "password" VARCHAR(100) NOT NULL,
    "pseudo" VARCHAR(100) NOT NULL UNIQUE,
);
