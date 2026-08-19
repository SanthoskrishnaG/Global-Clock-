const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const USERS_FILE = path.join(__dirname, 'src', 'users.json');

app.use(cors());
app.use(express.json());

function readUsers() {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
    }
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  } catch (err) {
    console.error('Error reading users:', err);
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

app.get('/api/users', (req, res) => {
  res.json(readUsers());
});

app.post('/api/signup', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }
  const users = readUsers();
  if (users.find(u => u.username.toLowerCase() === username.trim().toLowerCase())) {
    return res.status(409).json({ message: 'Username already exists.' });
  }
  users.push({ username: username.trim(), password });
  writeUsers(users);
  res.status(201).json({ message: 'User created.' });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }
  const users = readUsers();
  const user = users.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }
  if (user.password !== password) {
    return res.status(401).json({ message: 'Incorrect password.' });
  }
  res.json({ message: 'Login successful.' });
});

app.listen(PORT, () => {
  console.log(`Mock API server running at http://localhost:${PORT}`);
});
