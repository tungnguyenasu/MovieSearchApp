let movies;
let comments;
class MoviesDAO {
  static async injectDB(conn) {
    if (movies) return;
    if (conn) {
      movies = await conn.db("movieReviews").collection("movies");
      comments = await conn.db("movieReviews").collection("movieComments");
    } else {
      // In-memory fallback for local testing when MongoDB is unavailable
      const memory = [];
      const commentsMemory = [];
      movies = {
        insertOne: async doc => {
          const _id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
          memory.unshift({ ...doc, _id });
          return { insertedId: _id, acknowledged: true };
        },
        find: () => ({
          sort: () => ({ toArray: async () => memory.slice() })
        })
      };
      comments = {
        insertOne: async doc => {
          commentsMemory.unshift({ ...doc });
          return { acknowledged: true };
        },
        find: (filter) => ({
          sort: () => ({ toArray: async () => commentsMemory.filter(c => c.movieId === filter.movieId) })
        })
      };
    }
  }

  static async addMovie(title, poster, description) {
    const doc = { title, poster, description, likes: 0, createdAt: new Date() };
    return await movies.insertOne(doc);
  }

  static async getMovies() {
    return await movies.find().sort({ createdAt: -1 }).toArray();
  }

  static async likeMovie(id) {
    try {
      // Lazy import to avoid top-level dependency when using in-memory fallback
      const { ObjectId } = require("mongodb");
      const filter = { _id: new ObjectId(id) };
      const update = { $inc: { likes: 1 } };
      const options = { returnDocument: "after" };
      if (typeof movies.findOneAndUpdate === "function") {
        const result = await movies.findOneAndUpdate(filter, update, options);
        return result && (result.value || result);
      }
      // In-memory fallback not supporting like by id for simplicity
      return { error: "Like not supported in memory mode" };
    } catch (e) {
      return { error: e && e.message ? e.message : String(e) };
    }
  }

  static async addComment(movieId, author, text) {
    try {
      const { ObjectId } = require("mongodb");
      const doc = {
        movieId: typeof movieId === "string" ? movieId : String(movieId),
        author,
        text,
        createdAt: new Date()
      };
      if (typeof comments.insertOne === "function") {
        if (comments.collectionName) {
          // Mongo path: normalize movieId to ObjectId for consistency
          doc.movieId = new ObjectId(movieId);
        }
        const result = await comments.insertOne(doc);
        return result;
      }
      return { error: "Comments not supported in memory mode" };
    } catch (e) {
      return { error: e && e.message ? e.message : String(e) };
    }
  }

  static async getComments(movieId) {
    try {
      const { ObjectId } = require("mongodb");
      const filter = comments.collectionName ? { movieId: new ObjectId(movieId) } : { movieId };
      const list = await comments.find(filter).sort({ createdAt: -1 }).toArray();
      return list;
    } catch (e) {
      return { error: e && e.message ? e.message : String(e) };
    }
  }
}

module.exports = MoviesDAO;
