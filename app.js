//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

// tapping into the .env files

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

// Create a database and connect it to our server

mongoose.connect("mongodb://0.0.0.0:27017/userDB", {useNewUrlParser: true});

// setting up our new user database

const userSchema = new mongoose.Schema  ({
    email: String,
    password: String
});

// Encryption: remember that encryptedFields specifies fields to be encrypted.
// You can add more fields to be encrypted by using a coma


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

// setting up a model

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res) {
    res.render("home")
})

app.get("/login", function(req, res) {
    res.render("login")
})

app.get("/register", function(req, res) {
    res.render("register") 
})

// catching user registration of a new user

app.post("/register", function(req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save()
        .then(() => {
            res.render("secrets");
        })
        .catch((err) => {
            console.log(err);
        });
});

// User login

// app.post("/login", function(req, res) {
//     const username = req.body.username;
//     const password = req.body.password;

//     User.findOne({email: username}, function(err, foundUser) {
//         if (err) {
//             console.log(err);
//         } else {
//             if (foundUser) {
//                 if (foundUser.password === password) {
//                     res.render("secrets");
//                 }
//             }
//         }
//     });
// });

app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username})
        .then(foundUser => {
            if (foundUser && foundUser.password === password) {
                res.render("secrets");
            }
        })
        .catch(err => {
            console.log(err);
        });
});



app.listen(3000, function() {
    console.log("Server started on port 3000.");
});
