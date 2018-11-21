const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const app = express();

mongoose.connect('mongodb+srv://demo:demo@mean-udemy-cluster-pshfy.mongodb.net/mean-udemy-example?retryWrites=true', { useNewUrlParser: true }).then(() => {
  console.log('Mongoose Connection Successfully');
}).catch((error) => {
  console.log('Mongoose Connection Failed', error);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static( path.join('backend/images')));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Accept-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');

  console.log('Request Received for url', req.url)

  next();
});

app.use('/api/posts', postsRoutes);
app.use('/api/user', userRoutes);
module.exports = app;