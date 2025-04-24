const express = require('express');
const app = express();

// Use express.static middleware to serve static files from the "public" folder
app.use(express.static('public'));

// Define a route (this is optional)
app.get('/', (req, res) => {
  res.send('Welcome to my static website!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});