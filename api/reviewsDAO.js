let reviews;
let follows;

class ReviewsDAO {
  static async injectDB(conn) {
    if (reviews) return;
    try {
      if (conn) {
        const db = conn.db("movieReviews");
        reviews = await db.collection("reviews");
        follows = await db.collection("follows");
      } else {
        // In-memory fallback for local testing when MongoDB is unavailable
        const memory = [];
        const followsMemory = [];
        reviews = {
          insertOne: async doc => {
            const _id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
            memory.unshift({ ...doc, _id });
            return { insertedId: _id, acknowledged: true };
          },
          find: () => ({
            sort: () => ({ toArray: async () => memory.slice() })
          })
        };
        follows = {
          insertOne: async doc => {
            followsMemory.unshift({ ...doc });
            return { acknowledged: true };
          },
          countDocuments: async filter => followsMemory.filter(f => f.reviewer === filter.reviewer).length
        };
      }
    } catch (e) {
      console.error(`Unable to establish collection handles: ${e}`);
    }
  }

  static async addReview(movieTitle, reviewer, reviewText) {
    try {
      const reviewDoc = {
        movieTitle,
        reviewer,
        reviewText,
        createdAt: new Date()
      };
      return await reviews.insertOne(reviewDoc);
    } catch (e) {
      console.error(`Unable to add review: ${e}`);
      return { error: e };
    }
  }

  static async getReviews() {
    return await reviews.find().sort({ createdAt: -1 }).toArray();
  }

  static async followReviewer(reviewer) {
    try {
      const doc = { reviewer, createdAt: new Date() };
      const result = await follows.insertOne(doc);
      return result;
    } catch (e) {
      return { error: e };
    }
  }

  static async getFollowCount(reviewer) {
    try {
      const followers = await follows.countDocuments({ reviewer });
      return { reviewer, followers };
    } catch (e) {
      return { error: e };
    }
  }
}

module.exports = ReviewsDAO;
