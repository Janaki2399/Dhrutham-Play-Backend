const express = require("express");
const router = express.Router();
const { Category } = require("../models/category.model");
const { Video } = require("../models/video.model");
router.route("/").get(async (req, res) => {
  try {
    const categories = await Category.find({}).populate("list", "_id");
    res.status(200).json({ categories, success: true });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "unable to get categories",
        errorMessage: err.message,
      });
  }
});

router.route("/:id/:videoId").get(async (req, res) => {
  const categoryId = req.params.id;
  const videoId = req.params.videoId;
  const category = await Category.findById(categoryId);
  const populatedCategory = await category.populate("list").execPopulate();
  const video = await Video.findById(videoId);
  res.status(200).json({ categories: populatedCategory, video, success: true });
});
module.exports = router;
