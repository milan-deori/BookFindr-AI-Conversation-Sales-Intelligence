import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaEyeSlash, FaEye, FaGoogle } from "react-icons/fa";
import loginIcon from "../assets/hello.gif";
import { FcGoogle } from "react-icons/fc";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ setIsLoggedIn, setUser }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", form);

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.user._id);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("loginTime", Date.now());

      setIsLoggedIn(true);
      setUser(response.data.user);

      toast.success("Login successful!", { autoClose: 2000 });
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) toast.error("Please enter all fields");
      else if (status === 401) toast.error("Invalid email");
      else if (status === 402) toast.error("Invalid password");
      else if (status === 403) toast.error("Please verify your email before logging in.");
      else toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-100 to-gray-200 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl">
        <div className="flex justify-center mb-4">
          <img
            src={loginIcon}
            alt="login gif"
            className="w-28 h-28 object-cover rounded-full"
          />
        </div>

        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Log In to Your Account
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-6 relative">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 text-gray-500"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>

          {/* Login Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 w-3/5 text-center rounded-full shadow-md transition-transform duration-300 transform hover:scale-105"
            >
              Log In
            </button>
          </div>
        </form>

        {/* OR Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="mx-4 text-gray-500 font-medium">OR</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        {/* Google Login */}
        <button
      onClick={handleGoogleLogin}
      className="w-full flex items-center justify-center gap-3 border border-gray-400 rounded-full py-2 px-4 hover:shadow-md transition duration-300"
    >
      <FcGoogle className="text-2xl" />
      <span className="text-gray-700 font-medium">Log in with Google</span>
    </button>

        {/* Sign Up Redirect */}
        <p className="text-center text-sm mt-6 text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-500 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default Login;





