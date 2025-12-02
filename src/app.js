const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const announcementRoutes = require('./routes/announcementRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Example route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});
app.use("/api", announcementRoutes);
app.use(express.json());

module.exports = app;