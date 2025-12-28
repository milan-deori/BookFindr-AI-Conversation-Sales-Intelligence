import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import imageTobase64 from "../utils/imageTobase64";
import loginIcons from "../assets/signin.gif";
import "react-toastify/dist/ReactToastify.css";

axios.defaults.withCredentials = true;

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePic: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1); // Step 1 = form, Step 2 = OTP input
const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUploadPic = async (e) => {
    const file = e.target.files[0];
    const imagePic = await imageTobase64(file);
    setForm((prev) => ({
      ...prev,
      profilePic: imagePic,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.name || !form.email || !form.password || !form.confirmPassword) {
    toast.error("Please fill in all fields");
    return;
  }

  if (form.password !== form.confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  try {
    const response = await axios.post("http://localhost:3000/api/auth/signup", form);
    toast.success("OTP sent to your email!");
    setStep(2); // Move to OTP input step
  } catch (error) {
    if (error.response?.status === 409) {
      toast.error("User already exists");
    } else {
      toast.error("Signup failed. Try again.");
    }
  }
};
const handleVerifyOtp = async () => {
  if (!otp) {
    toast.error("Please enter the OTP");
    return;
  }

  try {
    const res = await axios.post("http://localhost:3000/api/auth/verify-otp", {
      email: form.email,
      otp,
    });

    if (res.status === 200) {
      toast.success("Email verified successfully!");
      setTimeout(() => navigate("/login"), 1500);
    }
  } catch (err) {
    toast.error(err.response?.data?.message || "Invalid or expired OTP");
  }
};



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-100 px-4">
      {step === 1 ? (
  <form onSubmit={handleSubmit} className="w-full max-w-md bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/30">
    
    {/* Profile Picture */}
    <div className="relative w-28 h-28 mx-auto mb-6 rounded-full overflow-hidden shadow-lg border-4 border-white">
      <img
        src={form.profilePic || loginIcons}
        alt="Profile Preview"
        className="w-full h-full object-cover text-white"
      />
      <label className="cursor-pointer">
        <div className="text-xs bg-white/80 text-gray-800 font-semibold pb-5 pt-2 text-center absolute bottom-0 w-full">
          Upload
        </div>
        <input type="file" accept="image/*" className="hidden" onChange={handleUploadPic} />
      </label>
    </div>

    {/* Full Name */}
    <div className="mb-4">
      <label className="block mb-1 text-sm font-semibold text-gray-700">Full Name</label>
      <input
        type="text"
        name="name"
        placeholder="Enter your full name"
        value={form.name}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
      />
    </div>

    {/* Email */}
    <div className="mb-4">
      <label className="block mb-1 text-sm font-semibold text-gray-700">Email Address</label>
      <input
        type="email"
        name="email"
        placeholder="Enter your email"
        value={form.email}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
      />
    </div>

    {/* Password */}
    <div className="mb-4 relative">
      <label className="block mb-1 text-sm font-semibold text-gray-700">Password</label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Enter password"
          value={form.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        >
          {showPassword ? <FaEye /> : <FaEyeSlash />}
        </button>
      </div>
    </div>

    {/* Confirm Password */}
    <div className="mb-6 relative">
      <label className="block mb-1 text-sm font-semibold text-gray-700">Confirm Password</label>
      <div className="relative">
        <input
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirm password"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        >
          {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
        </button>
      </div>
    </div>

    {/* Submit Button */}
   <div className="flex justify-center mt-4">
  <button
    type="submit"
    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 w-3/5 text-center rounded-full shadow-md transition-transform duration-300 transform hover:scale-105"
  >
    Sign Up
  </button>

</div>




    {/* Login Redirect */}
    <p className="text-center text-sm mt-4 text-gray-600">
      Already have an account?{" "}
      <Link to="/login" className="text-blue-600 font-medium hover:underline">
        Log In
      </Link>
    </p>
  </form>
) : (
  <div className="w-full max-w-md bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/30 text-center">
    <h2 className="text-xl font-semibold mb-4">Verify Your Email</h2>
    <p className="text-gray-600 mb-4">Enter the 6-digit OTP sent to <strong>{form.email}</strong></p>
    <input
      type="text"
      placeholder="Enter OTP"
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
      className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm text-center"
    />
    <button
      onClick={handleVerifyOtp}
      className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 w-3/5 rounded-full shadow-md transition-transform duration-300 transform hover:scale-105"
    >
      Verify OTP
    </button>
  </div>
)}
  <ToastContainer position="top-center" autoClose={2000} />
</div>

  );
};

export default Signup;




