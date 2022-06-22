const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const connectDB = require("./config/db");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

dotenv.config({ path: "./config/config.env" });
require("./config/passport")(passport);

const app = express();

// logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// MongoDB connection
connectDB();

// bodyparser middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// handlebars
app.engine(
  ".hbs",
  exphbs.engine({
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

// session middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    // store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash());

// global varables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`server is running in ${process.env.NODE_ENV} node on ${PORT}`)
);
