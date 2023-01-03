const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Outpass = mongoose.model('Outpass');
const Post = mongoose.model('Post');
const requireAdminLogin = require('../middlewares/requireAdminLogin');

router.get('/pendingoutpasses', requireAdminLogin, (req, res) => {
  Outpass.find({ status: "Pending" })
    .populate("user", "_id name email")
    .then((outpass_record) => {
      console.log("Pending Outpass_record fetch success: " + outpass_record);
      res.json({ outpass_record });
    })
    .catch((err) => {
      console.error("Pending Outpass_record fetch error: " + err);
    })
});

router.get('/approvedoutpasses', requireAdminLogin, (req, res) => {
  Outpass.find({ status: "Approved" })
    .populate("user", "_id name email")
    .then((outpass_record) => {
      console.log("Approved Outpass_record fetch success: " + outpass_record);
      res.json({ outpass_record });
    })
    .catch((err) => {
      console.error("Approved Outpass_record fetch error: " + err);
    })
});

router.post('/approveoutpass/:outpassid', requireAdminLogin, (req, res) => {
  Outpass.findByIdAndUpdate(req.params.outpassid, {
    status: "Approved"
  }, {
    new: true
  })
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ approve_outpass_error: err });
      } else {
        res.json({ result: result });
      }
    })
});

router.post('/uploadpost', requireAdminLogin, (req, res) => {
  const { title, description, imageurl, organization, orgiconurl } = req.body;
  if (!title || !description || !organization || !orgiconurl) {
    return res.status(422).json({ error: 'Please fill all the details to proceed!' });
  }

  const post_record = new Post({
    title: title,
    description: description,
    imageurl: imageurl,
    organization: organization,
    orgiconurl: orgiconurl
  })

  post_record.save().then((result) => {
    res.status(200).json({ post: result })
  })
    .catch((err) => {
      console.error("post save error: " + err)
    })
})

router.get('/allposts', requireAdminLogin, (req, res) => {
  Post.find() // no conditions here so we get all the posts
    .then((posts) => {
      res.json({ posts })
    })
    .catch((err) => {
      console.log(err)
    })
})

router.delete('/deletepost/:postId', requireAdminLogin, (req, res) => {
  Post.findByIdAndRemove(req.params.postId)
    .then(post => {
      if (!post) {
        return res.status(422).json({ error: 'post not found' });
      }
      else {
        res.json({ post: post });
      }
    })
    .catch(err => {
      console.err("error:", err);
    })
})

module.exports = router;