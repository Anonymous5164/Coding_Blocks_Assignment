
const express = require('express');
const jwt = require('jsonwebtoken');
const { Client } = require('pg');
const app = express();
const port = 3002;

app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;

const dbClient = new Client({
  host: 'ep-summer-hat-a5gdpui4.us-east-2.aws.neon.tech',
  user: 'neondb_owner',
  password: 'SLpYHNZEcA35',
  database: 'neondb',
  ssl: {
    rejectUnauthorized: false, // Allow SSL without verifying the certificate
  },
});


dbClient.connect().catch(err => console.error('Database connection error:', err));

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) return res.status(403).json({ message: 'Token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    req.user = user;
    next();
  });
};

// Add a comment to a blog post
app.post('/comments', authenticateJWT, async (req, res) => {
  const { blogId, content } = req.body;
  const userId = req.user.userId;

  try {
    const result = await dbClient.query(
      'INSERT INTO comments (user_id, blog_id, content) VALUES ($1, $2, $3) RETURNING *',
      [userId, blogId, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error });
  }
});

// Get comments for a specific blog post
app.get('/comments', async (req, res) => {
  const { post_id } = req.query;

  if (!post_id) {
    return res.status(400).json({ message: 'post_id query parameter is required' });
  }

  try {
    const result = await dbClient.query('SELECT * FROM comments WHERE blog_id = $1', [post_id]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments', error });
  }
});

app.listen(port, () => {
  console.log(`Comment service listening at http://localhost:${port}`);
});
