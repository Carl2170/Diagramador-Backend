-- Active: 1695438067521@@127.0.0.1@3307@backend-app-diagramador
create table users(
    id int PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50),
    lastname VARCHAR(50),
    email VARCHAR(50),
    password VARCHAR(50),
    status VARCHAR(20),
    UNIQUE (email)
)

INSERT INTO users (name, lastname,email,password,status)VALUES('carlos','andres','carlos@gmail.com','123456789','true');

create table project(
    id int PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50)
)

create table room(
    id int PRIMARY KEY AUTO_INCREMENT,
    project_id int,
    host_id int,
    Foreign Key (project_id) REFERENCES project(id),
    Foreign Key (host_id) REFERENCES users(id)
);

ALTER TABLE room
DROP FOREIGN KEY room_ibfk_1; -- Primero elimina la restricción de clave externa existente

ALTER TABLE room
ADD CONSTRAINT room_ibfk_1 FOREIGN KEY (project_id) 
REFERENCES project(id) ON DELETE CASCADE;

SHOW CREATE TABLE room;
