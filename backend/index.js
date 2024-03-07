require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { MongoClient } = require('mongodb');
const dataRoutes = require('./routes/routes');
const cors = require('cors')

const app = express();
const port = process.env.PORT || 3000;
const mongoUrl = process.env.MONGODB_URI; // Ensure this is defined in your .env file

let db;

async function initializeDatabase() {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = response.data;

    // Check if the transactions collection is empty before inserting
    const count = await db.collection('transactions').countDocuments();
    if (count === 0) {
      await db.collection('transactions').insertMany(transactions);
      console.log('Database initialized with seed data');
    } else {
      console.log('Database already initialized. Skipping seed data insertion.');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

app.use(cors());

MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    console.log('Connected to Database');
    db = client.db('roxiler-assignment');
    // Call the initializeDatabase function immediately after connection
    initializeDatabase();
  })
  .catch(error => console.error(error));

app.use(express.json());

// Since initialization is handled within the connection logic, you might not need this route anymore.
// Or you can keep it for manual re-initialization but ensure idempotence or restrict access as needed.

app.use('/api', dataRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
