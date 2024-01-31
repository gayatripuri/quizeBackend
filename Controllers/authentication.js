const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Check if the required fields are provided
    if (!(name && email && password && confirmPassword)) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields" });
    }

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate and return the JWT token after sign up
    const user = await User.findOne({ email });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: 6000,
    });
    res.status(201).json({
      success: true, // Indicate success
      message: "User registered successfully",
      name: user.name,

      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the required fields are provided
    if (!(email && password)) {
      return res
        .status(400)
        .json({ error: "Please provide email and password" });
    }
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    // Compare the provided password with the stored hashed password

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    // Generate and return the JWT token
    const token = jwt.sign(
      { userId: user._id, tokenVersion: user.tokenVersion },
      process.env.JWT_SECRET,
      {
        expiresIn: 6000,
      }
    );
    res
      .status(200)
      .json({ message: "Login successful", name: user.name, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Failed to login" });
  }
};

exports.logout = async (req, res) => {
  try {
    // Increment tokenVersion to invalidate current token
    const user = await User.findByIdAndUpdate(req.userId, {
      $inc: { tokenVersion: 1 },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to logout" });
  }
};
