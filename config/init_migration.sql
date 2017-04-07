CREATE TABLE client
(
	id serial primary key,
	phone varchar(35) not null,
	email varchar(255) not null,
	data json not null
);
