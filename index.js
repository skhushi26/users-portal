const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = 3000;
const DB = "mongodb://localhost:27017/userportal";

const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

app.use(bodyParser.json({ limit: "5000mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "5000mb" }));
app.use(fileUpload());

var uploads = path.join(__dirname, "uploads");
app.use("/", express.static(uploads));

//#region - Routes
const userRoute = require("./routes/userRoute");
const fileUploadRoutes = require("./routes/fileUploadRoute");
//#endregion - Routes

app.get("/", (req, res) => {
  res.send("Welcome to the User Portal.");
});

app.use("/users", userRoute);
app.use("/file", fileUploadRoutes);

app.listen(PORT, () => {
  console.log(`server listening on http://127.0.0.1:${PORT}/`);
});

mongoose.connect(
  DB,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.log("Error occurred in connecting", err);
    } else {
      console.log("Database connected successfully!");
    }
  }
);
