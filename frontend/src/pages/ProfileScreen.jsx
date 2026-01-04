import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "../slices/usersApiSlice";
import { setCredentials, logout } from "../slices/authSlice";
import Swal from "sweetalert2";
import {
  Box,
  Typography,
  CircularProgress,
  Link as MuiLink,
} from "@mui/material";

const ProfileScreen = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading }] = useUpdateUserMutation();
  const [deleteProfile] = useDeleteUserMutation();

  useEffect(() => {
    if (!userInfo) {
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }
    setName(userInfo.name);
    setEmail(userInfo.email);
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Passwords do not match",
      });
      return;
    }

    try {
      const payload = {
        _id: userInfo._id,
        name,
        email,
      };
      if (password) {
        payload.password = password;
      }
      const res = await updateProfile(payload).unwrap();
      dispatch(setCredentials(res));
      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Profile updated successfully",
      });
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.data?.message || err.error,
      });
    }
  };

  const deleteProfileHandler = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "This action cannot be undone!",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await deleteProfile(userInfo._id).unwrap();
        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "Your profile has been deleted.",
        });
        dispatch(logout()); // Clear user info and cookies
        navigate("/");
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err?.data?.message || err.error,
        });
      }
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-[1.01]">
        <Typography
          component="h1"
          variant="h5"
          fontWeight="bold"
          className="text-3xl mb-6 text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 animate-pulse"
        >
          Update Your Profile
        </Typography>

        <Box component="form" onSubmit={submitHandler} className="space-y-4">
          <div className="relative">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="relative">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Password
            </label>
            <div className="flex">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleClickShowPassword}
                className="px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 rounded-r-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <Typography variant="caption" color="textSecondary">
              Leave blank to keep current password
            </Typography>
          </div>

          <div className="relative">
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm New Password
            </label>
            <div className="flex">
              <input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleClickShowConfirmPassword}
                className="px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 rounded-r-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md
 hover:from-indigo-700 hover:to-purple-700
 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
 transform transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Update Profile"}
          </button>
        </Box>

        <button
          type="button"
          onClick={deleteProfileHandler}
          className="w-full py-3 mt-4 bg-red-600 text-white rounded-md
 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
 transform transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          Delete Profile
        </button>

        <div className="mt-6 text-center">
          <Typography variant="body2" align="center">
            Want to go back?{" "}
            <MuiLink component={Link} to="/" variant="body2">
              Go Home
            </MuiLink>
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
