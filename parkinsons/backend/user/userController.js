const User = require('./userController');

// @desc    Create new user
// @route   POST /api/users
// @access  Public
const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, dateOfBirth, emergencyContact } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      firstName,
      lastName,
      email,
      password,
      dateOfBirth,
      emergencyContact,
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createUser };