const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bookRoutes = require('./routes/Books');
const memberRoutes = require('./routes/Member');
const Member = require('./models/Members');
const Book = require('./models/Books');
const { booksData, membersData } = require('./data/index');

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/books', bookRoutes);
app.use('/members', memberRoutes);

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URL, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(async () => {
  console.log('Connected to MongoDB');

  // Optionally, insert data into the database
  // await Book.insertMany(booksData);
  // console.log('Books data inserted');
  // await Member.insertMany(membersData);
  // console.log('Members data inserted');

  app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
})
.catch(err => console.error('Could not connect to MongoDB', err));

app.get('/', (req, res) => {
  res.send('<h1>ACCESS, FLASH!</h1>');
});