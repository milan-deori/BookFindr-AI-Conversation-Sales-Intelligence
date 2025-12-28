import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { TbCameraUp } from 'react-icons/tb';
import 'react-toastify/dist/ReactToastify.css';

const EditPost = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const categories = ["Study Book", "Fiction", "Biography", "Competitive Exam", "Regional & Spiritual","E-Book", "Notes", "Others"];

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [images, setImages] = useState([null, null, null]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please log in to edit an ad.');
          navigate('/login');
          return;
        }
        const { data } = await axios.get(`http://localhost:3000/api/books/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTitle(data.title);
        setAuthor(data.author);
        setCategory(data.category);
        setDescription(data.description);
        setPrice(data.price);
        setPhone(data.phone);
        setState(data.state);
        setCity(data.city);
        setPincode(data.pincode);
        // Images might be URLs, you might want to handle separately
        setImages([null, null, null]); // or preload if you want editable images
      } catch (err) {
        toast.error('Failed to fetch post details.');
      }
    };
    fetchPost();
  }, [id, navigate]);

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

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to edit an ad.');
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('author', author);
      formData.append('category', category);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('phone', phone);
      formData.append('state', state);
      formData.append('city', city);
      formData.append('pincode', pincode);
      formData.append('userId', user._id);

      images.forEach(img => {
        if (img) formData.append('images', img);
      });

      await axios.put(`http://localhost:3000/api/books/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Book ad updated successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update the ad.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-extrabold text-center mb-10 text-gray-800">✏️ Edit Your Book Ad</h1>
      <form onSubmit={handleSubmit} className="space-y-0">

        {/* Title & Author & Category */}
        <div className="space-y-6 max-w-xl mx-auto bg-white border-2 shadow border-gray-400 p-5 rounded-t-md">
          <label className="block text-sm font-semibold text-gray-700">
            Ad Title *
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={30}
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter book title"
            />
          </label>

          <label className="block text-sm font-semibold text-gray-700">
            Author *
            <input
              type="text"
              value={author}
              onChange={e => setAuthor(e.target.value)}
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Author name"
            />
          </label>

          <label className="block text-sm font-semibold text-gray-700">
            Category *
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Choose Category --</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </label>

          {category && (
            <label className="block text-sm font-semibold text-gray-700">
              Description *
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
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
        <div className="max-w-xl mx-auto bg-white border-2 shadow border-gray-400 p-5">
          <h3 className="font-bold text-lg text-gray-800 mb-4 text-center">UPLOAD UP TO 3 PHOTOS</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {[0, 1, 2].map(index => {
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
                        onChange={e => handlePhotoUpload(e, index)}
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

        {/* Price Section */}
        <div className="max-w-xl mx-auto bg-white border-2 shadow border-gray-400 p-5">
          <h3 className="font-semibold text-lg text-gray-800 mb-4 text-center">Set A Price</h3>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price<span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-2 w-full sm:w-4/5 pb-5">
            <input
              type="number"
              placeholder="₹ Enter amount"
              value={price}
              onChange={e => {
                const val = e.target.value;
                if (val >= 0 || val === '') setPrice(val);
              }}
              min="0"
              required
              className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Location Section */}
        <div className="max-w-xl mx-auto bg-white border-2 shadow border-gray-400 p-5">
          <h3 className="font-bold text-lg text-gray-800 mb-2 text-center">Location Details</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
            <input
              type="text"
              placeholder="Enter State"
              value={state}
              onChange={e => setState(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
            <input
              type="text"
              placeholder="Enter City"
              value={city}
              onChange={e => setCity(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
            <input
              type="text"
              placeholder="Enter Pincode"
              value={pincode}
              onChange={e => {
                const val = e.target.value;
                if (/^\d{0,6}$/.test(val)) setPincode(val);
              }}
              required
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {pincode && pincode.length !== 6 && (
              <p className="text-red-500 text-sm mt-1">Pincode must be 6 digits</p>
            )}
          </div>
        </div>

        {/* Phone Number Section */}
        <div className="max-w-xl mx-auto bg-white border-2 shadow border-gray-400 p-5 rounded-b-md">
          <h3 className="font-bold text-lg text-gray-800 mb-4 text-center">Contact Details</h3>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
          <div className="flex items-center overflow-hidden w-full md:w-4/6 border border-gray-300 rounded-lg shadow-sm">
            <span className="px-3 text-gray-600 border-r border-gray-300">+91</span>
            <input
              type="tel"
              pattern="[6-9]{1}[0-9]{9}"
              maxLength={10}
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
              className="w-full p-2 outline-none"
              placeholder="Enter Mobile Number"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300
              ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Updating...' : 'Update Ad'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default EditPost;

