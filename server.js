const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./queries.js');
const path = require('path');
const multer = require('multer');
const uidSafe = require('uid-safe');
const s3 = require('./s3.js')

//Middleware:
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

var diskStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, __dirname + '/uploads');
  },
  filename: (req, file, callback) => {
    uidSafe(24).then((uid) => {
      callback(null, uid + path.extname(file.originalname));
    });
  }
});

var uploader = multer({
  storage: diskStorage,
  limits: {
    fileSize: 2097152
  }
});

//Routes:
app.get('/images', (req, res) => {
    return db.getImages()
    .then((results) => {
        res.json(results);
    }).catch((err) => {
        console.log(err);
    })
});

app.post('/upload', uploader.single('file'), (req, res) => {
    console.log('inside post-upload', req.body);
    console.log('inside post-upload', req.file);
    if (req.file) {
        s3.upload(req.file)
        .then(() => {
            db.addImage(req.file.filename, req.body.username, req.body.title, req.body.description)
        })
    }
})

app.get('/image/:id', (req, res) => {
    Promise.all([
         db.getImageById(req.params.id),
         db.getComments(req.params.id)
    ])
    .then((results) => {
        console.log(results);
        res.json(results);
    })
    .catch((err) => {
        console.log(err);
    })
})

app.post('/post-comment/:id', (req, res) => {
    console.log(req.body);
    if(req.body.username && req.body.comment) {
        db.addComment(req.body.username, req.body.comment, req.params.id)
    } else {
        console.log('ERROR!');
    }
})

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

//Server:
app.listen(8080, () => {
    console.log('Listening on port 8080...');
})
