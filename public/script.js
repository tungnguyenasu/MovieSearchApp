const APILINK = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=96ce2b9cc1699d2d6702f8dceaafb5ec&page=1';
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=96ce2b9cc1699d2d6702f8dceaafb5ec&query=";

const main = document.getElementById("section");
const form = document.getElementById("form");
const search = document.getElementById("query");

returnMovies(APILINK)
function returnMovies(url){
  fetch(url).then(res => res.json())
    .then(function(data){
      console.log(data.results);
      data.results.forEach(element => {
        const div_card = document.createElement('div');
        div_card.setAttribute('class', 'card');
        
        const div_row = document.createElement('div');
        div_row.setAttribute('class', 'row');
        
        const div_column = document.createElement('div');
        div_column.setAttribute('class', 'column');
        
        const image = document.createElement('img');
        image.setAttribute('class', 'thumbnail');
        image.setAttribute('id', 'image');
        
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
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  main.innerHTML = '';

  const searchItem = search.value;

  if (searchItem) {
    returnMovies(SEARCHAPI + searchItem);
    search.value = "";
  }
});

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

  async function loadCustomMovies() {
    const res = await fetch("/api/v1/movies");
    const movies = await res.json();
    const container = document.getElementById("user-movies");
    container.innerHTML = ""; // clear existing
  
    movies.forEach(movie => {
      const card = document.createElement("div");
      card.className = "card";
  
      const image = document.createElement("img");
      image.className = "thumbnail";
      image.src = movie.poster;
      image.alt = movie.title;
  
      const title = document.createElement("h3");
      title.className = "movie-title";
      title.innerText = movie.title;
  
      const desc = document.createElement("p");
      desc.className = "movie-overview";
      desc.innerText = movie.description;
  
      const likeBtn = document.createElement("button");
      likeBtn.textContent = `👍 Like (${movie.likes || 0})`;
      likeBtn.addEventListener("click", async () => {
        await fetch(`/api/v1/movies/${movie._id}/like`, { method: "POST" });
        loadCustomMovies();
      });

      // Comments UI
      const commentsWrap = document.createElement("div");
      commentsWrap.style.marginTop = "8px";

      const commentsList = document.createElement("div");
      commentsList.className = "comments";
      commentsWrap.appendChild(commentsList);

      const commentForm = document.createElement("form");
      commentForm.innerHTML = `
        <input type="text" name="author" placeholder="Your name" required style="margin-right:6px;">
        <input type="text" name="text" placeholder="Add a comment" required style="margin-right:6px;">
        <button type="submit">Comment</button>
      `;
      commentForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const author = commentForm.elements.namedItem("author").value;
        const text = commentForm.elements.namedItem("text").value;
        await fetch(`/api/v1/movies/${movie._id}/comments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ author, text })
        });
        commentForm.reset();
        await renderComments();
      });

      async function renderComments() {
        const res = await fetch(`/api/v1/movies/${movie._id}/comments`);
        const list = await res.json();
        commentsList.innerHTML = "";
        list.forEach(c => {
          const item = document.createElement("div");
          item.textContent = `${c.author}: ${c.text}`;
          commentsList.appendChild(item);
        });
      }

      card.appendChild(image);
      card.appendChild(title);
      card.appendChild(desc);
      card.appendChild(likeBtn);
      card.appendChild(commentsWrap);
      card.appendChild(commentForm);
  
      container.appendChild(card);

      renderComments();
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

  document.getElementById("addMovieForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("newTitle").value;
    const poster = document.getElementById("newPoster").value;
    const desc = document.getElementById("newDesc").value;

    const res = await fetch("/api/v1/movies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, poster, description: desc })
    });

    if (res.ok) {
      alert("Movie added!");
      e.target.reset();
      loadCustomMovies();  // load your own DB movies
    }
  });
}





