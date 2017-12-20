DROP TABLE IF EXISTS images;
DROP TABLE IF EXISTS comments;

CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    image TEXT NOT NULL,
    username VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    directions TEXT,
    ingredients TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image_id INTEGER NOT NULL
);
