const mongoose = require("mongoose");
const { Schema } = mongoose;

const librarySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: { unique: true },
  },
  list: [{ type: Schema.Types.ObjectId, ref: "Playlist" }],
});
const Library = mongoose.model("Library", librarySchema);

module.exports = { Library };
