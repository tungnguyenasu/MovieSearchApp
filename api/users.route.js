const express = require("express");
const UsersDAO = require("./usersDAO.js");

const router = express.Router();

// Sign up route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, phone, username } = req.body;
    
    // Input validation
    if (!name || !password) {
      return res.status(400).json({ 
        error: "Missing required fields. Please provide username/phone/email and password." 
      });
    }
    
    if (typeof name !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ 
        error: "Name and password must be strings." 
      });
    }
    
    if (name.trim().length === 0 || password.trim().length === 0) {
      return res.status(400).json({ 
        error: "Fields cannot be empty or contain only whitespace." 
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ 
        error: "Password must be at least 6 characters long." 
      });
    }
    
    // Email validation (if email is provided)
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          error: "Please provide a valid email address." 
        });
      }
    }
    
    const result = await UsersDAO.createUser(name.trim(), email?.trim().toLowerCase(), password, phone?.trim(), username?.trim());
    
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }
    
    res.status(201).json({ 
      message: "User created successfully", 
      user: result.user
    });
  } catch (error) {
    console.error("Error in POST /signup:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Input validation
    if (!email || !password) {
      return res.status(400).json({ 
        error: "Missing required fields. Please provide email and password." 
      });
    }
    
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ 
        error: "All fields must be strings." 
      });
    }
    
    if (email.trim().length === 0 || password.trim().length === 0) {
      return res.status(400).json({ 
        error: "Fields cannot be empty or contain only whitespace." 
      });
    }
    
    const result = await UsersDAO.authenticateUser(email.trim().toLowerCase(), password);
    
    if (result.error) {
      return res.status(401).json({ error: result.error });
    }
    
    res.json({ 
      message: "Login successful", 
      user: result.user
    });
  } catch (error) {
    console.error("Error in POST /login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
