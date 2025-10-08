const express = require("express");
const ReviewsDAO = require("./reviewsDAO.js");

const router = express.Router();

router.route("/").get(async (req, res) => {
  const reviews = await ReviewsDAO.getReviews();
  res.json(reviews);
});

router.route("/").post(async (req, res) => {
  try {
    const { movieTitle, movieId, reviewText, userId, userName } = req.body;
    
    // Input validation
    if (!movieTitle || !reviewText || !userId || !userName) {
      return res.status(400).json({ 
        error: "Missing required fields. Please provide movieTitle, reviewText, userId, and userName." 
      });
    }
    
    if (typeof movieTitle !== 'string' || typeof reviewText !== 'string' || typeof userName !== 'string') {
      return res.status(400).json({ 
        error: "All text fields must be strings." 
      });
    }
    
    if (movieTitle.trim().length === 0 || reviewText.trim().length === 0 || userName.trim().length === 0) {
      return res.status(400).json({ 
        error: "Fields cannot be empty or contain only whitespace." 
      });
    }
    
    if (reviewText.length > 1000) {
      return res.status(400).json({ 
        error: "Review text is too long. Maximum 1000 characters allowed." 
      });
    }
    
    const response = await ReviewsDAO.addReview(
      movieTitle.trim(), 
      userName.trim(), 
      reviewText.trim(),
      movieId,
      userId
    );
    
    if (response.error) {
      return res.status(500).json({ error: "Failed to add review to database." });
    }
    
    res.status(201).json({ 
      message: "Review added successfully", 
      review: { movieTitle, userName, reviewText, movieId, userId, createdAt: new Date() }
    });
  } catch (error) {
    console.error("Error in POST /reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
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

// Get reviews by movie ID
router.get("/movie/:movieId", async (req, res) => {
  try {
    const { movieId } = req.params;
    const reviews = await ReviewsDAO.getReviewsByMovieId(movieId);
    res.json(reviews);
  } catch (error) {
    console.error("Error in GET /reviews/movie/:movieId:", error);
    res.status(500).json({ error: "Failed to fetch reviews for movie" });
  }
});

module.exports = router;
