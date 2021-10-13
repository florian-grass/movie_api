
const express = require('express');
// Middleware
const morgan = require('morgan');

const bodyParser = require('body-parser');
const uuid = require('uuid');

const app = express();

const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

mongoose.connect('mongodb://localhost:27017/myFlixDB', {useNewUrlParser: true, useUnifiedTopology: true });

// activating body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


// Logging middleware
app.use(morgan('common'));




let topMovies = [
  // {
  //   id: 10,
  //   Title: "Men in Black",
  //   Director: {
  //     Name: "Barry Sonnenfeld",
  //     Bio: "",
  //     Birthyear: "",
  //     Deathyear: ""
  //   }
  //   Genre: { 
  //     Name:"Comedy"
  //   }
  // },
  // {
  //   id: 11,
  //   Title: "Sherlock Holmes: A Game of Shadows",
  //   Director: {
  //     Name: "Guy Ritchie",
  //     Bio: "",
  //     Birthyear: "",
  //     Deathyear: ""
  //   }
  //   Genre: {
  //     Name:"Thriller"
  //   }
  // },
  {
    movieId: '12',
    Title: "Kill Bill Vol. 1",
    Actors: "Uma Thurman and David Carradine",
    Director: {
      Name: "Quentin Tarantino",
      Bio: "",
      Birthyear: "",
      Deathyear: ""
    },
    Genre: {
      Name:"Action"
    }
  },
  {
    movieId: '13',
    Title: 'Pulp Fiction',
    Director: 'Quentin Tarantino',
    Genre: {
      Name:"Action",
    }
  },
  {
    movieId: '14',
    Title: 'Mission: Impossible',
    Actors: 'Tom Cruise and Voigt',
    Director: 'Brian de Palma',
    Genre: {
      Name:"Thriller"
    }
  },
  {
    movieId: '5',
    Title: 'Top Gun',
    actors: 'Tom Cruise and Val Kilmer',
    director: 'Tony Scott',
    genre: {
      name:"Action"
    }
  },
  {
    movieId: '6',
    title: 'Lock Stock and 2 smoking Barrels',
    actors: 'Jason Flemyng and Dexter Fletcher',
    director: 'Guy Ritchie',
    genre: {
      name:"Comedy"
    }
  },
  {
    movieId: '7',
    title: 'RED',
    actors: 'Bruce Willis and Helen Mirren',
    director: 'Robert Schwentle',
    genre: {
      name:"Action"
    }
  },
  {
    movieId: '8',
    title: 'Predator',
    actors: 'Arnold Schwarzenegger and Carl Weathers',
    director: 'John McTiernan',
    genre: {
      name:"Action"
    }
  },
  {
    movieId: '9',
    title: 'The Gentlemen',
    actors: 'Matthew McConaughey and Charlie Hunnam',
    director: 'Guy Ritchie',
    genre: {
      name:"Thriller"
    }
  }
];

// Users data
let users = [
  {
      userId: 1,
      username: "jessd",
      password: "password1",
      email: "jessyd@email.com",
      favorites: [
        "6"
      ]
  },
  {
      userId: 2,
      username: "benc",
      password: "password2",
      email: "benc@emailo.com",
      favorites: [
        "3"
      ]
  },
  {
      userId: 3,
      username: "lisad",
      password: "password3",
      email: "lisad@email.com",
      favorites: [
        "1"
      ]
  }
];

let genres = [
  {
    genreId: "1",
    Name: "Comedy",
    Description: "The comedy genre is made up of a series of funny or comical events or scenes that are intended to make the viewer laugh. Movies in the comedy genre can also be about a particular quirky character that is funny or amusing. The comedy genre is versatile like drama and romance, as it can be crossed or meshed with almost every other genre."
  },
  {
    genreId: "2",
    Name: "Adventure",
    Description: "Adventure fiction is a genre of fiction that usually presents danger, or gives the reader a sense of excitement. Adventure has been a common theme since the earliest days of written fiction and variations have kept the genre alive. Adventure stories almost always move quickly, and the pace of the plot is at least as important as characterization, setting and other elements of a creative work."
  }
]



// OK - GET homepage
app.get('/', (req, res) => {
  res.send('Welcome to myFlix, the best movie app on the market!');
});


// OK -GET list of displayed (all) movies
app.get('/movies', (req, res) => {
  Movies.find()
  .then((movies) => {
    res.status(201).json(movies);
  })
  .catch((err) => {
    console.error(error);
    res.status(500).send('Error ' + err);
  });
});


// OK - Get data about a single movie by title/name
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


// OK - GET JSON genre info when looking for a specific genre
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


// OK - GET info on Director when looking for a specific Director
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


// OK - POST add movie to list of favorites - UPDATE
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



// OK - DELETE a movie from the users favorite Movies list by ID
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

// OK - POST new user registration
app.post('/users', (req, res) => {
  Users.findOne({Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) => { res.status(201).json(user)  })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });

});


// OK - GET request for all users
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


// OK - GET user by username
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


// OK - UPDATE a user's info by username
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


// OK - DELETE - de-register a user
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

app.listen(8080, () => {
  console.log('Your app is listening to port 8080.');
});
