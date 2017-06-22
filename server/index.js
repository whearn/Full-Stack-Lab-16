var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'chirperUser',
    password: 'bokbokchirp',
    database: 'Chirper'
});

var clientPath = path.join(__dirname, '../client');

var app = express();
app.use(bodyParser.json());
app.use(express.static(clientPath));

app.get('/api/chirps', function(req, res) {
    getChirps()
        .then(function(chirps) {
            res.send(chirps);
        }, function(err) {
            console.log(err);
            res.sendStatus(500);
        });
});

app.post('/api/chirps', function(req, res) {
    insertCourse(req.body.message, req.body.user)
        .then(function(id) {
            res.status(201).send(id);
        }, function(err) {
            console.log(err);
            res.sendStatus(500);
        });
});

app.delete('/api/chirps', function(req, res) {
    deleteCourse(req.body.id)
        .then(function(id) {
            res.status(204).send(id);
        }, function(err) {
            console.log(err);
            res.sendStatus(500);
        });
});

app.listen(3000);

//get all of the Chirps
function getChirps() {
    return new Promise(function(resolve, reject) {
        pool.getConnection(function(err, connection){
            if(err) {
                reject(err);
            } else {
                connection.query('CALL GetChirps();', function(err, resultsets) {
                    connection.release();
                    if (err) {
                        reject(err);
                    } else {
                        resolve(resultsets[0]);
                    }
                });
            }
        });
    });
}

//get a single Chirp
//how would the GET request look?
function getSingleChirp(id) {
    return new Promise(function(resolve, reject) {
        pool.getConnection(function(err, connection){
            if(err) {
                reject(err);
            } else {
                connection.query('CALL GetSingleChirp(?);', [id], function(err, resultsets) {
                    connection.release();
                    if (err) {
                        reject(err);
                    } else {
                        resolve(resultsets[0]);
                    }
                });
            }
        });
    });
}

//add a new Chirp
function insertCourse(message, user) {
    return new Promise(function(resolve, reject) {
        pool.getConnection(function(err, connection) {
            if (err) {
                reject(err);
            } else {
                connection.query('CALL InsertChirp(?,?)', [message, user], function(err, resultsets) {
                    connection.release();
                    if (err) {
                        reject(err);
                    } else {
                        //look at the first select statment, and return the first thing that you see
                        resolve(resultsets[0][0]);
                    }
                });
            }
        });
    });
}

//update the message of a Chirp
//status 204
function updateChirp(message, id) {
    return new Promise(function(resolve, reject) {
        pool.getConnection(function(err, connection){
            if(err) {
                reject(err);
            } else {
                connection.query('CALL UpdateChirp(?,?);', [message, id], function(err, resultsets) {
                    connection.release();
                    if (err) {
                        reject(err);
                    } else {
                        resolve(resultsets[0][0]);
                    }
                });
            }
        });
    });
}

//delete a Chirp
//status 204
function deleteChirp(id) {
    return new Promise(function(resolve, reject) {
        pool.getConnection(function(err, connection){
            if(err) {
                reject(err);
            } else {
                connection.query('CALL DeleteChirp(?);', [id], function(err, resultsets) {
                    connection.release();
                    if (err) {
                        reject(err);
                    } else {
                        resolve(resultsets[0]);
                    }
                });
            }
        });
    });
}