import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";

const CategoriesBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) =>
    currentPath === path
      ? "text-blue-600 bg-blue-100 border-blue-500"
      : "text-gray-700 hover:text-blue-600 hover:bg-gray-100 border-transparent";

  return (
    <div className="bg-white shadow-sm border-b overflow-x-auto whitespace-nowrap scrollbar-hide">
      <div className="flex justify-start md:justify-center items-center space-x-3 text-sm font-medium px-4 py-2">
        <Link
          to="/books"
          className={`flex items-center gap-1 px-3 py-1 rounded-full border ${isActive("/books")} transition duration-200`}
          aria-current={currentPath === "/books" ? "page" : undefined}
        >
          All Categories <FaChevronDown className="mt-0.5 text-xs" />
        </Link>
        <Link
          to="/books/study"
          className={`px-3 py-1 rounded-full border ${isActive("/books/study")} transition duration-200`}
        >
          Study Book
        </Link>
        <Link
          to="/books/fiction"
          className={`px-3 py-1 rounded-full border ${isActive("/books/fiction")} transition duration-200`}
        >
          Fiction
        </Link>
        <Link
          to="/books/biography"
          className={`px-3 py-1 rounded-full border ${isActive("/books/biography")} transition duration-200`}
        >
          Biography
        </Link>
        <Link
          to="/books/competitive"
          className={`px-3 py-1 rounded-full border ${isActive("/books/competitive")} transition duration-200`}
        >
          Competitive Exam
        </Link>
        <Link
          to="/books/regional"
          className={`px-3 py-1 rounded-full border ${isActive("/books/regional")} transition duration-200`}
        >
          Regional & Spiritual
        </Link>
        <Link
          to="/books/notes"
          className={`px-3 py-1 rounded-full border ${isActive("/books/notes")} transition duration-200`}
        >
          Notes
        </Link>
        <Link
          to="/books/ebook"
          className={`px-3 py-1 rounded-full border ${isActive("/books/ebook")} transition duration-200`}
        >
          E-Book
        </Link>
        <Link
          to="/books/others"
          className={`px-3 py-1 rounded-full border ${isActive("/books/others")} transition duration-200`}
        >
          Others
        </Link>
       <Link
  to="/books/donate"
  className={`px-3 py-1 rounded-full border 
    ${isActive("/books/donate") === "text-blue-600 bg-blue-100 border-blue-500"
      ? "text-white bg-gradient-to-r from-green-400 to-blue-500 border-none shadow-md"
      : "text-white bg-gradient-to-r from-purple-400 to-pink-500 border-none hover:shadow-lg"} 
    font-semibold transition duration-300`}
> Donated Books
</Link>


      </div>
    </div>
  );
};

export default CategoriesBar;


