const express = require('express');
const morgan = require('morgan');

const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

// Logging middleware
app.use(morgan('common'));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());

let topMovies = [
  {
    title: 'Men in Black',
    actors: 'Tommy Lee Jones and Will Smith'
  },
  {
    title: 'Kingsman - The secret circle revealed',
    actors: 'Geoff Bell and Sofia Boutella'
  },
  {
    title: 'Kill Bill Vol. 1',
    actors: 'Uma Thurman and David Carradine'
  },
  {
    title: 'The big Blue',
    actors: 'Jean_Marc Barr, Jean Reno'
  },
  {
    title: 'Mission: Impossible',
    actors: 'Tom Cruise and Voigt'
  },
  {
    title: 'Top Gun',
    actors: 'Tom Cruise and Val Kilmer'
  },
  {
    title: 'Lock Stock and 2 broken Barrels',
    actors: 'Jason Flemyng and Dexter Fletcher'
  },
  {
    title: 'RED',
    actors: 'Bruce Willis and Helen Mirren'
  },
  {
    title: 'Predator',
    actors: 'Arnold Schwarzenegger and Carl Weathers'
  },
  {
    title: 'The Gentlemen',
    actors: 'Matthew McConaughey and Charlie Hunnam'
  }
];

// GET requests
// GET homepage
app.get('/', (req, res) => {
  res.send('Welcome to myFlix, the best movie app on the market!');
})

// GET list of displayed movies
app.get('/movies', (req, res) => {
  res.json(topMovies);
});

// sending of static files
app.use(express.static('public'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke mate!');
});

app.listen(8080, () => {
  console.log('Your app is listening to port 8080.');
});
