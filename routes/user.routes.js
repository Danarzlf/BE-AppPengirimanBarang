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
  deleteUserById

} = require("../controllers/user.controller");

const router = express.Router();

router.post("/register", register);
router.post("/registerNoVerify", register);
router.put("/verify-otp", verifyOtp);
router.post("/login", login);
router.get(
  "/authenticate",
  Auth,
  checkRole(["User", "Admin"]),
  authenticateUser
);
router.get("/all-users", getAllUsers);
router.get("/:id",  getUserById);
router.delete("/:id",  deleteUserById);

module.exports = router;
