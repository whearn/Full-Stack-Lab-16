// var path = require('path');
// var express = require('express');
// var bodyParser = require('body-parser');
// var mysql = require('mysql');

// var pool = mysql.createPool({
//     connectionLimit: 10,
//     host: 'localhost',
//     user: 'chirperUser',
//     password: 'bokbokchirp',
//     database: 'Chirper'
// });

// var clientPath = path.join(__dirname, '../client');

// var app = express();
// app.use(bodyParser.json());
// app.use(express.static(clientPath));

// app.get('/api/chirps', function(req, res) {
//     getChirps()
//         .then(function(chirps) { //drops the resolve into the parameter
//             res.send(chirps);
//         }, function(err) {
//             console.log(err);
//             res.sendStatus(500);
//         });
// });

// app.post('/api/chirps', function(req, res) {
//     insertCourse(req.body.message, req.body.user)
//         .then(function(id) {
//             res.status(201).send(id);
//         }, function(err) {
//             console.log(err);
//             res.sendStatus(500);
//         });
// });

// app.delete('/api/chirps', function(req, res) {
//     deleteChirp(req.body.id)
//         .then(function(id) {
//             res.status(204).send(id);
//         }, function(err) {
//             console.log(err);
//             res.sendStatus(500);
//         });
// });

// app.listen(3000);

// //get all of the Chirps
// function getChirps() {
//     return new Promise(function(resolve, reject) {
//         pool.getConnection(function(err, connection){
//             if(err) {
//                 reject(err);
//             } else {
//                 connection.query('CALL GetChirps();', function(err, resultsets) {
//                     connection.release();
//                     if (err) {
//                         reject(err);
//                     } else {
//                         //give me all results from the first select statement in the procedure
//                         resolve(resultsets[0]);
//                     }
//                 });
//             }
//         });
//     });
// }

// //get a single Chirp
// //how would the GET request look?
// function getSingleChirp(id) {
//     return new Promise(function(resolve, reject) {
//         pool.getConnection(function(err, connection){
//             if(err) {
//                 reject(err);
//             } else {
//                 connection.query('CALL GetSingleChirp(?);', [id], function(err, resultsets) {
//                     connection.release();
//                     if (err) {
//                         reject(err);
//                     } else {
//                         resolve(resultsets[0]);
//                     }
//                 });
//             }
//         });
//     });
// }

// //add a new Chirp
// function insertCourse(message, user) {
//     return new Promise(function(resolve, reject) {
//         pool.getConnection(function(err, connection) {
//             if (err) {
//                 reject(err);
//             } else {
//                 connection.query('CALL InsertChirp(?,?)', [message, user], function(err, resultsets) {
//                     connection.release();
//                     if (err) {
//                         reject(err);
//                     } else {
//                         //look at the first select statment, and return the first thing that you see
//                         resolve(resultsets[0][0]);
//                     }
//                 });
//             }
//         });
//     });
// }

// //update the message of a Chirp
// //status 204
// function updateChirp(message, id) {
//     return new Promise(function(resolve, reject) {
//         pool.getConnection(function(err, connection){
//             if(err) {
//                 reject(err);
//             } else {
//                 connection.query('CALL UpdateChirp(?,?);', [message, id], function(err, resultsets) {
//                     connection.release();
//                     if (err) {
//                         reject(err);
//                     } else {
//                         resolve(resultsets[0][0]);
//                     }
//                 });
//             }
//         });
//     });
// }

// //delete a Chirp
// //status 204
// function deleteChirp(id) {
//     return new Promise(function(resolve, reject) {
//         pool.getConnection(function(err, connection){
//             if(err) {
//                 reject(err);
//             } else {
//                 connection.query('CALL DeleteChirp(?);', [id], function(err, resultsets) {
//                     connection.release();
//                     if (err) {
//                         reject(err);
//                     } else {
//                         resolve(resultsets[0]);
//                     }
//                 });
//             }
//         });
//     });
// }





//In Class
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

app.route('/api/chirps')
    .get(function(req, res) {
        rows('GetChirps')
        .then(function(chirps) {
            res.send(chirps);
        }).catch(function(err) {
            console.log(err);
            res.sendStatus(500);
        });
    }).post(function(req, res) {
        var newChirp = req.body;
        row('InsertChirp', [newChirp.message, newChirp.userId])
        .then(function(id) {
            res.status(201).send(id);
        }).catch(function(err) {
            console.log(err);
            res.sendStatus(500);
        });
    });
app.route('/api/chirps/:id')
    .get(function(req, res) {
        row('GetSingleChirp', [req.params.id])
        .then(function(chirp) {
            res.send(chirp);
        }).catch(function(err) {
            console.log(err);
            res.sendStatus(500);
        });
    }).put(function(req, res) {
        empty('UpdateChirp', [req.body.message, req.params.id])
        .then(function() {
            res.sendStatus(204);
        }).catch(function(err) {
            console.log(err);
            res.sendStatus(500);
        });
    }).delete(function(req, res) {
        empty('DeleteChirp', [req.params.id])
        .then(function() {
            res.sendStatus(204);
        }).catch(function(err) {
            console.log(err);
            res.sendStatus(500);
        });
    });

app.get('/api/users', function(req, res) {
    rows('GetUsers')
    .then(function(users) {
        res.send(users);
    }).catch(function(err) {
        console.log(err);
        res.sendStatus(500);
    });
});

app.listen(3000);

//all in one function
function callProcedure(procedureName, args) { //args === arguments
    return new Promise(function(resolve, reject) {
        pool.getConnection(function(err, connection) {
            if (err) {
                reject(err);
            } else {
                var placeholders = '';
                if(args && args.length > 0) {
                    for (var i = 0; i < args.length; i++) {
                        if (i === args.length - 1) { //if we are on the last argument in the array
                            placeholders += '?';
                        } else {
                            placeholders += '?,';
                        }
                    }
                }
                var callString = 'CALL ' + procedureName + '(' + placeholders + ')'; //CALL GetChirps();, or CALL InsertChirp(?,?,?);
                connection.query(callString, args, function(err, resultsets) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(resultsets);
                    }
                });
            }
        });
    });
}

function rows(procedureName, args) {
    return callProcedure(procedureName, args)
        .then(function(resultsets) {
            return resultsets[0];
        });
}

function row(procedureName, args) {
    return callProcedure(procedureName, args)
        .then(function(resultsets) {
            return resultsets[0][0];
        });
}

function empty(procedureName, args) {
    return callProcedure(procedureName, args)
        .then(function() {
            return;
        });
}