const Registration = require("../models/joinwait");

const createRegistration = async (req, res) => {
  try {
    const { firstName, lastName, age, grade } = req.body;

    if (!firstName || !age || !grade) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields."
      });
    }

    const newRegistration = new Registration({
      firstName, lastName, age, grade
    });

    await newRegistration.save();

    res.status(201).json({
      success: true,
      message: "You've been added to the waitlist! 🎉"
    });

  } catch (error) {
    console.log("Server error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong on our end. Please try again later."
    });
  }
};

const getAllRegistrations = async (req, res) => {
  try {
    const all = await Registration.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: all.length,
      data: all
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "An error occurred while fetching registrations." });
  }
};

module.exports = { createRegistration, getAllRegistrations };