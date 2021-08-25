const express = require("express");
const fileController = require("../controller/fileUploadController");
const router = express.Router();

router.post("/file-upload", fileController.postUploadFile);

module.exports = router;
