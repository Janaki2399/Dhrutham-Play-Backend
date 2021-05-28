const express = require("express");
const router = express.Router();
const { Library } = require("../models/library.model");
const { Video } = require("../models/video.model");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const { Playlist } = require("../models/playlist.model");

router.use(async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.secret);
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, errorMessage: "Unauthorized access" });
  }
});

router.route("/").get(async (req, res) => {
  try {
    const { userId } = req.user;
    const library = await Library.findOne({ userId }).populate({
      path: "list",
      populate: { path: "list", select: "_id" },
    });

    res.status(200).json({ library, success: true });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "unable to get categories",
      errorMessage: err.message,
    });
  }
});
router.post("/", async (req, res) => {
  try {
    const body = req.body;
    const { userId } = req.user;
    const playlist = new Playlist(body);
    await playlist.save();
    let library = await Library.findOne({ userId });
    library = _.extend(library, {
      list: _.concat(library.list, playlist._id),
    });

    const updated = await library.save();
    const populated = await updated
      .populate({ path: "list", select: "_id" })
      .execPopulate();

    res.status(200).json({ playlist: populated, success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      errorMessage: error.message,
    });
  }
});

module.exports = router;
