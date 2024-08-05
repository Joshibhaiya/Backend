const mongoose = require('mongoose');

const connectDB = async () => {
  const maxAttempts = 10;
  let attempts = 0;
  const delay = ms => new Promise(res => setTimeout(res, ms));

  do {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,      // Optional, depends on your Mongoose version
        useUnifiedTopology: true    // Optional, depends on your Mongoose version
      });
      console.log('MongoDB connected');
      return;
    } catch (error) {
      attempts++;
      console.error(`MongoDB connection error (attempt ${attempts}):`, error.message);
      if (attempts < maxAttempts) {
        console.log(`Retrying in 5 seconds...`);
        await delay(5000); // wait 5 seconds before the next attempt
      } else {
        console.error('Max connection attempts reached. Exiting.');
        process.exit(1);
      }
    }
  } while (attempts < maxAttempts);
};

module.exports = { connectDB };
