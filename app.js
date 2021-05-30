require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
	session({
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: false,
	})
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://admin-samuel:Test123@cluster0.lfj3f.mongodb.net/usersDB1", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
	email: String,
	password: String,
	name: String,
});

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/home", function (req, res) {
	res.render("home");
});

app.get("/login", function (req, res) {
	res.render("login");
});

app.get("/secrets", function (req, res) {
	if (req.isAuthenticated()) {
		res.render("secrets");
	} else {
		res.redirect("/login");
	}
});

app.get("/logout", function (req, res) {
	req.logout();
	res.redirect("/home");
});

app.get("/register", function (req, res) {
	res.render("register");
});

app.get("/password-reset", function (req, res) {
	if (req.isAuthenticated()) {
		res.render("password-reset");
	} else {
		res.redirect("/login");
	}
});

app.post("/register", function (req, res) {
	const newUser = {
		email: req.body.email,
		name: "Users name",
	};
	User.register(newUser, req.body.password, function (err, user) {
		if (err) {
			console.log(err);
			res.redirect("/register");
		} else {
			passport.authenticate("local")(req, res, function () {
				res.redirect("/secrets");
			});
		}
	});
});

app.post("/password-reset", function (req, res) {
	User.findOne({ email: req.user.email }, function (err, user) {
		if (req.body.newPassword === req.body.confirmPassword) {
			user.setPassword(req.body.newPassword, function (err, user) {
					if (err) {
						console.log(err);
					} else {
						user.save(function (err) {
							console.log("Successfully set new password.")
							res.redirect("/secrets")
						});
					}
			});
		}
	});
});

app.post("/login", function (req, res) {
	const user = new User({
		email: req.body.email,
		password: req.body.password,
	});
	req.login(user, function (err) {
		if (err) {
			console.log(err);
		} else {
			passport.authenticate("local")(req, res, function () {
				res.redirect("/secrets");
			});
		}
	});
});

app.listen(3000, function () {
	console.log("Server started on port 3000.");
});
