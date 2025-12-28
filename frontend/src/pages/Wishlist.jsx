import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Wishlist = ({ user }) => {
  const [wishlistBooks, setWishlistBooks] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/wishlist/${user.id}`);
        setWishlistBooks(res.data || []);
      } catch (err) {
        console.error("Failed to fetch wishlist:", err);
        setWishlistBooks([]);
      }
    };

    if (user?.id) fetchWishlist();
  }, [user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-[#f1f2f4] min-h-screen py-6 px-4">
      <div className="max-w-screen-2xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Wishlist</h2>
        <hr className="border-gray-600 mb-6" />

        {wishlistBooks.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            <p>No books in your wishlist yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {wishlistBooks.map((book) => (
              <Link to={`/book/${book._id}`} key={book._id}>
                <div className="bg-white rounded-md border border-gray-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col p-3 hover:scale-[1.02]">
                  {/* Image */}
                  <div className="w-full h-44 bg-gray-200 rounded-md overflow-hidden">
                    <img
                      src={book.images[0]}
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>

                  {/* Info */}
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

                    <p className="font-semibold text-indigo-900 truncate">
                      Author: {book.author || "Unknown"}
                    </p>

                    <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-200 mt-auto">
                      <span>{book.city || "City"}, {book.state || "State"}</span>
                      <span>{formatDate(book.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;



// Wishlist.jsx
// Wishlist.jsx 
