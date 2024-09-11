const express = require('express');
const mysql = require('mysql');

const app = express();

// MySQL connection options
const dbConfig = {
  host: 'mysql',
  user: 'root',
  password: 'rootpassword',
  database: 'testdb'
};

// Retry mechanism
let db;
function handleDisconnect() {
  db = mysql.createConnection(dbConfig);

  db.connect(function(err) {
    if (err) {
      console.error('Error connecting to MySQL, retrying in 5 seconds:', err);
      setTimeout(handleDisconnect, 5000); // Retry after 5 seconds
    } else {
      console.log('Connected to MySQL');
    }
  });

  db.on('error', function(err) {
    console.error('MySQL error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect(); // Reconnect on connection lost
    } else {
      throw err;
    }
  });
}

handleDisconnect();

// Static files and templating engine
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Define route to display database records
app.get('/', (req, res) => {
  db.query('SELECT * FROM test_table', (err, results) => {
    if (err) {
      res.send('Error fetching data');
      console.error('Query error:', err);
    } else {
      res.render('index', { results });
    }
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

