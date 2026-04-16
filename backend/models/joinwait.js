

const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  firstName:  { type: String, required: true },
  lastName:   { type: String, default: "" },
  age:     { type: Number, required: true },
  grade:      { type: String, required: true },
  createdAt:  { type: Date,   default: Date.now }
});

const Registration = mongoose.model("Registration", registrationSchema);

module.exports = Registration;