const express = require('express');
const morgan = require('morgan');

const app = express();
const bodyParser = require('body-parser'),
  uuid = require('uuid');

// Logging middleware
app.use(morgan('common'));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

let topMovies = [
  {
    id: '1',
    title: 'Men in Black',
    actors: 'Tommy Lee Jones and Will Smith',
    director: 'Barry Sonnenfeld',
    genre: {
      name:"action",
      name:"adventure",
      name:"comedy",
      name:"sci-fi"
    }
  },
  {
    id: '2',
    title: 'Kingsman - The secret circle revealed',
    actors: 'Geoff Bell and Sofia Boutella',
    director: 'Matthew Vaugn',
    genre: {
      name:"action",
      name:"adventure",
      name:"comedy",
      name:"thriller"
    }
  },
  {
    id: '3',
    title: 'Kill Bill Vol. 1',
    actors: 'Uma Thurman and David Carradine',
    director: 'Quentin Tarantino',
    genre: {
      name:"action",
      name:"crime",
      name:"drama",
      name:"thriller"
    }
  },
  {
    id: '4',
    title: 'The big Blue',
    actors: 'Jean_Marc Barr, Jean Reno',
    director: 'Luc Besson',
    genre: {
      name:"adventure",
      name:"drama",
      name:"sport"
    }
  },
  {
    id: '5',
    title: 'Mission: Impossible',
    actors: 'Tom Cruise and Voigt',
    director: 'Brian de Palma',
    genre: {
      name:"action",
      name:"adventure",
      name:"thriller"
    }
  },
  {
    id: '6',
    title: 'Top Gun',
    actors: 'Tom Cruise and Val Kilmer',
    director: 'Tony Scott',
    genre: {
      name:"action",
      name:"drama"
    }
  },
  {
    id: '7',
    title: 'Lock Stock and 2 smoking Barrels',
    actors: 'Jason Flemyng and Dexter Fletcher',
    director: 'Guy Ritchie',
    genre: {
      name:"action",
      name:"comedy",
      name:"crime"
    }
  },
  {
    id: '8',
    title: 'RED',
    actors: 'Bruce Willis and Helen Mirren',
    director: 'Robert Schwentle',
    genre: {
      name:"action",
      name:"comedy",
      name:"crime",
      name:"thriller"
    }
  },
  {
    id: '9',
    title: 'Predator',
    actors: 'Arnold Schwarzenegger and Carl Weathers',
    director: 'John McTiernan',
    genre: {
      name:"action",
      name:"adventureadventure",
      name:"scifi",
      name:"thriller"
    }
  },
  {
    id: '10',
    title: 'The Gentlemen',
    actors: 'Matthew McConaughey and Charlie Hunnam',
    director: 'Guy Ritchie',
    genre: {
      name:"action",
      name:"thriller",
      name:"crime"
    }
  }
];

// Users data
let users = [
  {
      id: 1,
      username: "jessd",
      password: "password1",
      email: "jessyd@email.com",
      favorites: [
        "6"
      ]
  },
  {
      id: 2,
      username: "benc",
      password: "password2",
      email: "benc@emailo.com",
      favorites: [
        "3"
      ]
  },
  {
      id: 3,
      username: "lisad",
      password: "password3",
      email: "lisad@email.com",
      favorites: [
        "1"
      ]
  }
];



// GET homepage
app.get('/', (req, res) => {
  res.send('Welcome to myFlix, the best movie app on the market!');
});

// GET list of displayed movies
app.get('/movies', (req, res) => {
  res.json(topMovies);
});

// Get data about a single movie by title/name
app.get('/movies/:title', (req, res) => { // movies/:id = /movies_detail
  res.json(topMovies.find((movie) => {
    return movie.title === req.params.title
  }));
});

// GET data about movie genre by title???????????????????????????????????????
app.get('/movies/:genre', (req, res) => { // /movies/
  res.json(topMovies.find((movie) => {
    return movie.genre === req.params.genre
  }));
})

// POST add movie to list of favorites
app.post('/users/:id/:favoriteMovies', (req, res) => {
  res.send('You have added a new movie to your favorites list.')
//   let newFavMovie = req.body;
//
//   if (!newFavMovie.title) {
//     const message = 'Missing name in request body.';
//     res.status(400).send(message);
//   } else {
//     newFavMovie.id = uuid.v4();
//     favMovies.push(newFavMovie);
//     res.status(201).send('A new movie has been added to your favorites list.');
//   }
});

// DELETE a movie from the topMovies list by ID
app.delete('/movies/:id', (req, res) => {
  let movie = topMovies.find((movie) => {
    return movie.id === req.params.id
  });

  if (movie) {
    topMovies = topMovies.filter((obj) => {
      return obj.id !== req.params.id
    });
    res.status(201).send('The movie ' + req.params.id + ' has been removed from your favorites list.');
  }
});

// DELETE a movie from the favorites list by ID
app.delete('/users/:id/favorites/:movieToRemoveId', (req, res) => {
  let movie = topMovies.find((movie) => {
    return movie.id === req.params.id
  });

  if (movie) {
    topMovies = topMovies.filter((obj) => {
      return obj.id !== req.params.id
    });
    res.status(201).send('The movie ' + req.params.id + ' has been removed from your favorites list.');
  }
});

// GET data about director ???????????????????????????????????
app.get('/movies/:director', (req, res) => {
  res.json(topMovies.find((movie) => {
    return movie.director === req.params.director
  }));
});

// POST new user registration
app.post('/users/register', (req, res) => {
  let newUser = req.body;
  if (!newUser.name || !newUser.email) {
    const message = 'Not all required registration data provided.';
    res.status(400).send(message);
  } else {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).send(newUser);
  }
});

// PUT update user info - '/users/[id]/[userInfoUpdate]/[newValue]'
app.put('/users/:id/:username', (req, res) => {
  res.send('Your userprofile has been updated.')
});
//   let user = users.find((user) => {
//     return user.name === req.params.name
//   });
//
//   if (user) {
//     user.username[req.params.class] = parseInt(req.params.username),  // ?????????HERE IS SOMETHING WRONG !!!!!!!!!!!!!!!!!!!!!!!!!!
//     res.status(201).send('User ' + req.params.name + ' username was updated to ' + req.params.username + '.' );
//   } else {
//     res.status(404).send('A user with teh name ' + req.params.name + ' was not found.');
//   }
// });


// DELETE - de-register a user - '/users/[id]/[unregister]'
app.delete('/users/:id', (req, res) => {
  res.send('You have been successfully removed from myFlix. We are sorry to see you go!')
});
//   let user = users.find((user) => {
//     return user.id === req.params.id
//   });
//
//   if (user) {
//     users = users.filter((obj) => {
//       return obj.id !== req.params.id
//     })
//     res.status(201).send('You, ' + req.params.id + ', have successfully closed your account with myFlix. We are sorry to see you leave!.');
//   }
// });

// sending of static files
app.use(express.static('public'));

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('Something broke mate!');
});

app.listen(8080, () => {
  console.log('Your app is listening to port 8080.');
});
