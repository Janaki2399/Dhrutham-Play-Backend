const mongoose = require("mongoose")
const { Schema } = mongoose;
 const videoSchema = new Schema({
    youtubeId:String,
    name:String,
    channelName:String
  });

const Video=mongoose.model('Video', videoSchema);
module.exports = { Video }