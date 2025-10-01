# 🎬 Movie Search and Review Web App

This is a full-stack movie search and review web application built using **Node.js**, **Express**, **MongoDB**, and **vanilla JavaScript/CSS**. It allows users to search movies and leave reviews with their name, movie title, and feedback.

---

## ✨ Features

- 🔍 **Movie Search** – Fetch movies from a MongoDB database
- 💬 **User Reviews** – Add and retrieve reviews for listed movies
- 📡 **RESTful API** – Built using Express with separate route and DAO layers
- 🗂 **Clean MVC Structure** – Well-organized folders for API routes, data access, and frontend

---

## 📁 Project Structure

```
SummerProject2025/
├── api/
│   ├── movies.route.js           # Routes for movie endpoints
│   ├── reviews.route.js          # Routes for review endpoints
│
├── dao/
│   ├── moviesDAO.js              # DAO for movies
│   ├── reviewsDAO.js             # DAO for reviews
│
├── public/
│   ├── index.html                # Frontend HTML file
│   ├── style.css                 # Styling
│
├── .env                          # Contains MongoDB URI (not pushed)
├── .gitignore                    # Ignores node_modules, .env, etc.
├── package.json                  # Project metadata and dependencies
├── server.js                     # Express backend entry point
├── README.md                     # This file
```

---

## 🏗️ Tech Stack

| Layer       | Technology         |
|-------------|--------------------|
| Frontend    | HTML, CSS, JavaScript |
| Backend     | Node.js, Express.js |
| Database    | MongoDB Atlas |
| API         | RESTful Routes |

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/SummerProject2025.git
cd SummerProject2025
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/?retryWrites=true&w=majority
```

> ⚠️ Never commit your `.env` file to GitHub.

### 4. Start the Server

```bash
npm start
```

Visit `http://localhost:8000` in your browser.

---

## 📡 API Endpoints

| Method | Endpoint              | Description                  |
|--------|------------------------|------------------------------|
| GET    | `/api/v1/movies`       | Get list of movies           |
| GET    | `/api/v1/reviews`      | Get all reviews              |
| POST   | `/api/v1/reviews`      | Submit a new review          |

---

## 🧪 Local Testing Instructions

You can test the API using Postman or CURL:

### Example POST Review:

```bash
curl -X POST http://localhost:8000/api/v1/reviews -H "Content-Type: application/json" -d '{
  "movieTitle": "Inception",
  "reviewer": "Tung Nguyen",
  "reviewText": "Mind-blowing concept!"
}'
```

---

## 🧑‍💻 Author

**Tung Nguyen**  
Computer Science Student @ Arizona State University  
GitHub: [@yourusername](https://github.com/yourusername)

---

## 📜 License

This project is for educational purposes only.