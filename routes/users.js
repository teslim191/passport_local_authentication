const express = require("express");
const router = express.Router();
const User = require("../models/User");

const passport = require("passport");
const bcrypt = require("bcryptjs");

// register
router.get("/register", (req, res) => {
  res.render("register");
});

// login
router.get("/login", (req, res) => {
  res.render("login");
});

// process registration
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;

  const errors = [];

  // check if empty
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "All fields are required" });
  }

  if (password !== password2) {
    errors.push({ msg: "Password do no match" });
  }
  // check password length
  if (password.length < 6) {
    errors.push({ msg: "password should be atleast 6 characters" });
  }
  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    // check if email already exists
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "email already exist" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
        });
        // create a new user if email doesnt exist
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });
        // hash password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                req.flash("success_msg", "you can login");
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          })
        );
      }
    });
  }
});

// authenticate a user
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

// logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "you are logged out");
  res.redirect("/users/login");
});

module.exports = router;
