const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/profile/:id", userController.getUserInfo);
router.put(
  "/prof-edit",
  userController.editUserInfo
);
router.get("/thingspeak", userController.getData);

module.exports = router;
