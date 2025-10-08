let users;

class UsersDAO {
  static async injectDB(conn) {
    if (users) return;
    try {
      if (conn) {
        const db = conn.db("movieReviews");
        users = await db.collection("users");
      } else {
        // In-memory fallback for local testing when MongoDB is unavailable
        const memory = [];
        users = {
          insertOne: async doc => {
            const _id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
            memory.unshift({ ...doc, _id });
            return { insertedId: _id, acknowledged: true };
          },
          findOne: async filter => {
            return memory.find(user => {
              if (filter.email) return user.email === filter.email;
              if (filter._id) return user._id === filter._id;
              return false;
            });
          }
        };
      }
    } catch (e) {
      console.error(`Unable to establish collection handles: ${e}`);
    }
  }

  static async createUser(name, email = null, password, phone = null, username = null) {
    try {
      // Check if user already exists (by email, phone, or username)
      const existingUser = await users.findOne({ 
        $or: [
          { email: email },
          { phone: phone },
          { username: username }
        ].filter(Boolean) // Remove null/undefined values
      });
      
      if (existingUser) {
        if (existingUser.email === email) {
          return { error: "User already exists with this email" };
        } else if (existingUser.phone === phone) {
          return { error: "User already exists with this phone number" };
        } else if (existingUser.username === username) {
          return { error: "User already exists with this username" };
        }
      }

      // Simple password hashing (in production, use bcrypt)
      const hashedPassword = Buffer.from(password).toString('base64');
      
      const userDoc = {
        name,
        email: email || null,
        password: hashedPassword,
        phone: phone || null,
        username: username || null,
        createdAt: new Date()
      };
      
      const result = await users.insertOne(userDoc);
      return { 
        success: true, 
        userId: result.insertedId,
        user: { 
          id: result.insertedId,
          name, 
          email, 
          phone, 
          username 
        }
      };
    } catch (e) {
      console.error(`Unable to create user: ${e}`);
      return { error: e };
    }
  }

  static async authenticateUser(email, password) {
    try {
      const user = await users.findOne({ email });
      if (!user) {
        return { error: "User not found" };
      }

      // Simple password verification (in production, use bcrypt)
      const hashedPassword = Buffer.from(password).toString('base64');
      if (user.password !== hashedPassword) {
        return { error: "Invalid password" };
      }

      return { 
        success: true, 
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email 
        }
      };
    } catch (e) {
      console.error(`Unable to authenticate user: ${e}`);
      return { error: e };
    }
  }

  static async getUserById(userId) {
    try {
      const user = await users.findOne({ _id: userId });
      if (!user) {
        return { error: "User not found" };
      }

      return { 
        success: true, 
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email 
        }
      };
    } catch (e) {
      console.error(`Unable to get user: ${e}`);
      return { error: e };
    }
  }
}

module.exports = UsersDAO;
