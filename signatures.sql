DROP TABLE IF EXISTS signatures;
DROP TABLE IF EXISTS user_profiles;
DROP TABLE IF EXISTS users;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first VARCHAR(200) NOT NULL,
    last VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE CHECK (email <> ''),
    pass VARCHAR(200) NOT NULL
);

CREATE TABLE user_profiles(
    id SERIAL PRIMARY KEY,
    age INT,
    city VARCHAR(100),
    url VARCHAR(100),
    user_id INTEGER NOT NULL REFERENCES users(id)
);

CREATE TABLE signatures(
    id SERIAL PRIMARY KEY,
    first VARCHAR(200) NOT NULL,
    last VARCHAR(200) NOT NULL,
    sig TEXT NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id));

    SELECT  users.first AS users_first, users.last AS users_last, user_profiles.age AS age, user_profiles.city AS city, user_profiles.url AS url FROM users LEFT JOIN user_profiles ON users.id = user_profiles.user_id;
