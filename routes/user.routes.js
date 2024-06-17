const express = require("express");
const checkRole = require("../middlewares/checkRole");
const Auth = require("../middlewares/authentication");
const {
  register,
  registerNoVerify,
  verifyOtp,
  login,
  authenticateUser,
  getAllUsers,
  getUserById,

} = require("../controllers/user.controller");

const router = express.Router();

router.post("/register", register);
router.post("/registerNoVerify", register);
router.put("/verify-otp", verifyOtp);
router.post("/login", login);
router.get(
  "/authenticate",
  Auth,
  authenticateUser
);
router.get("/all-users", Auth, checkRole(["User"]), getAllUsers);
router.get("/:id",  getUserById);

module.exports = router;
