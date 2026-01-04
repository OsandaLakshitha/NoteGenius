import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Menu, MenuItem, IconButton, Typography } from "@mui/material";
import { AccountCircle, AdminPanelSettings } from "@mui/icons-material";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Separate useEffect to reset menu state when user logs in
  useEffect(() => {
    // Close menu whenever auth state changes
    setAnchorEl(null);
  }, [userInfo]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-indigo-600">
              NoteGenius
            </span>
          </Link>

          <div className="flex items-center space-x-8">
            <ul className="flex space-x-8 items-center">
              <li>
                <Link
                  to="/"
                  className="text-gray-700 hover:text-indigo-600 font-medium"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/handwritten"
                  className="text-gray-700 hover:text-indigo-600 font-medium"
                >
                  Handwritten Notes
                </Link>
              </li>
              <li>
                <Link
                  to="/voice"
                  className="text-gray-700 hover:text-indigo-600 font-medium"
                >
                  Voice Notes
                </Link>
              </li>
            
              <li>
                <Link
                  to="/folders"
                  className="text-gray-700 hover:text-indigo-600 font-medium"
                >
                  Folders
                </Link>
              </li>

              {/* Admin Link (Visible only if user is admin) */}
              {userInfo?.isAdmin && (
                <li>
                  <Link
                    to="/admin"
                    className="text-gray-700 hover:text-indigo-600 font-medium flex items-center"
                  >
                    <AdminPanelSettings className="mr-1" fontSize="small" />
                    Admin
                  </Link>
                </li>
              )}
            </ul>
            <div className="flex items-center space-x-4">
              {userInfo ? (
                <>
                  <Typography
                    variant="body1"
                    className="text-gray-700 font-medium"
                  >
                    {userInfo.name}
                  </Typography>
                  <IconButton onClick={handleMenuOpen}>
                    <AccountCircle className="text-gray-700" />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleMenuClose}>
                      <Link
                        to="/profile"
                        className="text-gray-700 hover:text-indigo-600 font-medium"
                      >
                        Profile
                      </Link>
                    </MenuItem>

                    {/* Admin Menu Item (Visible only if user is admin) */}
                    {userInfo?.isAdmin && (
                      <MenuItem onClick={handleMenuClose}>
                        <Link
                          to="/admin"
                          className="text-gray-700 hover:text-indigo-600 font-medium flex items-center"
                        >
                          <AdminPanelSettings
                            className="mr-1"
                            fontSize="small"
                          />
                          Admin
                        </Link>
                      </MenuItem>
                    )}

                    <MenuItem
                      onClick={logoutHandler}
                      className="text-gray-700 hover:text-indigo-600 font-medium"
                    >
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-800 font-medium hover:text-indigo-600"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-indigo-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 shadow-sm"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
