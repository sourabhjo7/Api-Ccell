const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;

const outpassSchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    ref: "User",
    required: true
  },
  hostel: {
    type: String,
    required: true
  },
  roomno: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    required: true
  },
  transport: {
    type: String,
    required: true
  },
  from: {
    type: Date,
    required: true
  },
  to: {
    type: Date,
    required: true
  },
  token: {
    type: String
  },
  status: {
    type: String,
    default: "Pending",
    required: true
  }

}, {
  // will automatically give a timestamp of createdAt and updatedAt
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
} )

mongoose.model("Outpass", outpassSchema);