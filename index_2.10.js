// importing required models
const express = require('express');
// Middleware
const morgan = require('morgan');
const bodyParser = require('body-parser');
// const uuid = require('uuid');

const { check, validationResult } = require('express-validator');

// calling express
const app = express();

// importing models from models.js
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

// connecting database 
mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

// activating body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// CORS extends HTTP requests, giving them new headers that include their domain
const cors = require('cors');
app.use(cors());

// links to HTTP authentication file
let auth = require ('./auth')(app); // The app argument ensures that Express will be available in the auth.js file

const passport = require('passport');
require('./passport');

// Logging middleware
app.use(morgan('common'));





// GET homepage
app.get('/', (req, res) => {
    res.send('Welcome to myFlix, the best movie app on the market!');
  });
  
  
// GET list of displayed (all) movies
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
Movies.find()
.then((movies) => {
    res.status(201).json(movies);
})
.catch((err) => {
    console.error(error);
    res.status(500).send('Error ' + err);
});
});


// Get data about a single movie by title/name
// URL: /movies/The%20Gentlemen
app.get('/movies/:Title', (req, res) => { 
Movies.findOne({ Title: req.params.Title})
.then((movie) => {
    res.json(movie);
})
.catch((err) => {
    console.error(err);
    res.status(500).send('Error ' + err);
});
});


// GET JSON genre info when looking for a specific genre
app.get('/movies/genre/:Name', (req, res) => { 
Genres.findOne({ Name: req.params.Name})
.then((genre) => {
    res.json(genre.Description);
})
.catch((err) => {
    console.error(err);
    res.status(500).send('Error ' + err);
});
});


// GET info on Director when looking for a specific Director
app.get('/director/:Name', (req, res) => { 
Directors.findOne({ Name: req.params.Name})
.then((director) => {
    res.json(director);
})
.catch((err) => {
    console.error(err);
    res.status(500).send('Error ' + err);
});
});


// POST add movie to list of favorites - UPDATE
app.post('/users/:Username/movies/:MovieID', (req, res) => {
Users.findOneAndUpdate({ Username: req.params.Username },
    {
    $push: { FavoriteMovies: req.params.MovieID }
    }, 
    { new: true}, 
    (err, updatedUser) => {
    if (err) {
        console.error(err);
        res.status(500).send('Error ' + err);
    }
    });
});



// DELETE a movie from the users favorite Movies list by ID
app.delete('/users/:Username/movies/:Title', (req, res) => {
Movies.findOneAndRemove({Title: req.params.Title})
    .then((movie) => {
    if(!movie) {
        res.status(400).send(req.params.Title + ' was not found');
    } else {
        res.status(200).send(req.params.Title + ' was deleted.');
    }
    })      
    .catch((err) => {
    console.error(err);
    res.status(500).send('Error ' + err);
    });
});


// POST new user registration
app.post('/users', 
    // Validation logic here for request
    // you can either use a chain of methods like .not().isEmpty()
    // which means "opposite of isEmpty" in plain English "is not empty"
    // or use .isLength({min: 5}) which means:
    // minimum value of 5 characters are only allowed
    [
        check('Username', 'Username is required').isLength({min: 5}),
        check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Username', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail()
    ], (req, res) => {

        // check the validation object for errors
        let errors = validationResult(req);

        if  (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array()
            });
        }

    let hashedPassword = Users.hashPassword(req.body.Password);    
    // Search to see if a user with this requested username already exists
    Users.findOne({Username: req.body.Username })
        .then((user) => {
        if (user) {
            // If user already exists, send response that it already exists
            return res.status(400).send(req.body.Username + 'already exists');
        } else {
            Users
            .create({
                Username: req.body.Username,
                Password: hashedPassword,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            })
            .then((user) => { res.status(201).json(user)  })
            .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
            });
        }
    })
    .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
    });

});


// GET request for all users
app.get('/users', (req, res) => {
Users.find()
    .then((users) => {
    res.status(201).json(users);
    })
    .catch((err) => {
    console.error(error);
    res.status(500).send('Error ' + err);
    });
});


// GET user by username
app.get('/users/:Username', (req, res) => {
Users.findOne({ Username: req.params.Username})
.then((user) => {
    res.json(user);
})
.catch((err) => {
    console.error(err);
    res.status(500).send('Error ' + err);
});
});


// UPDATE a user's info by username
/* We’ll expect JSON in this format
{
Username: String,
(required)
Password: String,
(required)
Email: String,
(required)
Birthday: Date
}*/
app.put('/users/:Username', (req, res) => {
Users.findOneAndUpdate({ Username: req.params.Username },
{ $set:
    {
    Username: req.body.Username,
    Password: req.body.Password,
    Email: req.body.Email,
    Birthday: req.body.Birthday
    }
},
// This coming line makes sure that the updated document is returned
{ new: true },
(err, updatedUser) => {
    if(err) {
    console.error(err);
    res.status(500).send('Error ' + err);
    } else {
    res.json(updatedUser);
    }
});
});


// DELETE - de-register a user
app.delete('/users/:Username', (req, res) => {
Users.findOneAndRemove({Username: req.params.Username})
    .then((user) => {
    if(!user) {
        res.status(400).send(req.params.Username + ' was not found');
    } else {
        res.status(200).send(req.params.Username + ' was deleted.');
    }
    })      
    .catch((err) => {
    console.error(err);
    res.status(500).send('Error ' + err);
    });
});


// sending of static files
app.use(express.static('public'));

app.use((err, req, res, next) => {
console.log(err.stack);
res.status(500).send('Something broke mate!');
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
    console.log('Listening on Port ' + port);
});
  