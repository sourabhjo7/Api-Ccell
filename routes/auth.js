const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Admin = mongoose.model("Admin");
const requireLogin = require("../middlewares/requireLogin");

router.get("/", (req, res) => {
  res.send("HELLO");
});

router.get("/protected", requireLogin, (req, res) => {
  res.send("Hello User");
});

router.post("/signup", (req, res) => {
  console.log(req.body);
  const { userInfo } = req.body;
  const name = userInfo.user.name;
  const email = userInfo.user.email;
  if (!name || !email) {
    // code 422 - server has understood the request but couldn't process the same
    return res.status(422).json({ error: "Please add all the fields" });
  }
  // res.json({ message: "Successfully Posted" });

  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res
          .status(200)
          .json({ msg: "User with that email already exists. abb wapis entry de rahe", userData: savedUser });
        // .status(422)
        // .json({ error: "User with that email already exists." });
      }

      const user = new User({
        id: userInfo.user.id,
        name: name, // if key and value are both same then we can condense it to just name, email, etc.
        email: email,
      });

      user
        .save()
        .then((user) => {
          res.status(200).json({ message: "User Created Successfully!", userData: user });
        })
        .catch((err) => {
          console.log(`Error saving user - ${err}`);
        });
    })
    .catch((err) => {
      console.log(`Error in email findOne - ${err}`);
    });
});

// exclusive for web Client
router.post("/adminsignup", (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    // code 422 - server has understood the request but couldn't process the same
    return res.status(422).json({ error: "Please add all the fields" });
  }
  // res.json({ message: "Successfully Posted" });

  Admin.findOne({ email: email })
    .then((savedAdmin) => {
      if (savedAdmin) {
        return res
          .status(422)
          .json({ error: "Admin with that email already exists. Please Sign in." });
      }

      bcrypt.hash(password, 16)
        .then((hashedPassword) => {
          const admin = new Admin({
            name: name, // if key and value are both same then we can condense it to just name, email, etc.
            email: email,
            password: hashedPassword
          });

          admin
            .save()
            .then((admin) => {
              res.status(200).json({ message: "Admin Created Successfully!", adminData: admin });
            })
            .catch((err) => {
              console.log(`Error saving admin - ${err}`);
            });
        })
    })
    .catch((err) => {
      console.log(`Error in email findOne - ${err}`);
    });
});

// exclusive for web Client
router.post("/adminsignin", (req, res) => {
  console.log(req.body)
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(422).json({ error: "Please enter email or password" });
  }

  Admin.findOne({ email: email }).then((savedAdmin) => {
    if (!savedAdmin) {
      return res.status(422).json({ error: "Invalid email or password 1" });
    }
    bcrypt
      .compare(password, savedAdmin.password)
      .then((doMatch) => {
        // doMatch is a boolean value
        if (doMatch) {
          // res.json({ message: "Successfully Signed In" });
          const { _id, name, email } = savedAdmin;
          const token = jwt.sign({ _id: savedAdmin._id }, process.env.JWT_SECRET);
          res.json({ token: token, admin: { _id, name, email } });
        } else {
          return res.status(422).json({ error: "Invalid email or password 2" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

module.exports = router;
