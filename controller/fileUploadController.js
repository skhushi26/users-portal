const fs = require("fs");
const { uuid } = require("uuidv4");
var path = require("path");
const defaulPath = (__dirname, "..", "uploads");

const response = require("../utils/response");

exports.postUploadFile = async (req, res, next) => {
  if (req.files) {
    let imageData;
    let folderName = "images";
    if (req.files.profileImage) {
      folderName = "profiles";
      imageData = req.files.profileImage;
    }
    if (req.files.postImage) {
      folderName = "posts";
      imageData = req.files.postImage;
    }

    const isImage = imageData.mimetype.toLowerCase().includes("image");
    let fileName = uuid();
    let fileExtension = path.extname(`${imageData.name}`);
    const subFolder = isImage ? "images" : "videos";
    let uploadPath = isImage
      ? `/${folderName}/${subFolder}/img_${fileName}${fileExtension}`
      : `/${folderName}/${subFolder}/vid_${fileName}${fileExtension}`;

    imageData.mv(`${defaulPath}${uploadPath}`, (err) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        res.send(
          response(null, uploadPath, "Image/video uploaded successfully", 200)
        );
      }
    });
  } else {
    uploadPath = null;
    res.send(response(null, null, "Please select image/video to upload", 400));
  }
};
