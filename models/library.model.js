const mongoose = require("mongoose");
const { Schema } = mongoose;

const librarySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  list: [{ type: Schema.Types.ObjectId, ref: "Video" }],
});
const LibraryItem = mongoose.model("LibraryItem", librarySchema);

module.exports = { LibraryItem };
