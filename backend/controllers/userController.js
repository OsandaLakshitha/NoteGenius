const asyncHandler = require("express-async-handler");
const User = require("../models/userModel.js");
const generateToken = require("../utils/generateToken.js");
const HandwrittenNote = require("../models/HandwrittenNote.js");
const VoiceNote = require("../models/VoiceNote.js");
const StructuredText = require("../models/StructuredText.js");
const Folder = require("../models/Folder.js");
const Tag = require("../models/Tag.js");

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Create the user
  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    // Respond with user data (without generating a token or setting a cookie)
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Delete user profile
// route DELETE /api/users/profile
// @access private
const deleteUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    await user.deleteOne(); // Use deleteOne() method
    res.json({ message: "User removed" });
    logoutUser;
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    // Exclude the current admin user from the list
    const users = await User.find({ _id: { $ne: req.user._id } }).select(
      "name email"
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
    // Log the error for debugging purposes
    console.error(error);
  }
};

// @desc    Admin Get User Profile
// @route   GET /api/users
// @access  Private/Admin
const adminGetProfile = asyncHandler(async (req, res) => {
  const userId = req.params.id; // Get the user ID from the request parameters

  const user = await User.findById(userId); // Find the user by ID

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      userType: user.userType,
      mobile: user.mobile,
      img: user.img,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Admin Update User Profile
// @route   GET /api/users
// @access  Private/Admin
const adminUpdateProfile = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.mobile = req.body.mobile || user.mobile;
    user.img = req.body.img || user.img;
    user.userType = req.body.userType || user.userType;
    user.isAdmin = req.body.isAdmin || user.isAdmin;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      userType: updatedUser.userType,
      mobile: updatedUser.mobile,
      img: updatedUser.img,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get admin stats (counts for notes, folders, tags)
// @route   GET /api/users/admin/stats
// @access  Private/Admin
const getAdminStats = asyncHandler(async (req, res) => {
  try {
    const handwrittenNotesCount = await HandwrittenNote.countDocuments();
    const voiceNotesCount = await VoiceNote.countDocuments();
    const structuredTextCount = await StructuredText.countDocuments();
    const foldersCount = await Folder.countDocuments();
    const tagsCount = await Tag.countDocuments();

    const totalNotesCount =
      handwrittenNotesCount + voiceNotesCount + structuredTextCount;

    res.json({
      totalNotes: totalNotesCount,
      handwrittenNotes: handwrittenNotesCount,
      voiceNotes: voiceNotesCount,
      structuredText: structuredTextCount,
      folders: foldersCount,
      tags: tagsCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
    console.error(error);
  }
});

module.exports = {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUserProfile,
  adminGetProfile,
  adminUpdateProfile,
  getAdminStats,
};
