const express = require("express");
var router = new express.Router();
const { registerUser, loginUser, logoutUser, getUser, getLoginStatus, updateUser, updateProfilePhoto } = require("../controllers/userController");
const { isLoggedIn } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/getUser", isLoggedIn, getUser);
router.get("/getLoginStatus", getLoginStatus);
router.patch("/updateUser", isLoggedIn, updateUser);
router.patch("/updatePhoto", isLoggedIn, updateProfilePhoto);

module.exports = router;