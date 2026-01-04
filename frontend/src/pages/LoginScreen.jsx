import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import Swal from "sweetalert2";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Link as MuiLink,
  InputAdornment,
  IconButton,
  Paper,
} from "@mui/material";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      if (userInfo.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));

      // Redirect based on admin status
      if (res.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.data?.message || err.error,
      });
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
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
          Log In
        </Typography>

        <Box component="form" onSubmit={submitHandler} className="space-y-4">
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
              Password
            </label>
            <div className="flex">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <button
                type="button"
                onClick={handleClickShowPassword}
                className="px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 rounded-r-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md 
              hover:from-indigo-700 hover:to-purple-700 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
              transform transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Log in
          </button>
        </Box>

        <div className="mt-6 text-center">
          <Typography variant="body2" align="center">
            Don't have an account?{" "}
            <MuiLink component={Link} to="/register" variant="body2">
              Sign Up
            </MuiLink>
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
