  const mongoose = require('mongoose');

  const connectDB = async () => {
    try {
      await mongoose.connect('mongodb+srv://meet:meet%401232@cluster0.aipj3q6.mongodb.net/movie');
      console.log('MongoDB Connected');
    } catch (error) {
      console.log(error);
    }
  };

  module.exports = connectDB;

