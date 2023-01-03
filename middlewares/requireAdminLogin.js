const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Admin = mongoose.model('Admin');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  // authorization === Bearer jwt_token
  if (!authorization) {
    return res.status(401).json({ error: "You must be logged in1" }); // code 401 means unauthorized
  }
  const token = authorization.replace("Bearer ", "");
  console.log("requireLogin token -----", token)
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: "You must be logged in2" });
    }
    const { _id } = payload;
    Admin.findById(_id).then((adminData) => {
      req.admin = adminData;
      next();
    });
  });
}
