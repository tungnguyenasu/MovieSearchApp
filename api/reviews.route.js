const express = require("express");
const ReviewsDAO = require("./reviewsDAO.js");

const router = express.Router();

router.route("/").get(async (req, res) => {
  const reviews = await ReviewsDAO.getReviews();
  res.json(reviews);
});

router.route("/").post(async (req, res) => {
  const { movieTitle, reviewer, reviewText } = req.body;
  const response = await ReviewsDAO.addReview(movieTitle, reviewer, reviewText);
  res.json(response);
});

router.post("/follow", async (req, res) => {
  const { reviewer } = req.body;
  const result = await ReviewsDAO.followReviewer(reviewer);
  res.json(result);
});

router.get("/follow/:reviewer", async (req, res) => {
  const result = await ReviewsDAO.getFollowCount(req.params.reviewer);
  res.json(result);
});

module.exports = router;
