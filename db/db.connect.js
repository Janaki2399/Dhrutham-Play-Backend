const mongoose = require("mongoose");
async function mongoDBConnection() {
  try {
    await mongoose.connect(process.env.CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = { mongoDBConnection };
