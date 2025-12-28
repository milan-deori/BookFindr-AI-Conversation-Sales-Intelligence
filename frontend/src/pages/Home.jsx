import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import axios from 'axios';
import BannerSlider from '../components/BannerSlider';
import { toast } from 'react-toastify';

const Home = ({ user, setWishlist }) => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [fullUser, setFullUser] = useState(null);
  const [loading, setLoading] = useState(true); // 👈 New state
  const isLoggedIn = !!user;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true); // 👈 start loading
        const res = await fetch('http://localhost:3000/api/books');
        const data = await res.json();
        if (res.ok) {
          const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setBooks(sorted);
        }
      } catch (err) {
        console.error('Error fetching books:', err);
      } finally {
        setLoading(false); // 👈 stop loading
      }
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/auth/${user.id}`);
        const data = await res.json();
        if (res.ok) setFullUser(data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, [user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const handleBookmark = async (bookId, e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.warning("You have to login first!");
      setTimeout(() => navigate("/login"), 1000);
      return;
    }

    try {
      const alreadyBookmarked = fullUser?.wishlist?.includes(bookId);
      let updatedWishlist;

      if (alreadyBookmarked) {
        await axios.post("http://localhost:3000/api/wishlist/remove", { userId: user.id, bookId });
        updatedWishlist = fullUser.wishlist.filter((item) => item !== bookId);
        toast.success("Removed from wishlist");
      } else {
        await axios.post("http://localhost:3000/api/wishlist/add", { userId: user.id, bookId });
        updatedWishlist = [...(fullUser.wishlist || []), bookId];
        toast.success("Added to wishlist");
      }

      setFullUser((prev) => ({ ...prev, wishlist: updatedWishlist }));
      setWishlist(updatedWishlist);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    } catch (err) {
      console.error("Error updating wishlist", err);
      toast.error("Failed to update wishlist");
    }
  };

  return (
    <div className="bg-[#f1f2f4] min-h-screen">
      {/* Banner Section */}
      <div className="w-full mx-auto max-w-screen-2xl px-4 pt-4">
        <BannerSlider />
      </div>

      {/* Cards Section */}
      <div className="w-full max-w-screen-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold text-gray-800 ">Fresh Recommendations</h1>
        <hr className="my-2 border-gray-600 mb-4" />

        {/* 👇 Loader */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-600 font-medium">Loading books...</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {books.map((book) => {
              const isBookmarked = fullUser?.wishlist?.includes(book._id);
              return (
                <Link to={`/book/${book._id}`} key={book._id}>
                  <div className="bg-white rounded-md border border-gray-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative flex flex-col p-3 hover:scale-[1.02]">

                    {/* Bookmark Icon */}
                    <button
                      className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition"
                      onClick={(e) => handleBookmark(book._id, e)}
                    >
                      <FaHeart
                        className={`text-lg transition ${isBookmarked ? "text-red-600" : "text-gray-400 hover:text-red-600"
                          }`}
                      />
                    </button>

                    {/* Image Section */}
                    <div className="w-full h-44 bg-gray-200 rounded-md overflow-hidden">
                      <img
                        src={book.images[0]}
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>

                    {/* Info Section */}
                    <div className="flex flex-col justify-between mt-3 px-2 flex-grow text-sm text-gray-700 space-y-2">
                      <div className="flex items-center justify-between">
                        {book.category?.toLowerCase() === "donate" ? (
                          <h2 className="text-base font-extrabold text-gray-700">
                            ₹ 00
                          </h2>
                        ) : (
                          <h2 className="text-base font-semibold text-gray-900">
                            ₹ {book.price}
                          </h2>
                        )}

                        {book.category.toLowerCase() === "donate" && (
                          <span className="bg-gradient-to-r from-green-400 to-blue-500 text-white text-[11px] md:text-xs px-2 md:px-3 py-[2px] md:py-1 rounded-full font-medium shadow-md whitespace-nowrap">
                            For Donate
                          </span>
                        )}
                      </div>

                      <p className="font-medium truncate">{book.title}</p>

                      {/* Author styled distinctly */}
                      <p className="font-semibold text-indigo-900 truncate italic">
                        by:  {book.author || "Unknown"}
                      </p>

                      {/* Bottom info */}
                      <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-200 mt-auto">
                        <span>{book.city}, {book.state}</span>
                        <span>{formatDate(book.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
