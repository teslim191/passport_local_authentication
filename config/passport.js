const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

errors = []
module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        try {
          // match user email in the database
          let user = await User.findOne({ email: email });
          if (!user) {
            done(null, false,{ message: "email does not exist" });
          } else {
            // match password
            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) throw err;
              if (isMatch) {
                done(null, user);
              } else {
                done(null, false, { message: "password incorrect" });
              }
            });
          }
        } catch (error) {}
      }
    )
  );
  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser(function (id, done) {
    User.findById(id, (err, user) => done(err, user));
  });
};
