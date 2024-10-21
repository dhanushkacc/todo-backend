const bcrypt = require("bcrypt");
const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtSecret = process.env.JWT_SECRET;

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userDoc = await User.findOne({ email });
    if (!userDoc) {
      return res.status(404).json({ message: "User not found" });
    }

    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (!passOk) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const userData = {
      id: userDoc._id,
      email: userDoc.email,
      name: userDoc.name,
    };

    jwt.sign(userData, jwtSecret, { expiresIn: "1h" }, (err, token) => {
      if (err) {
        return res.status(500).json({ message: "Error generating token" });
      }

      res.header("x-auth-token", token);
      res.cookie("token", token, { httpOnly: true, maxAge: 3600000 }).json({
        message: "Login successful",
        token: token,
        user: {
          name: userDoc.name,
          email: userDoc.email,
          id: userDoc._id,
        },
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const logout = (req, res) => {
  res.cookie("token", "", { expires: new Date(0), httpOnly: true }).json({
    message: "Logged out successfully",
    loggedOut: true,
  });
};

module.exports = {
  login,
  logout,
};
