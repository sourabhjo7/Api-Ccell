const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Outpass = mongoose.model('Outpass');
const requireLogin = require('../middlewares/requireLogin');
const generate_token = require('../services/outpassService')

router.post('/generateoutpass', requireLogin, (req, res) => {
  const { hostel, roomno, purpose, transport, from_time, to_time } = req.body;
  if (!hostel || !roomno || !purpose || !transport || !from_time || !to_time) {
    return res.status(422).json({ error: 'Please fill all the details to proceed!' });
  }

  const uniqueToken = generate_token(12);

  const outpass_record = new Outpass({
    user: req.user,
    hostel: hostel,
    roomno: roomno,
    purpose: purpose,
    transport: transport,
    from: from_time,
    to: to_time,
    token: uniqueToken
  })

  outpass_record.save().then((result) => {
    res.status(200).json({ token: uniqueToken, outpass: result })
  })
    .catch((err) => {
      console.error("Outpass save error: " + err)
    })
});

router.get('/previousoutpass', requireLogin, (req, res) => {
  Outpass.find({
    user: req.user._id,
    created_at: {
      $gte: new Date(new Date().setHours(00, 00, 00)),
      $lt: new Date(new Date().setHours(23, 59, 59))
    }
  }).sort({ created_at: -1 })
    .then((outpass_record) => {
      console.log("Outpass_record fetch success: " + outpass_record);
      res.json({ outpass_record });
    })
    .catch((err) => {
      console.error("Outpass_record fetch error: " + err);
    })
})

module.exports = router;