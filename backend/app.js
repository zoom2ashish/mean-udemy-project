const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Post = require('./models/post');

mongoose.connect('mongodb+srv://test:riwQA3iFuXnp3Qr7@cluster0-qngdo.mongodb.net/mean-udemy-example?retryWrites=true', { useNewUrlParser: true }).then(() => {
  console.log('Mongoose Connection Successfully');
}).catch(() => {
  console.log('Mongoose Connection Failed');
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Accept-Type');
  res.setHeader('Access-Control-Allow-Method', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

app.get('/api/posts', (req, res, next) => {
  Post.find()
    .then((results) => {
      res.status(200).json({
        message: 'Posts fetched successfully',
        posts: results
      });
    }).catch((error) => {
      console.log('Fetching Post failed');
    });
});

app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });

  post.save();

  console.log(post);
  res.status(201).json({
    message: 'Post added successfully',
    post: post
  });
});

module.exports = app;