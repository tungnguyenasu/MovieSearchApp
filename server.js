const express = require("express");
const cors = require("cors");

const moviesRoutes = require("./api/movies.route.js");
const reviewsRoutes = require("./api/reviews.route.js");


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/v1/reviews", reviewsRoutes);
app.use("/api/v1/movies", moviesRoutes);
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));


module.exports = app;
