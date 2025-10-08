// Direct TMDB API calls with CORS handling
const APILINK = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=96ce2b9cc1699d2d6702f8dceaafb5ec&page=1';
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=96ce2b9cc1699d2d6702f8dceaafb5ec&query=";

// Global variables for user authentication
let currentUser = null;
let currentMovie = null;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
const main = document.getElementById("section");
const form = document.getElementById("form");
const search = document.getElementById("query");
  const homeLink = document.getElementById("homeLink");
  
  // Authentication elements
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const userInfo = document.getElementById("userInfo");
  
  // Modal elements
  const loginModal = document.getElementById("loginModal");
  const signupModal = document.getElementById("signupModal");
  const movieModal = document.getElementById("movieModal");
  
  // Modal close buttons
  const closeLogin = document.getElementById("closeLogin");
  const closeSignup = document.getElementById("closeSignup");
  const closeMovie = document.getElementById("closeMovie");

  // Load movies when page is ready
  returnMovies(APILINK);

function returnMovies(url){
    // Show loading message
    main.innerHTML = '<div style="color: white; text-align: center; padding: 40px;">Loading movies...</div>';
    
    fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors'
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
    .then(function(data){
        console.log('API Response:', data);
        console.log('Results:', data.results);
        main.innerHTML = ''; // Clear loading message
        
        if (!data.results || data.results.length === 0) {
          console.log('No results found in API response');
          main.innerHTML = '<div style="color: #b3b3b3; text-align: center; padding: 40px;">No movies found. Try a different search term.</div>';
          return;
        }
        
      data.results.forEach(element => {
        const div_card = document.createElement('div');
        div_card.setAttribute('class', 'card');
          div_card.addEventListener('click', () => showMovieDetails(element));
        
        const div_row = document.createElement('div');
        div_row.setAttribute('class', 'row');
        
        const div_column = document.createElement('div');
        div_column.setAttribute('class', 'column');
        
        const image = document.createElement('img');
        image.setAttribute('class', 'thumbnail');
        image.setAttribute('id', 'image');
          image.alt = element.title; // Add alt text for accessibility
        
        const title = document.createElement('h3');
        title.setAttribute('id', 'title');
        
        const center = document.createElement('div');
        center.style.textAlign = 'center';
  
        title.innerHTML = `${element.title}`;
        image.src = IMG_PATH + element.poster_path;

        center.appendChild(image);
        div_card.appendChild(center);
        div_card.appendChild(title);
        div_column.appendChild(div_card);
        div_row.appendChild(div_column);

        main.appendChild(div_row);
    });
      })
      .catch(function(error) {
        console.error('Error fetching movies:', error);
        console.error('Error details:', error.message);
        main.innerHTML = '<div style="color: #ff6b6b; text-align: center; padding: 40px;">Error loading movies: ' + error.message + '. Please check your internet connection and try again.</div>';
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
    console.log("Search form submitted");

    const searchItem = search.value.trim();
    console.log("Search term:", searchItem);

  if (searchItem) {
      const searchUrl = SEARCHAPI + encodeURIComponent(searchItem);
      console.log("Search URL:", searchUrl);
      returnMovies(searchUrl);
    search.value = "";
    } else {
      // If search is empty, show popular movies
      console.log("Empty search, showing popular movies");
      returnMovies(APILINK);
    }
  });

  // Home link functionality - return to popular movies
  homeLink.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("Home link clicked - returning to popular movies");
    search.value = ""; // Clear search box
    returnMovies(APILINK);
  });

  // Authentication Functions
  function updateAuthUI() {
    if (currentUser) {
      loginBtn.style.display = 'none';
      signupBtn.style.display = 'none';
      userInfo.style.display = 'inline';
      userInfo.textContent = `Welcome, ${currentUser.name}`;
      logoutBtn.style.display = 'inline-block';
    } else {
      loginBtn.style.display = 'inline-block';
      signupBtn.style.display = 'inline-block';
      userInfo.style.display = 'none';
      logoutBtn.style.display = 'none';
    }
  }

  function showModal(modal) {
    modal.style.display = 'flex';
  }

  function hideModal(modal) {
    modal.style.display = 'none';
  }

  // Modal event listeners
  loginBtn.addEventListener("click", () => showModal(loginModal));
  signupBtn.addEventListener("click", () => showModal(signupModal));
  logoutBtn.addEventListener("click", () => {
    currentUser = null;
    updateAuthUI();
    localStorage.removeItem('currentUser');
  });

  closeLogin.addEventListener("click", () => hideModal(loginModal));
  closeSignup.addEventListener("click", () => hideModal(signupModal));
  closeMovie.addEventListener("click", () => hideModal(movieModal));

  // Close modals when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === loginModal) hideModal(loginModal);
    if (e.target === signupModal) hideModal(signupModal);
    if (e.target === movieModal) hideModal(movieModal);
  });

  // Enhanced form validation
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validatePassword(password) {
    return password.length >= 6;
  }

  function validatePhone(phone) {
    if (!phone) return true; // Phone is optional
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  function showFieldError(inputId, message) {
    const inputGroup = document.querySelector(`#${inputId}`).closest('.input-group');
    inputGroup.classList.add('error');
    
    let errorElement = inputGroup.querySelector('.error-message');
    if (!errorElement) {
      errorElement = document.createElement('span');
      errorElement.className = 'error-message';
      inputGroup.appendChild(errorElement);
    }
    errorElement.textContent = message;
  }

  function clearFieldError(inputId) {
    const inputGroup = document.querySelector(`#${inputId}`).closest('.input-group');
    inputGroup.classList.remove('error');
    const errorElement = inputGroup.querySelector('.error-message');
    if (errorElement) {
      errorElement.remove();
    }
  }

  function setLoadingState(button, isLoading) {
    if (isLoading) {
      button.classList.add('loading');
      button.disabled = true;
    } else {
      button.classList.remove('loading');
      button.disabled = false;
    }
  }

  // Email continue button handler
  document.getElementById("emailContinueBtn").addEventListener("click", () => {
    const email = document.getElementById("loginEmail").value.trim();
    
    if (!email) {
      alert("Please enter your email address");
      return;
    }
    
    if (!validateEmail(email)) {
      alert("Please enter a valid email address");
      return;
    }
    
    // Show password section
    document.getElementById("passwordSection").style.display = "block";
    document.getElementById("emailContinueBtn").style.display = "none";
  });

  // Login submit handler
  document.getElementById("loginSubmitBtn").addEventListener("click", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const submitBtn = e.target;

    // Validation
    if (!password) {
      alert("Please enter your password");
      return;
    }

    setLoadingState(submitBtn, true);

    try {
      const response = await fetch("/api/v1/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (response.ok) {
        currentUser = data.user;
        updateAuthUI();
        hideModal(loginModal);
        document.getElementById("loginEmail").value = "";
        document.getElementById("loginPassword").value = "";
        document.getElementById("passwordSection").style.display = "none";
        document.getElementById("emailContinueBtn").style.display = "block";
        showSuccessMessage("Login successful! Welcome back!");
      } else {
        alert(`Login failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    } finally {
      setLoadingState(submitBtn, false);
    }
  });

  // Signup form handler
  document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("signupUsername").value.trim();
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("signupConfirmPassword").value;
    const submitBtn = e.target.querySelector('button[type="submit"]');

    // Validation
    let hasErrors = false;
    if (!username) {
      alert('Username or phone number is required');
      hasErrors = true;
    } else if (username.length < 3) {
      alert('Username must be at least 3 characters');
      hasErrors = true;
    }

    if (!password) {
      alert('Password is required');
      hasErrors = true;
    } else if (!validatePassword(password)) {
      alert('Password must be at least 6 characters');
      hasErrors = true;
    }

    if (!confirmPassword) {
      alert('Please confirm your password');
      hasErrors = true;
    } else if (password !== confirmPassword) {
      alert('Passwords do not match');
      hasErrors = true;
    }

    if (hasErrors) return;

    setLoadingState(submitBtn, true);

    try {
      // Determine if username is email, phone, or username
      let userData = { password };
      
      if (validateEmail(username)) {
        userData.email = username;
        userData.name = username.split('@')[0]; // Use email prefix as name
      } else if (validatePhone(username)) {
        userData.phone = username;
        userData.name = `User_${username.slice(-4)}`; // Use last 4 digits as name
      } else {
        userData.name = username;
        userData.username = username;
      }

      const response = await fetch("/api/v1/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      if (response.ok) {
        currentUser = data.user;
        updateAuthUI();
        hideModal(signupModal);
        document.getElementById("signupForm").reset();
        showSuccessMessage("Account created successfully! Welcome to MovieSite!");
      } else {
        alert(`Signup failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Signup failed. Please try again.");
    } finally {
      setLoadingState(submitBtn, false);
    }
  });

  // Social authentication handlers (removed - no longer needed)

  // Modal switching
  const switchToSignupEl = document.getElementById("switchToSignup");
  if (switchToSignupEl) {
    switchToSignupEl.addEventListener("click", (e) => {
      e.preventDefault();
      hideModal(loginModal);
      showModal(signupModal);
    });
  }

  // Local handler (used by direct listener and delegated listener)
  function openLoginFromSignup(event) {
    if (event) event.preventDefault();
    try {
      console.log("Switch to login clicked");
      const signupModal = document.getElementById("signupModal");
      const loginModal = document.getElementById("loginModal");
      
      if (signupModal) {
        signupModal.style.display = 'none';
      }
      if (loginModal) {
        loginModal.style.display = 'flex';
        loginModal.style.zIndex = "1001";
      }
      console.log("Modal switch completed");
    } catch (err) {
      console.error("Failed to open login modal:", err);
    }
  }

  const switchToLoginEl = document.getElementById("switchToLogin");
  if (switchToLoginEl) {
    switchToLoginEl.setAttribute('href', '#login');
    switchToLoginEl.addEventListener("click", openLoginFromSignup);
  }

  // Defensive: delegate click in case DOM changes or listener isn't bound
  document.addEventListener('click', (evt) => {
    const link = evt.target.closest('#switchToLogin');
    if (link) {
      openLoginFromSignup(evt);
    }
  });

  // Open login modal if URL hash requests it
  if (window.location.hash === '#login') {
    if (typeof showModal === 'function' && loginModal) {
      showModal(loginModal);
    }
  }

  // Social authentication handler
  function handleSocialAuth(provider, action) {
    // For demo purposes, we'll simulate social auth
    // In a real app, you'd integrate with actual OAuth providers
    const providerNames = {
      google: 'Google',
      apple: 'Apple'
    };

    const actionText = action === 'login' ? 'Sign in' : 'Sign up';
    
    // Simulate social authentication
    setTimeout(() => {
      const mockUser = {
        id: `social_${provider}_${Date.now()}`,
        name: `User from ${providerNames[provider]}`,
        email: `user@${provider}.com`,
        provider: provider
      };
      
      currentUser = mockUser;
      updateAuthUI();
      hideModal(action === 'login' ? loginModal : signupModal);
      showSuccessMessage(`${actionText} with ${providerNames[provider]} successful!`);
    }, 1500);

    showSuccessMessage(`Redirecting to ${providerNames[provider]}...`);
  }

  // Success message function
  function showSuccessMessage(message) {
    // Create a temporary success message
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #28a745, #20c997);
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
      z-index: 10000;
      font-weight: 500;
      animation: slideIn 0.3s ease;
    `;
    successDiv.textContent = message;
    
    // Add animation keyframes
    if (!document.querySelector('#success-animation')) {
      const style = document.createElement('style');
      style.id = 'success-animation';
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(successDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
      successDiv.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        if (successDiv.parentNode) {
          successDiv.parentNode.removeChild(successDiv);
        }
      }, 300);
    }, 3000);
  }

// Fetch and display existing reviews on page load
async function loadReviews() {
  const response = await fetch("http://localhost:8000/api/v1/reviews");
  const reviews = await response.json();
  const reviewsSection = document.getElementById("reviews-section");
  reviewsSection.innerHTML = "";

  reviews.forEach((r) => {
    const div = document.createElement("div");
    div.className = "review-box";
    div.innerHTML = `
      <h4>${r.movieTitle}</h4>
      <p><strong>${r.reviewer}:</strong> ${r.reviewText}</p>
    `;
    reviewsSection.appendChild(div);
  });
}


  // Handle review form submission
  const reviewForm = document.getElementById("reviewForm");
  if (reviewForm) {
    reviewForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const movieTitle = document.getElementById("movieTitle").value;
      const reviewer = document.getElementById("reviewer").value;
      const reviewText = document.getElementById("reviewText").value;

      const response = await fetch("http://localhost:8000/api/v1/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movieTitle, reviewer, reviewText }),
      });

      if (response.ok) {
        alert("Review submitted!");
        reviewForm.reset();
        loadReviews();
      } else {
        alert("Failed to submit review.");
      }
    });
  }

  // Load reviews initially
  loadReviews();

  // Movie Details and Review Functions
  async function showMovieDetails(movie) {
    currentMovie = movie;
    const movieDetails = document.getElementById("movieDetails");
    const movieReviews = document.getElementById("movieReviews");
    const addReviewSection = document.getElementById("addReviewSection");
    
    // Display movie details
    movieDetails.innerHTML = `
      <div class="movie-detail-card">
        <img src="${IMG_PATH + movie.poster_path}" alt="${movie.title}" class="movie-poster">
        <div class="movie-info">
          <h2>${movie.title}</h2>
          <p>${movie.overview || 'No description available'}</p>
          <div class="movie-meta">
            <div class="meta-item"><strong>Release Date:</strong> ${movie.release_date || 'N/A'}</div>
            <div class="meta-item"><strong>Rating:</strong> ${movie.vote_average ? movie.vote_average.toFixed(1) + '/10' : 'N/A'}</div>
            <div class="meta-item"><strong>Votes:</strong> ${movie.vote_count || 0}</div>
          </div>
        </div>
      </div>
    `;
    
    // Load reviews for this movie
    await loadMovieReviews(movie.id);
    
    // Show/hide add review section based on authentication
    if (currentUser) {
      addReviewSection.style.display = 'block';
    } else {
      addReviewSection.style.display = 'none';
    }
    
    showModal(movieModal);
  }

  async function loadMovieReviews(movieId) {
    try {
      const response = await fetch(`/api/v1/reviews/movie/${movieId}`);
      const reviews = await response.json();
      const movieReviews = document.getElementById("movieReviews");
      
      movieReviews.innerHTML = '<h3>Reviews</h3>';
      
      if (reviews.length === 0) {
        movieReviews.innerHTML += '<p style="color: #b3b3b3; font-style: italic;">No reviews yet. Be the first to write one!</p>';
        return;
      }
      
      reviews.forEach(review => {
        const reviewDiv = document.createElement('div');
        reviewDiv.className = 'review-item';
        reviewDiv.innerHTML = `
          <div class="review-author">${review.reviewer}</div>
          <div class="review-text">${review.reviewText}</div>
          <div class="review-date">${new Date(review.createdAt).toLocaleDateString()}</div>
        `;
        movieReviews.appendChild(reviewDiv);
      });
    } catch (error) {
      console.error('Error loading movie reviews:', error);
      document.getElementById("movieReviews").innerHTML = '<h3>Reviews</h3><p style="color: #ff6b6b;">Error loading reviews.</p>';
    }
  }

  // Add review form handler
  document.getElementById("addReviewForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert("Please login to add a review.");
      return;
    }
    
    if (!currentMovie) {
      alert("No movie selected.");
      return;
    }
    
    const reviewText = document.getElementById("reviewText").value.trim();
    
    if (!reviewText) {
      alert("Please enter a review.");
      return;
    }
    
    try {
      const response = await fetch("/api/v1/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieTitle: currentMovie.title,
          movieId: currentMovie.id.toString(),
          reviewText: reviewText,
          userId: currentUser.id,
          userName: currentUser.name
        })
      });
      
      const data = await response.json();
      if (response.ok) {
        alert("Review added successfully!");
        document.getElementById("reviewText").value = "";
        await loadMovieReviews(currentMovie.id);
      } else {
        alert(`Failed to add review: ${data.error}`);
      }
    } catch (error) {
      console.error("Error adding review:", error);
      alert("Failed to add review. Please try again.");
    }
  });

  // Initialize authentication UI
  updateAuthUI();

}); // End of DOMContentLoaded event

