const express = require('express');
const admin = require('firebase-admin');
const axios = require('axios');
const serviceAccount = require('./firebaseAdmin.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(express.json());

// Register a new user
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    await admin.auth().createUser({ email, password });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: error.message });
  }
});

// Fetch user data from GitHub API
app.get('/api/data', async (req, res) => {
  const sessionCookie = req.cookies.sessionCookie || '';

  try {
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
    const { uid } = decodedClaims;
    const userRecord = await admin.auth().getUser(uid);
    const { email } = userRecord;
    const response = await axios.get(`https://api.github.com/users/${email.split('@')[0]}`);
    const userData = response.data;
    res.json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});