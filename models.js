const mongoose = require('mongoose');

// bcrypt used to hash users passwords and compare hashed passwords every time users log in
const bcrypt = require('bcrypt');


// creating movieSchema
const movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: {
        Name: String,
        Description: String,
    },
    Director: {
        Name: String,
        Bio: String
    },
    Actors: [String],
    ImagePath: String,
    Featured: Boolean
});


// creating userSchema
const userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{type: mongoose.Schema.Types.ObjectID, ref: 'Movie' }]
});

// // this function is hashing the submitted password
userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

// // compares the submitted hashed password with the hashed password stored in my database
userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
}

// creating genre schema
const genreSchema = mongoose.Schema({
    Name: {type: String, required: true},
    Description: { type: String, required: true}
});

// creating directors schema
const directorSchema = mongoose.Schema({
    Name: {type: String, required: true},
    Bio: {type: String, required: true},
    Birthdate: { type: Date, required: true},
    Death: { type: Date},
    Films: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }]
});

const Movie = mongoose.model('Movie', movieSchema);
const User = mongoose.model('User', userSchema);
const Genre = mongoose.model('Genre', genreSchema);
const Director = mongoose.model('Director', directorSchema);

// export models
module.exports.Movie = Movie;
module.exports.User = User;
module.exports.Genre = Genre;
module.exports.Director = Director;