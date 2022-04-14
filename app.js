//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
//npm i mongoose-encryption
const encrypt = require("mongoose-encryption");
//npm i md5
const md5 = require("md5");
//npm i bcrypt
const bcrypt = require("bcrypt");
const saltRounds = 9;
//const myPlaintextPassword = req.body.password;

//npm i passport passport-local passport-local-mongoose express-session
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

//log API key
console.log(process.env.API_KEY);
//log Hash function
console.log(md5("123456"));

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

//cookie
app.use(
  session({
    secret: "Our looney tunes",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
//serialze and deserualize
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* 
//mongoose-encryption , password + API = encrytion code
const secret = "ThisisourLittlesecret.";
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] }); */

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/secrets", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("secrets");
  } else {
    res.redirect("/login");
  }
});

app.get("/logout",(req,res) => {
  req.logout();
  res.redirect("/");
})


app.post("/register", (req, res) => {
  User.register(
    { username: req.body.username },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/secrets");
        });
      }
    }
  );
});

app.post("/login", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, (err) => {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/secrets");
      });
    }
  });
});

app.listen(3000, () => {
  console.log("Server running at local host " + 3000);
});

//cookies
