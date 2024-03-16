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