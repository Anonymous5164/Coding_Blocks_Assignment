const express = require('express');
const jwt = require('jsonwebtoken');
const { Client } = require('pg');
const app = express();
const port = 3001;

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
app.get('/', async (req, res) => {
  try {
    // Basic test data to verify the service is working
    const testData = {
      message: 'Blog Service is working',
      status: 'success',
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(testData);
  } catch (error) {
    res.status(500).json({ message: 'Error in the test endpoint', error });
  }
});

// Create a new blog post
app.post('/blogs', authenticateJWT, async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.userId;

  try {
    const result = await dbClient.query(
      'INSERT INTO blogs (user_id, title, content) VALUES ($1, $2, $3) RETURNING *',
      [userId, title, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error creating blog post', error });
  }
});

// List all blog posts with pagination
app.get('/blogs', async (req, res) => {
  
  try {
    const result = await dbClient.query(
      'SELECT * FROM blogs ORDER BY id DESC',
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blogs', error });
  }
});

// Fetch a specific blog post by ID
app.get('/blogs/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await dbClient.query('SELECT * FROM blogs WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog post', error });
  }
});

// Edit an existing blog post
app.put('/blogs/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const userId = req.user.userId;

  try {
    const result = await dbClient.query(
      'UPDATE blogs SET title = $1, content = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
      [title, content, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized or blog post not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating blog post', error });
  }
});

// Delete a specific blog post
app.delete('/blogs/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const result = await dbClient.query(
      'DELETE FROM blogs WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized or blog post not found' });
    }

    res.json({ message: 'Blog post deleted successfully', blog: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blog post', error });
  }
});

app.listen(port, () => {
  console.log(`Blog service listening at http://localhost:${port}`);
});
