const express = require("express");
const router = express.Router();
const {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  UserdeleteUser,
  adminGetProfile,
  adminUpdateProfile,
  deleteUserProfile,
  getAdminStats,
} = require("../controllers/userController.js");
const { protect, isAdmin } = require("../middleware/authMiddleware.js");

//Regiser New user
router.post("/", registerUser);

//Login User
router.post("/auth", authUser);

//Logout User
router.post("/logout", logoutUser);

//User Delete User Profile
router.delete("/", protect, deleteUserProfile);

//User Get,Update User Profile
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// //User Resetting the Password
// router.post('/forgot-password',sendPasswordResetMail);
// router.get('/forgot-password/:id/:token',GetPasswordResetMail);
// router.post('/forgot-password/:id/:token',GetPasswordResetMail2);

//Admin get all users
router.route("/all").get(protect, isAdmin, getAllUsers);

//Admin get stats
router.route("/admin/stats").get(protect, isAdmin, getAdminStats);

// Admin get specific User Profile
router.route("/specific/:id").get(protect, isAdmin, adminGetProfile);

// Admin update specific user Profile
router.route("/specific/:id").put(protect, isAdmin, adminUpdateProfile);

//Admin Delete specific user Profile
//router.route('/delete/:id').delete( protect,isAdmin,UserdeleteUser);

module.exports = router;
