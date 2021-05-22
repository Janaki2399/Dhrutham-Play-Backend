const express = require("express");
const videoRouter = require("./routes/video-router.js");
const categoryRouter = require("./routes/category-router.js");
const libraryRouter = require("./routes/library-router.js");

const mongoose = require("mongoose");
const { mongoDBConnection } = require("./db/db.connect.js");
const PORT = process.env.PORT || 5000;
const app = express();
var cors = require("cors");
app.use(cors());

app.use(express.json());

mongoDBConnection();

app.use("/videos", videoRouter);
app.use("/categories", categoryRouter);
app.use("/library", libraryRouter);

app.get("/", (req, res) => {
  res.redirect("/categories");
});

app.use((req, res) => {
  res.status(400).json({ success: false, msg: "No page found" });
});

app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).send("Something broke");
});

app.listen(PORT, () => {
  console.log("server started");
});
