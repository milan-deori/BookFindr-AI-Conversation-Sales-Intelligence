import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { TbCameraUp } from 'react-icons/tb';
import { useEffect } from 'react';
import React from 'react';
import userImage from './user.png';
import 'react-toastify/dist/ReactToastify.css';

const Sell = ({ user }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');
  const [images, setImages] = useState([null, null, null]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const categories = ["Study Book", "Fiction", "Biography", "Competitive Exam", "Regional & Spiritual",  "Notes", "Donate", "Others"];

  
   

  const handlePhotoUpload = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('Please log in to post an ad.');
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
        formData.append('category', category);
      formData.append('author', author);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('phone', phone);
      formData.append('state', state);
      formData.append('city', city);
      formData.append('pincode', pincode);
      formData.append('userId', user._id);

     
   
    
      images.forEach((img) => {
        if (img) formData.append('images', img);
      });

      await axios.post('http://localhost:3000/api/books', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Book ad posted successfully!');
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to post the ad.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');  
    if (!token) {
      toast.error('Please log in to post an ad.');
      navigate('/login');
      return;
    }
  }
  , [navigate]); 
   


  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 bg-gray-100 min-h-screen  ">
      <h1 className="text-3xl font-extrabold text-center mb-10 text-gray-800">📚 Sell Your Book</h1>
      <form onSubmit={handleSubmit} className="space-y-0">
        {/* Title & Description */}
        <div className="space-y-6 max-w-xl  mx-auto bg-white border-2 shadow border-gray-400 p-5 rounded-t-md">
          {/* Title */}
          <label className="block text-sm font-semibold text-gray-700">
            Ad Title *
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={50}
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter book title"
            />
            
          </label>
        

          {/* Author */}
          <label className="block text-sm font-semibold text-gray-700">
            Author *
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Author name"
            />
          </label>

          {/* Category */}
          <label className="block text-sm font-semibold text-gray-700">
            Category *
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Choose Category --</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </label>

          {/* Description (only show when a category is selected) */}
          {category && (
            <label className="block text-sm font-semibold text-gray-700">
              Description *
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                required
                rows={7}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm resize-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe the book, its condition, and why you're selling it..."
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {description.length}/500
              </div>
            </label>
          )}
        </div>

        {/* Upload Photos */}
       <div className=" max-w-xl  mx-auto bg-white border-2 shadow border-gray-400 p-5">
  <h3 className="font-bold text-lg text-gray-800 mb-4 text-center">UPLOAD UP TO 3 PHOTOS</h3>
  
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
    {[0, 1, 2].map((index) => {
      const isDisabled = index > 0 && !images[index - 1];
      const hasImage = !!images[index];

      return (
        <div
          key={index}
          className={`relative w-full h-40 border-2 rounded-lg flex items-center justify-center overflow-hidden transition-all duration-200 
            ${hasImage ? 'border-blue-500' : 'border-dashed border-gray-300'} 
            ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}`}
        >
          <label htmlFor={`photo-${index}`} className="absolute inset-0 flex items-center justify-center cursor-pointer">
            {!isDisabled && (
              <input
                id={`photo-${index}`}
                type="file"
                accept="image/*"
                onChange={(e) => handlePhotoUpload(e, index)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            )}

            {hasImage ? (
              <img
                src={URL.createObjectURL(images[index])}
                alt={`Uploaded ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center text-gray-500 text-sm z-10">
                <TbCameraUp className="w-6 h-6 mb-1" />
                <span>{index === 0 || !isDisabled ? 'Add Photo' : 'Upload Previous First'}</span>
              </div>
            )}
          </label>
        </div>
      );
    })}
  </div>

  <div className="text-sm text-red-500 ml-1">This field is mandatory</div>
</div>


      {/* Price */}
<div className="max-w-xl  mx-auto bg-white border-2 shadow border-gray-400 p-5 ">
  <h3 className="font-semibold text-lg text-gray-800 mb-4 text-center">Set A Price</h3>

 <label className="block text-sm font-medium text-gray-700 mb-1">
    Price<span className="text-red-500">*</span></label>
  <div className="flex items-center space-x-2 w-full sm:w-4/5 pb-5">
   <input
  type="number"
  placeholder="₹ Enter amount"
  value={price}
  onChange={(e) => {
    const value = e.target.value;
    if (value >= 0 || value === "") {
      setPrice(value);
    }
  }}
  min="0"
  required
  className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
/>
  </div>
</div>



       {/* Location Details */}
<div className="max-w-xl  mx-auto bg-white border-2 shadow border-gray-400 p-5">
  <h3 className="font-bold text-lg text-gray-800 mb-2 text-center">Location Details</h3>

  {/* State */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
    <input
      type="text"
      placeholder="Enter State"
      value={state}
      onChange={(e) => setState(e.target.value)}
      required
      className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
    />
  </div>

  {/* City */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
    <input
      type="text"
      placeholder="Enter City"
      value={city}
      onChange={(e) => setCity(e.target.value)}
      required
      className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
    />
  </div>

  {/* Pincode */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
    <input
      type="text"
      placeholder="Enter Pincode"
      value={pincode}
      onChange={(e) => {
        const value = e.target.value;
        // Allow only digits and max 6 characters
        if (/^\d{0,6}$/.test(value)) setPincode(value);
      }}
      required
      className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
    />
    {pincode && pincode.length !== 6 && (
      <p className="text-red-500 text-sm mt-1">Pincode must be 6 digits</p>
    )}
  </div>
</div>

{/* Review Your Details */}
<div className="max-w-xl  mx-auto bg-white border-2 shadow border-gray-400 p-5">
  <h3 className="font-bold text-lg text-gray-800 mb-6 text-center">REVIEW YOUR DETAILS</h3>

  <div className="flex items-start mb-6">
    {/* Profile Image with Camera Icon */}
    <div className="relative w-20 h-20 rounded-full overflow-hidden border border-gray-300 mr-4">
      <img
        src={user?.profilePic || userImage}
        alt="User"
        className="object-cover w-full h-full rounded-full"
      />
      <div className="absolute bottom-0 w-full bg-black bg-opacity-60 text-white text-center text-xs py-1">
        <i className="fas fa-camera"></i>
      </div>
    </div>

    {/* Name Field */}
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-700 ml-2 mb-1">Name</label>
      <input
        type="text"
        value={(user?.name || "").toUpperCase()}
        readOnly
        className="w-4/12 border border-black bg-gray-200 p-2 text-center ml-2 rounded text-gray-800"
        maxLength={30}
      />
    
    </div>
  </div>

  {/* Verify Account */}
  <div className="mb-4">
    <h4 className="font-semibold text-gray-800 mb-1 ">Let's verify your account</h4>
    <p className="text-sm text-gray-600 mb-3 ">
      We will send you a confirmation code by SMS on the next step.
    </p>
    <label className="block text-sm font-medium text-gray-700 mt-5 ml-3">Mobile Number *</label>
    <div className="flex items-center  overflow-hidden w-full md:w-4/6 ml-3 mt-1 border border-gray-300 rounded-lg shadow-sm">
      <span className="px-3 text-gray-600 border-r  border-gray-300">+91</span>
      <input
        type="tel"
        pattern="[6-9]{1}[0-9]{9}"
        maxLength={10}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
        className="w-full p-2 outline-none  "
        placeholder="Enter Mobile Number"
      />
    </div>
  </div>
</div>


{/* Submit Button */}
<div className="text-center pt-6 ">
  <button
    type="submit"
    disabled={isSubmitting}
    className={`bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 
      ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {isSubmitting ? 'Posting...' : 'Post Ad'}
  </button>


        </div>
      </form>
    </div>
  );
};

export default Sell;










// Note: Make sure to handle the file upload and form submission properly in your backend.
// You may need to adjust the API endpoint and the way you handle the form data based on your backend implementation.