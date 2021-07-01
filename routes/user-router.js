const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();
const { User } = require("../models/user.model");
const { Playlist } = require("../models/playlist.model");
const { Library } = require("../models/library.model");

router.post("/signup", async (req, res) => {
  const body = req.body;
  if (!(body.firstName && body.lastName && body.email && body.password)) {
    return res
      .status(401)
      .json({ success: false, errorMessage: "Enter all details" });
  }
  const userExists = await User.findOne({ email: body.email });
  if (userExists) {
    return res.status(409).json({
      success: false,
      errorMessage: "Account already exists.Please Login to continue",
    });
  }
  const user = new User(body);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  let token = jwt.sign({ userId: user._id }, process.env.secret, {
    expiresIn: "24h",
  });
  token = `Bearer ${token}`;
  const playlist = new Playlist({
    name: "Liked Videos",
    list: [],
  });
  await playlist.save();
  const library = new Library({
    userId: user._id,
    list: { _id: playlist._id },
  });
  await library.save();
  res.status(200).json({ success: true ,token});
});

router.post("/login", async (req, res) => {
  const body = req.body;
  
  const user = await User.findOne({ email: body.email });
  if (user) {
    const validPassword = await bcrypt.compare(body.password, user.password);
    if (validPassword) {
      let token = jwt.sign({ userId: user._id }, process.env.secret, {
        expiresIn: "24h",
      });
      token = `Bearer ${token}`;
    
      return res.status(200).json({ success: true, token });
    }
    return res
      .status(401)
      .json({ success: false, errorMessage: "Password is incorrect" });
  }
  res
    .status(401)
    .json({ success: false, errorMessage: "Email id does not exist" });
});
module.exports = router;
