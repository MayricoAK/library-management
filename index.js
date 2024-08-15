const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bookRoutes = require('./routes/Books');
const memberRoutes = require('./routes/Member');
const setupSwaggerDocs = require('./docs/swagger');
const app = express();

dotenv.config();

const Book = require('./models/Books');
const Member = require('./models/Members');

const {booksData, membersData} = require('./data/index')

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Setup Swagger
setupSwaggerDocs(app);

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
  
  // insert data into the database (for first time run)
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

module.exports = app;