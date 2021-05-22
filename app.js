const express = require("express");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/home", function (req, res) {
	res.render("home");
});

app.get("/login", function (req, res) {
	res.render("login");
});
app.get("/register", function (req, res) {
	res.render("register");
});

app.listen(3000, function () {
	console.log("Server started on port 3000.");
});
