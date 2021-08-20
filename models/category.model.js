const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  thumbnail: String,
  level: String,
  list: [{ type: Schema.Types.ObjectId, ref: "Video" }],
});
const Category = mongoose.model("Category", categorySchema);

module.exports = { Category };
