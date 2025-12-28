import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { FcSearch } from "react-icons/fc";
import axios from "axios";
import { toast } from "react-toastify";

const SearchResults = ({ user, setWishlist }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [fullUser, setFullUser] = useState(null);
    const isLoggedIn = !!user;

    const query = new URLSearchParams(location.search).get("q")?.toLowerCase() || "";

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await axios.get("http://localhost:3000/api/books");
                if (res.status === 200) {
                    const sortedBooks = res.data.sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    );
                    setBooks(sortedBooks);

                    if (query.length >= 3) {
                        const filtered = sortedBooks.filter(
                            (book) =>
                                (book.title && book.title.toLowerCase().includes(query)) ||
                                (book.author && book.author.toLowerCase().includes(query))
                        );
                        setFilteredResults(filtered);
                    } else {
                        setFilteredResults([]);
                    }
                }
            } catch (err) {
                console.error("Search request failed", err);
                toast.error("Failed to fetch books");
            }
        };

        fetchBooks();
    }, [query]);

    useEffect(() => {
        if (!user?.id) return;
        const fetchUser = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/api/auth/${user.id}`);
                if (res.status === 200) setFullUser(res.data);
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
        if (date.toDateString() === today.toDateString()) return "Today";
        if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
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
                await axios.post("http://localhost:3000/api/wishlist/remove", {
                    userId: user.id,
                    bookId,
                });
                updatedWishlist = fullUser.wishlist.filter((item) => item !== bookId);
                toast.success("Removed from wishlist");
            } else {
                await axios.post("http://localhost:3000/api/wishlist/add", {
                    userId: user.id,
                    bookId,
                });
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
        <div className="bg-[#f9fafb] min-h-screen px-4 py-8">
            <div className="max-w-screen-xl mx-auto">
                <h1 className="text-3xl font-semibold text-gray-800 mb-6">
                    Search Results for: <span className="text-blue-600">"{query}"</span>
                </h1>
                <hr className="border-gray-300 mb-8" />

                {(query.length < 3 || filteredResults.length === 0) ? (
                    <div className="flex flex-col items-center justify-center mt-16 text-gray-400">
                        <FcSearch size={80} className="mb-4" />
                        <p className="text-xl font-medium mb-2">No results found</p>
                        <p className="max-w-md text-center text-sm text-gray-500">
                            We couldn't find any books matching your search. Try different keywords or check
                            your spelling.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredResults.map((book) => {
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

export default SearchResults;






