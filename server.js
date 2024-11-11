const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 3000;

// Middleware for parsing incoming requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB connection
const url = 'mongodb+srv://Durgesh:test1234@cluster0.6wnzb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(url, { useUnifiedTopology: true });
const dbName = 'application';

async function connectDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit the application if we can't connect
    }
}
connectDB();

// Express session setup
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Serve static files (HTML, CSS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Render the login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Render the signup page
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// Handle login request
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const db = client.db(dbName);
    const users = db.collection('users');

    try {
        const user = await users.findOne({ email });
        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.user = user; // Set user session
            res.redirect('/home.html'); // Redirect to home page
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).send('Error logging in');
    }
});

// Handle signup request
app.post('/signup', async (req, res) => {
    const { name, mobile, email, password } = req.body;
    const db = client.db(dbName);
    const users = db.collection('users');

    try {
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await users.insertOne({
            name,
            mobile,
            email,
            password: hashedPassword
        });
        res.redirect('/home.html');
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).send('Error registering');
    }
});

// Handle the home page (to show centers based on location)
app.get('/home.html', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // If not logged in, redirect to login
    }
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Handle search request for test centers
app.get('/api/search', async (req, res) => {
    const { location } = req.query;
    const db = client.db(dbName);
    const centers = db.collection('TestCenter');

    try {
        const result = await centers.find({ 'location.address': new RegExp(location, 'i') }).toArray();
        res.json(result);
    } catch (err) {
        console.error('Search error:', err);
        res.status(500).send('Error fetching test centers');
    }
});

// Handle server shutdown gracefully
process.on('SIGINT', () => {
    console.log('Shutting down server...');
    client.close(false, () => {
        console.log('MongoDB connection closed');
        process.exit(0);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
