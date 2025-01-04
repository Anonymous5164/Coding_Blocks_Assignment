
const express = require('express');
const jwt = require('jsonwebtoken');
const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const app = express();
const port = 3000;

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

// Register user route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await dbClient.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, hashedPassword]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});

// Login route (returns JWT token)
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const result = await dbClient.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];
    
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

// Get user details
app.get('/users/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await dbClient.query('SELECT id, username FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user details', error });
  }
});

// Edit user details
app.put('/users/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;

  try {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    const result = await dbClient.query(
      'UPDATE users SET username = COALESCE($1, username), password = COALESCE($2, password) WHERE id = $3 RETURNING id, username',
      [username, hashedPassword, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user details', error });
  }
});

// Delete user
app.delete('/users/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await dbClient.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
});

app.listen(port, () => {
  console.log(`User service listening at http://localhost:${port}`);
});
