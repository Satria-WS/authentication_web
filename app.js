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
const { hash } = require("bcrypt");
const saltRounds = 9;
//const myPlaintextPassword = req.body.password;

//npm i passport passport-local passport-local-mongoose express-session

const app = express();

//log API key
console.log(process.env.API_KEY);
//log Hash function
console.log(md5("123456"));

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

/* 
//mongoose-encryption , password + API = encrytion code
const secret = "ThisisourLittlesecret.";
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] }); */

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {

});

app.post("/login", (req, res) => {
  
});

app.listen(3000, () => {
  console.log("Server running at local host " + 3000);
});

//cookies


