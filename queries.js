const spicedPg = require('spiced-pg');
const secrets = require('./secrets.json');
const db = spicedPg("postgres:postgres:postgres@localhost:5432/images");

//Images table queries:
function getImages() {
    return db.query(`SELECT * FROM images ORDER BY id DESC;`)
    .then((results) => {
        return results.rows;
    })
}

function getImageById(id) {
    return db.query(`SELECT * FROM images WHERE id = $1`, [id])
    .then((results) => {
        return results.rows;
    })
}

function addImage(image, username, title, description) {
    return db.query(`INSERT INTO images (image, username, title, description) VALUES ($1, $2, $3, $4)`, [image, username, title, description])
    .then(() => {
        console.log('Success!');
    })
}

//Comments table queries:
function addComment(username, comment, image_id) {
    return db.query(`INSERT INTO comments (username, comment, image_id) VALUES ($1, $2, $3)`, [username, comment, image_id])
    .then(() => {
        console.log('Comment Posted!');
    })
}

function getComments(image_id) {
    return db.query(`SELECT * FROM comments WHERE image_id = $1`, [image_id])
    .then((results) => {
        return results.rows;
    })
}
//Exports:
module.exports = {
    getImages: getImages,
    getImageById: getImageById,
    addImage: addImage,
    addComment: addComment,
    getComments: getComments
}
