const mongoose = require('mongoose');

// bcrypt used to hash users passwords and compare hashed passwords every time users log in
const bcrypt = require('bcrypt');


// creating movieSchema
let movieSchema = mongoose.Schema({
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
let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{type: mongoose.Schema.Types.ObjectID, ref: 'Movie' }]
});

// // this function is hashing the submitted password
// userSchema.statics.hashPassword = (password) => {
//     return bcrypt.hashSync(password, 10);
// };

// // compares the submitted hashed password with the hashed password stored in my database
// userSchema.methods.validatePassword = function(password) {
//     return bcrypt.compareSync(password, this.Password);
// }

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;

