const express = require('express');
const mysql = require('mysql');

// Create an Express application
const app = express();

// Use static files like CSS and images
app.use(express.static('public'));

// Set the view engine to EJS for templating
app.set('view engine', 'ejs');

// Create a connection to MySQL
const db = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  password: 'rootpassword',
  database: 'testdb'
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Define a simple route to display data in a table
app.get('/', (req, res) => {
  db.query('SELECT * FROM test_table', (err, results) => {
    if (err) throw err;
    res.render('index', { results });
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});

