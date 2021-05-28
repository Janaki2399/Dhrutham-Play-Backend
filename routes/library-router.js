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
    // library.list.populate;

    // const library = await Library.find({}).populate({
    //   path: "list",
    //   populate: { path: "list" },
    // });
    res.status(200).json({ library, success: true });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "unable to get categories",
      errorMessage: err.message,
    });
  }
});
// router.post("/:playlistId", async (req, res) => {
//   try {
//     const video = req.body;
//     const id = req.params.playlistId;
//     let playlist = await Playlist.findById(id);
//     playlist = _.extend(playlist, {
//       playlist: _.concat(Playlist.playlist, video._id),
//     });
//     const updated = await playlist.save();
//     const populated = await updated
//       .populate({ path: "playlist", populate: { path: "playlist" } })
//       .execPopulate();
//     res.status(200).json({ updated: populated });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       errorMessage: error.message,
//     });
//   }
// });
router
  .route("/:playlistId")
  .get(async (req, res) => {
    const playlistId = req.params.playlistId;
    // console.log(id);
    const playlist = await Playlist.findById(playlistId).populate();

    res.json({ playlist, success: true });
  })
  .post(async (req, res) => {
    try {
      //create playlist if not created -TODO
      const video = req.body;
      const id = req.params.playlistId;
      let playlist = await Playlist.findById(id);
      playlist = _.extend(playlist, {
        playlist: _.concat(playlist.playlist, video._id),
      });

      const updated = await playlist.save();
      const populated = await updated
        .populate({ path: "playlist", populate: { path: "playlist" } })
        .execPopulate();
      res.status(200).json({ updated: populated });
    } catch (error) {
      res.status(500).json({
        success: false,
        errorMessage: error.message,
      });
    }
  })
  .delete(async (req, res) => {
    const playlistId = req.params.playlistId;

    const playlistItem = await Playlist.findById(playlistId); //check this out
    await playlistItem.remove();
    res.status(200).json({ success: true });
  });

router
  .route("/:playlistId/:videoId")
  .get(async (req, res) => {
    const playlistId = req.params.playlistId;
    const videoId = req.params.videoId;

    const playlist = await Playlist.findById(playlistId);
    const populatedPlaylist = await playlist
      .populate("playlist")
      .execPopulate();
    const video = await Video.findById(videoId);

    res.status(200).json({ playlist: populatedPlaylist, video, success: true });
  })
  .delete(async (req, res) => {
    const playlistId = req.params.playlistId;
    const videoId = req.params.videoId;

    let playlist = await Playlist.findById(playlistId);
    playlist.playlist.pull({ _id: videoId });
    await playlist.save();
    res.status(200).json({ success: true });
  });
module.exports = router;
