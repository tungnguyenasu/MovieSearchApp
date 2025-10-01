// index.js
require("dotenv").config({ path: "./mongo.env", override: true });

const app = require("./server.js");
const mongodb = require("mongodb");
const ReviewsDAO = require("./api/reviewsDAO.js");
const MoviesDAO = require("./api/moviesDAO.js");

const MongoClient = mongodb.MongoClient;
const mongo_username = process.env["MONGO_USERNAME"];
const mongo_password = process.env["MONGO_PASSWORD"];
if (!mongo_username || !mongo_password) {
  console.warn("Env vars MONGO_USERNAME or MONGO_PASSWORD are missing. Check mongo.env");
}

// MongoDB connection URI using environment variables
// Prefer a fully specified MONGODB_URI if provided
const uri = process.env.MONGODB_URI || (() => {
  const passwordIsEncoded = /%[0-9A-Fa-f]{2}/.test(mongo_password);
  const passwordForUri = passwordIsEncoded ? mongo_password : encodeURIComponent(mongo_password);
  return `mongodb+srv://${mongo_username}:${passwordForUri}@movie-review.pkzkpou.mongodb.net/?retryWrites=true&w=majority&appName=movie-review`;
})();
const port = 8000;

MongoClient.connect(
  uri,
  {
    maxPoolSize: 50,
    wtimeoutMS: 2500
  }
)
  .catch(err => {
    console.error("MongoDB connection failed, starting in in-memory mode.");
    console.error(err && err.message ? err.message : err);
    return null;
  })
  .then(async client => {
    await ReviewsDAO.injectDB(client);
    await MoviesDAO.injectDB(client);
    app.listen(port, () => {
      console.log(`🚀 listening on port ${port}`);
      if (!client) {
        console.log("Running with in-memory data store (MongoDB not connected).\nThis is for local testing only.");
      }
    });
  });
