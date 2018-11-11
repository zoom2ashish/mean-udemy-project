const express = require('express');
const path = require('path');
const Post = require('../models/post');
const multer = require('multer');
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};
const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let err = new Error('Invalid Mime Type');
    if (isValid) {
      error = null;
    }

    callback(error, path.join(__dirname, "/../images"));
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    callback(null, `${name}-${Date.now()}.${ext}`);
  }
});

router.get('', (req, res, next) => {
  console.log(req.query);
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    console.log('PageSize: ' + pageSize + ' Current Page:' + currentPage);
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  postQuery
    .then(results => {
      fetchedPosts = results;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({
        message: 'Posts fetched successfully',
        posts: fetchedPosts,
        totalPosts: count
      });
    }).catch((error) => {
      console.log('Fetching Post failed');
    });
});

router.post('', multer({ storage: storage }).single('image'), (req, res, next) => {
  const url = `${req.protocol}://${req.get('host')}`;

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename
  });

  console.log(post);

  post.save().then((addedPost) => {
    console.log(addedPost);
    res.status(201).json({
      message: 'Post added successfully',
      post: {
        ...addedPost,
        id: addedPost._id
      }
    });
  });
});

router.put('/:id',
  multer({ storage: storage }).single('image'),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = `${req.protocol}://${req.get('host')}`;
      imagePath = url + '/images/' + req.file.filename;
    }
  const updatedPostData = {
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  };

  console.log('updatedPostData: ', updatedPostData);

  const post = new Post({
    title: req.body.tite,
    content: req.body.content
  });

  Post.updateOne({ _id: req.params.id }, { $set: updatedPostData }).then((result) => {
    console.log(result);
    res.status(200).json({
      message: 'Post updated successfully',
      post: result
    });
  });
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found!' });
    }
  })
});

router.delete('/:id', (req, res, next) => {
  console.log('Delete Post: ' + req.params.id);
  Post.deleteOne({ _id: req.params.id }).then((result => {
    res.status(200).json({
      message: 'Post Deleted'
    });
  }), (error) => {
    console.error(error);
    res.status(500).json({
      error: 'Failed to delete post'
    })
  });

});

module.exports = router;