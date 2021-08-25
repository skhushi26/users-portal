const express = require("express");

const userController = require("../controller/userController");
const router = express.Router();

router.post("/register", userController.postRegisterUser);

module.exports = router;
