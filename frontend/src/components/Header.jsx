// src/components/Header.jsx
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaRegHeart, FaRegComment, FaRegBell, FaUserCircle, FaTachometerAlt, FaQuestionCircle, FaCog, FaSignOutAlt, } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaHeart, FaComment } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import { useState, useRef, useEffect } from "react";
import { IoMenu } from "react-icons/io5";
import { GiCrossedAirFlows } from "react-icons/gi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import CategoriesBar from "./CategoriesBar";


const Header = ({ isLoggedIn, user, setIsLoggedIn, setUser }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();


  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setDropdownOpen(false);
    toast.success("Logged out successfully!", { autoClose: 2000 });
    navigate('/');
  };


  const handlefeatureClick = () => {
    toast.info("Feature coming soon!", { autoClose: 2000 });
  };


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  //search feature
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent form reload
    if (searchQuery.trim() === "") {
      toast.error("Please enter a search term", { autoClose: 2000 }); // Alert for empty input
      return;
    }

    navigate(`/search-results?q=${encodeURIComponent(searchQuery)}`); // Redirect with query param
    setSearchQuery(""); // Clear input
  };
  ;


  return (
    <>
      <header className="shadow-md bg-white relative p-2">
        {/* LARGE SCREEN */}
        <div className="hidden relative h-14 md:flex items-center  justify-between px-4 py-2">
          {/* Logo */}
          <Link to="/" className="flex items-center  ">
            <img src="/logo5.png" alt="Logo" type="image/png" className="h-14  w-auto object-contain" />
          </Link>


          {/* Search Bar */}
          <div className="flex-grow max-w-lg mx-4">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Search anything..."
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="bg-black text-white px-4 rounded-r-md" type="submit">
                <FaSearch />
              </button>
            </form>


          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-5">
            {isLoggedIn ? (
              <>
                <Link to="/wishlist">
                  <FaRegHeart className="text-2xl cursor-pointer" />
                </Link>
                <FaRegComment
                  className="text-2xl cursor-pointer"
                  onClick={handlefeatureClick}
                />
                <FaRegBell
                  className="text-2xl cursor-pointer"
                  onClick={handlefeatureClick}
                />

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <div
                    className="w-10 h-10 rounded-full bg-yellow-500 text-white flex items-center justify-center text-lg font-semibold cursor-pointer"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    {user?.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt="Profile"
                        referrerPolicy="no-referrer"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <FaUserCircle className="text-2xl" />
                    )}
                  </div>

                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, translateY: -8 }}
                      animate={{ opacity: 1, translateY: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50 p-4">
                      {/* Profile Info */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden shadow-md">
                          {user?.profilePic ? (
                            <img
                              src={user.profilePic}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-tr from-yellow-400 to-yellow-500 flex items-center justify-center text-white text-3xl">
                              <FaUserCircle />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-base text-gray-800">
                            {user?.name || "Bookfindr User"}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {user?.email || "user@example.com"}
                          </p>
                        </div>
                      </div>

                      {/* Edit Profile */}
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="block w-full text-center bg-blue-600 text-white text-sm py-1.5 font-semibold rounded-md mb-4 hover:bg-blue-400 hover:text-blue-800 transition-all duration-200"
                      >
                        View & Edit Profile
                      </Link>

                      {/* Middle Section with border top and bottom */}
                      <div className="py-2 border-y border-gray-300">
                        <ul className="space-y-2 text-gray-700 text-sm font-medium">
                          <li>
                            <Link
                              to="/dashboard"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2 pl-3 text-gray-600 hover:text-blue-500 transition"
                            >
                              <FaTachometerAlt className="text-base" /> Dashboard
                            </Link>
                          </li>
                          <hr className="my-2 border-gray-300" />
                          <li onClick={handlefeatureClick}>
                            <Link
                              to="#"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2 pl-3 text-gray-600 hover:text-blue-500 transition">
                              <FaQuestionCircle className="text-base" /> Help
                            </Link>
                          </li>
                          <hr className="my-2 border-gray-300" />
                          <li onClick={handlefeatureClick}>
                            <Link
                              to="#"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2 pl-3 text-gray-600 hover:text-blue-500 transition">
                              <FaCog className="text-base" /> Settings
                            </Link>
                          </li>
                        </ul>
                      </div>

                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        className="w-full mt-3 bg-red-400 text-red-50 py-1.5 text-sm rounded-md font-medium flex items-center justify-center gap-2">
                        <FaSignOutAlt className="text-sm" /> Logout
                      </button>
                    </motion.div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="text-lg text-gray-600 font-medium hover:underline">
                Login
              </Link>
            )}

            <Link
              to="/sell"
              className="relative inline-flex items-center justify-center px-3 py-1 font-semibold text-indigo-800 bg-white rounded-full shadow-md z-10
    before:content-[''] before:absolute before:inset-0 before:rounded-full before:z-[-1]
    before:bg-white bo
    after:content-[''] after:absolute after:inset-[-5px] after:rounded-full after:z-[-2]
    after:bg-[conic-gradient(from_0deg_at_50%_50%,#7f5af0_0deg,#5eead4_90deg,#2dd4bf_180deg,#60a5fa_270deg,#7f5af0_360deg)]"
            >
              <FaPlus className="text-indigo-700 text-sm mr-1" />
              SELL
            </Link>

          </div>
        </div>

        {/* SMALL SCREEN */}
        <div className="md:hidden relative z-50">
          {/* Top Header: Logo + Sell + Menu */}
          <div className="flex justify-between relative h-12 items-center px-3 py-2 shadow-sm bg-white">
            {/* Logo */}
            <Link to="/">
              <img src="/logo5.png" alt="Logo" className=" h-12  " />
            </Link>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Sell Button */}
              <Link
                to="/sell"
                className="relative inline-flex items-center justify-center px-2 py-1 font-semibold text-indigo-800 bg-white rounded-full shadow-md z-10
    before:content-[''] before:absolute before:inset-0 before:rounded-full before:z-[-1]
    before:bg-white bo
    after:content-[''] after:absolute after:inset-[-5px] after:rounded-full after:z-[-2]
    after:bg-[conic-gradient(from_0deg_at_50%_50%,#7f5af0_0deg,#5eead4_90deg,#2dd4bf_180deg,#60a5fa_270deg,#7f5af0_360deg)]"
              >
                <FaPlus className="text-indigo-700 text-sm mr-1" />
                SELL
              </Link>

              {/* Menu Icon */}
              {isLoggedIn ? (<IoMenu
                onClick={() => setMenuOpen(true)}
                className="text-4xl text-gray-800 cursor-pointer  hover:scale-110 hover:shadow-md hover:bg-gradient-to-tr from-indigo-300 via-blue-300 to-purple-300 ml-2 "
              />) : (
                <Link
                  to="/login"
                  className="text-lg text-gray-600 font-medium hover:underline ml-3">
                  Login
                </Link>

              )}

            </div>
          </div>

          {/* Search Bar */}
          {/* Search Bar */}
          <div className="flex-grow max-w-lg mx-6 py-2">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Search anything..."
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="bg-black text-white px-4 rounded-r-md" type="submit">
                <FaSearch />
              </button>
            </form>


          </div>

          {/* Mobile Dropdown Menu */}
          {menuOpen && (
            <div className="fixed inset-0 bg-black/30 z-50 flex justify-end">
              <div className="w-[90vw] max-w-xs bg-white shadow-xl border rounded-l-xl h-full overflow-y-auto p-4 relative">
                {/* Close Icon */}
                <div className="flex justify-end mb-4">
                  <GiCrossedAirFlows
                    className="text-2xl text-red-600 cursor-pointer"
                    onClick={() => setMenuOpen(false)}
                  />
                </div>

                {/* Profile Info */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-gradient-to-tr from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white text-3xl shadow-md">
                    {user?.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <FaUserCircle />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-base text-gray-800">
                      {user?.name || "Bookfindr User"}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {user?.email || "user@example.com"}
                    </p>
                  </div>
                </div>

                {/* View/Edit Profile */}
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full text-center bg-blue-600 text-white text-sm py-2 font-semibold rounded-md mb-5 hover:bg-blue-500 transition"
                >
                  View & Edit Profile
                </Link>

                {/* Menu Links */}
                <div className=" py-3 mb-4">
                  <ul className="space-y-3 text-sm text-gray-700 font-medium">
                    <hr className="my-2 border-gray-400" />
                    <li>
                      <Link
                        to="/dashboard"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 pl-2 hover:text-blue-500 transition"
                      >
                        <FaTachometerAlt className="text-base" />
                        Dashboard
                      </Link>
                    </li>
                    <hr className="my-2 border-gray-400" />
                    <li>
                      <Link to="/wishlist" onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 pl-2 hover:text-blue-500 transition">
                        <FaHeart className="text-base" />
                        Wishlist
                      </Link>
                    </li>
                    <hr className="my-2 border-gray-400" />

                    <li>
                      <Link
                        to="#"
                        onClick={handlefeatureClick}
                        className="flex items-center gap-2 pl-2 hover:text-blue-500 transition"
                      >
                        <IoNotifications className="text-base" />
                        Notifications
                      </Link>
                    </li>
                    <hr className="my-2 border-gray-400" />

                    <li>
                      <Link
                        to="#"
                        onClick={handlefeatureClick}
                        className="flex items-center gap-2 pl-2 hover:text-blue-500 transition">
                        <FaComment className="text-base" />
                        Messages
                      </Link>
                    </li>
                    <hr className="my-2 border-gray-400" />
                    <li>
                      <Link
                        to="#"
                        onClick={handlefeatureClick}
                        className="flex items-center gap-2 pl-2 hover:text-blue-500 transition">
                        <FaQuestionCircle className="text-base" />
                        Help
                      </Link>
                    </li>
                    <hr className="my-2 border-gray-400" />
                    <li>
                      <Link
                        to="#"
                        onClick={handlefeatureClick}
                        className="flex items-center gap-2 pl-2 hover:text-blue-500 transition">
                        <FaCog className="text-base" />
                        Settings
                      </Link>
                    </li>
                    <hr className="my-2 border-gray-400" />
                  </ul>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 text-white py-2 text-sm rounded-md font-medium flex items-center justify-center gap-2 hover:bg-red-600 transition"
                >
                  <FaSignOutAlt className="text-sm" /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
        {/* End of Mobile Dropdown Menu */}
        {/* End of SMALL SCREEN */}
      </header>
      <CategoriesBar />
      <ToastContainer position="top-center" autoClose={2000} />
    </>
  );
};
export default Header;






