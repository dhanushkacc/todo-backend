const express = require("express");
const router = express.Router();
const upload = require("../middlewares/Multer"); 
const { getUser, updatePassword, deleteUser } = require("../controllers/UserController");
const { registerUser } = require("../controllers/RegisterController");
const { login, logout } = require("../controllers/LoginController");
const { verifySignin } = require("../middlewares/Auth");
const { sendOtp, verifyOtp, resetPassword } = require("../controllers/EmailVerifyController");

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

router.post("/register", upload.single("profileImage"), registerUser); 
router.post("/login", login);
router.post("/logout", logout);
router.delete("/delete", verifySignin, deleteUser);
router.get("/get", verifySignin, getUser);
router.put("/update", verifySignin, updatePassword);

module.exports = router;
