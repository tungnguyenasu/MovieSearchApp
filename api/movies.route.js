const express = require("express");
const MoviesDAO = require("./moviesDAO.js");
const router = express.Router();

router.post("/", async (req, res) => {
  const { title, poster, description } = req.body;
  const result = await MoviesDAO.addMovie(title, poster, description);
  res.json(result);
});

router.get("/", async (req, res) => {
  const movies = await MoviesDAO.getMovies();
  res.json(movies);
});

router.post("/:id/like", async (req, res) => {
  const { id } = req.params;
  const result = await MoviesDAO.likeMovie(id);
  res.json(result);
});

// Comments
router.post("/:id/comments", async (req, res) => {
  const { id } = req.params;
  const { author, text } = req.body;
  const result = await MoviesDAO.addComment(id, author, text);
  res.json(result);
});

router.get("/:id/comments", async (req, res) => {
  const { id } = req.params;
  const list = await MoviesDAO.getComments(id);
  res.json(list);
});

module.exports = router;
