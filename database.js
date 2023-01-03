require("dotenv").config();
const mongoose = require('mongoose')

const connectionParams = {
  useNewUrlParser: true,
  // useCreateIndex: true,
  useUnifiedTopology: true
};

mongoose.connect(process.env.MONGO_URI, connectionParams)
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((err) => {
    console.error(`Error connecting to the database. \n${err}`);
  });

module.exports = mongoose;