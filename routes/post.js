const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const requireLogin = require('../middlewares/requireLogin');

router.get('/allpostsmob', requireLogin, (req, res) => {
  Post.find() // no conditions here so we get all the posts
    .sort({ created_at: -1 })
    .then((posts) => {
      res.json({ posts })
    })
    .catch((err) => {
      console.log(err)
    })
})

module.exports = router;