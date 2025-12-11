-- 1. Crear la base de datos usando template0
CREATE DATABASE CowShop
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    TEMPLATE template0
    LC_COLLATE = 'Spanish_Colombia.1252'
    LC_CTYPE = 'Spanish_Colombia.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

