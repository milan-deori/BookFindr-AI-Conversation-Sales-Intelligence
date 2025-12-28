import { useEffect, useState } from "react";
import { FaEye, FaHeart, FaCalendarAlt } from "react-icons/fa";
import userImage from "./user.png";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MdVerified } from "react-icons/md";

const Dashboard = ({ user }) => {
  const [books, setBooks] = useState([]);
  const [fullUser, setFullUser] = useState(null);
  const [sold, setSold] = useState(false);

  const handleMarkasSold = async (bookId) => {
    const confirm = window.confirm(
      "⚠️ Once you mark this book as sold, it cannot be undone. Do you want to continue?"
    );
    if (!confirm) return;
    try {
      const res = await fetch(`http://localhost:3000/api/books/${bookId}/sold`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sold: true }),
      });
      if (res.ok) {
        setSold(true);
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book._id === bookId ? { ...book, sold: true } : book
          )
        );
      } else {
        console.error("Failed to mark book as sold");
      }
    } catch (err) {
      console.error("Error marking book as sold:", err);
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/books");
        const data = await res.json();
        if (res.ok) {
          const userBooks = data.filter(
            (book) => book.user && book.user._id === user.id
          );
          setBooks(userBooks);
        }
      } catch (err) {
        console.error("Failed to fetch books:", err);
      }
    };

    fetchBooks();
  }, [user]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/auth/${user.id}`);
        const data = await res.json();
        if (res.ok) {
          setFullUser(data);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, [user.id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const totalLikes = books.reduce((sum, book) => sum + (book.likes || 0), 0);
  const totalViews = books.reduce((sum, book) => sum + (book.views || 0), 0);
  const totalSold = books.filter((book) => book.isSold || book.sold).length;

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4 sm:px-6 lg:px-8 py-8">
      {/* Main Flex Container: stacked on small, horizontal on lg */}
      <div className="flex flex-col lg:flex-row gap-6 justify-center items-stretch">
        {/* Left: Profile */}
        <div className="w-full lg:w-1/4">
          <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 p-6 rounded-xl shadow-md text-center h-full flex flex-col justify-between text-white">
            <div>
              {/* Profile Picture */}
              <img
                src={fullUser?.profilePic || userImage}
                alt="User"
                className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-xl object-cover"
              />

              {/* User Name */}
              <h2 className="text-xl font-semibold tracking-wide mb-1 truncate">
                {user.name.toUpperCase()}
              </h2>

              {/* Membership Date */}
              <div className="text-sm flex items-center justify-center gap-2 mt-2 opacity-90">
                <FaCalendarAlt className="text-white" />
                {fullUser ? (
                  <span>
                    Member since{" "}
                    {new Date(fullUser.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                    })}
                  </span>
                ) : (
                  "Loading..."
                )}
              </div>

              {/* Verified User */}
              <div className="text-sm mt-2 flex items-center justify-center gap-2 text-emerald-300 font-semibold">
                <MdVerified className="text-emerald-400 text-base" />
                <span>Verified User</span>
              </div>
            </div>

            {/* Edit Button */}
            <button className="mt-6 bg-white text-indigo-700 text-sm py-2 px-4 rounded-full hover:bg-gray-100 transition w-full">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Right: Stats Section */}
        <div className="w-full lg:w-3/5 flex flex-col justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
            <div className="bg-indigo-500 text-white p-6 rounded-lg shadow-md">
              <p className="text-sm text-center">Books Posted</p>
              <p className="text-2xl font-bold text-center">{books.length}</p>
            </div>
            <div className="bg-pink-500 text-white p-6 rounded-lg shadow-md">
              <p className="text-sm text-center">Total Likes</p>
              <p className="text-2xl font-bold text-center">{totalLikes}</p>
            </div>
            <div className="bg-teal-500 text-white p-6 rounded-lg shadow-md">
              <p className="text-sm text-center">Total Views</p>
              <p className="text-2xl font-bold text-center">{totalViews}</p>
            </div>
            <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-md">
              <p className="text-sm text-center">Books Sold</p>
              <p className="text-2xl font-bold text-center">{totalSold}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Divider */}
      <hr className="my-8 border-t w-full border-gray-500" />

      {/* My Ads Section */}
      <div>
        <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center tracking-wide ">
          My Ads
        </h2>

        {books.length === 0 ? (
          <p className="text-gray-500 text-center italic">
            You haven't posted any ads yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {books.map((book) => (
              <motion.div
                whileHover={{ scale: 1.015 }}
                key={book._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-100"
              >
                <div className="grid grid-cols-6 p-4 items-center">
                  {/* Date */}
                  <div className="text-center col-span-1 border-r px-2 text-gray-600">
                    <p className="font-semibold text-xs text-gray-800">Posted</p>
                    <p className="text-sm">{formatDate(book.createdAt)}</p>
                    <p className="text-xs">
                      {new Date(book.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {/* Book Info */}
                  <Link
                    to={`/book/${book._id}`}
                    className="col-span-3 border-r px-3 hover:bg-gray-50 transition rounded-md"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={book.images?.[0]}
                        alt={book.title}
                        className="w-16 h-20 object-cover rounded-lg border border-gray-200"
                      />
                      <div className="overflow-hidden">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {book.title}
                        </h3>
                        <p className="text-indigo-600 font-bold text-sm">
                          ₹ {book.price}
                        </p>
                      </div>
                    </div>
                  </Link>

                  {/* Status with Button */}
                  <div className="text-center col-span-1 border-r px-1 flex flex-col items-center justify-center space-y-2">
                    {book.isSold || book.sold ? (
                      <span className="text-xs px-3 py-1 rounded-full text-white bg-red-600 tracking-wide">
                        SOLD
                      </span>
                    ) : (
                      <button
                        onClick={() => handleMarkasSold(book._id)}
                        className="px-3 py-1 bg-blue-500 hover:bg-blue-700 text-white text-xs rounded-full tracking-wide transition"
                      >
                        Mark as Sold
                      </button>
                    )}
                  </div>

                  {/* Static Status Description */}
                  <div className="col-span-1 px-3 text-sm text-gray-600">
                    <p className="mb-1 font-medium text-gray-700">Status</p>
                    {book.isSold || book.sold ? (
                      <p className="text-xs text-red-600 font-semibold">Inactive</p>
                    ) : (
                      <p className="text-xs text-green-600 font-semibold">Active</p>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t px-4 py-2 bg-gray-50 text-sm text-gray-600">
                  <div className="flex space-x-6">
                    <div className="flex items-center">
                      <FaEye className="mr-1 text-indigo-500" />
                      <span className="font-medium">Views:</span> {book.views || 0}
                    </div>
                    <div className="flex items-center">
                      <FaHeart className="mr-1 text-pink-500" />
                      <span className="font-medium">Likes:</span> {book.likes || 0}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;









