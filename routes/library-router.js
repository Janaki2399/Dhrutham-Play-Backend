const express = require("express");
const router = express.Router();
const { LibraryItem } = require("../models/library.model");
const { Video } = require("../models/video.model");
const _ = require("lodash");
router
  .route("/")
  .get(async (req, res) => {
    try {
      const library = await LibraryItem.find({}).populate({
        path: "list",
        populate: { path: "list" },
      });
      res.status(200).json({ library, success: true });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "unable to get categories",
        errorMessage: err.message,
      });
    }
  })
  .post(async (req, res) => {
    try {
      const librayItem = req.body;
      const libraryItem = new LibraryItem(librayItem);
      const insertedItem = await libraryItem.save();
      const populatedItem = await insertedItem.populate("list").execPopulate();
      res.json({ libraryItem: populatedItem, success: true });
    } catch (error) {
      res.status(500).json({
        success: false,
        errorMessage: error.message,
      });
    }
  });
router
  .route("/:id")
  .get(async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const library = await LibraryItem.findById(id).populate({ path: "list" });

    res.json({ library, success: true });
  })
  .post(async (req, res) => {
    try {
      const video = req.body;
      const id = req.params.id;

      let library = await LibraryItem.findById(id);
      library = _.extend(library, { list: _.concat(library.list, video._id) });
      const updated = await library.save();
      const populated = await updated.populate("list").execPopulate();
      res.status(200).json({ updated: populated });
    } catch (error) {
      res.status(500).json({ error });
    }
  })
  .delete(async (req, res) => {
    const libraryId = req.params.id;

    const libraryItem = await LibraryItem.findById(libraryId);
    await libraryItem.remove();
    res.status(200).json({ success: true });
  });

router
  .route("/:id/:videoId")
  .get(async (req, res) => {
    const libraryId = req.params.id;
    const videoId = req.params.videoId;

    const library = await LibraryItem.findById(libraryId);
    const populatedLibrary = await library.populate("list").execPopulate();
    const video = await Video.findById(videoId);

    res.status(200).json({ library: populatedLibrary, video, success: true });
  })
  .delete(async (req, res) => {
    const libraryId = req.params.id;
    const videoId = req.params.videoId;

    let library = await LibraryItem.findById(libraryId);
    library.list.pull({ _id: videoId });
    const updated = await library.save();
    const populated = await updated.populate("list").execPopulate();

    res.status(200).json({ updated: populated });
  });
module.exports = router;
