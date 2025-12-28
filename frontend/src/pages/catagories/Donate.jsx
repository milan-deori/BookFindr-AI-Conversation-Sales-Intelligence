import { useEffect, useState } from 'react';
import { FaHeart, FaBookOpen } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
const Donate = ({ user, setWishlist }) => {
    const [books, setBooks] = useState([]);
    const [fullUser, setFullUser] = useState(null);
    const navigate = useNavigate();
    const isLoggedIn = !!user;

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/books');
                const data = await res.json();
                if (res.ok) {
                    const filtered = data
                        .filter((book) => book.category === 'Donate')
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setBooks(filtered);
                }
            } catch (err) {
                console.error('Error fetching books:', err);
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
                console.error('Failed to fetch user:', err);
            }
        };
        fetchUser();
    }, [user]);

    const handleBookmark = async (bookId, e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            toast.warning('You have to login first!');
            setTimeout(() => navigate('/login'), 1000);
            return;
        }

        try {
            const alreadyBookmarked = fullUser?.wishlist?.includes(bookId);
            let updatedWishlist;

            if (alreadyBookmarked) {
                await axios.post('http://localhost:3000/api/wishlist/remove', {
                    userId: user.id,
                    bookId,
                });
                updatedWishlist = fullUser.wishlist.filter((item) => item !== bookId);
                toast.success('Removed from wishlist');
            } else {
                await axios.post('http://localhost:3000/api/wishlist/add', {
                    userId: user.id,
                    bookId,
                });
                updatedWishlist = [...(fullUser.wishlist || []), bookId];
                toast.success('Added to wishlist');
            }

            setFullUser((prev) => ({ ...prev, wishlist: updatedWishlist }));
            setWishlist(updatedWishlist);
            localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        } catch (err) {
            console.error('Wishlist update error:', err);
            toast.error('Something went wrong');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return date.toLocaleDateString();
    };

    return (
        <div className="bg-[#f1f2f4] min-h-screen w-full max-w-screen-2xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-semibold text-gray-800">Donated Books</h1>
            <hr className="my-2 border-gray-600 mb-4" />

            {books.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-20 text-gray-500">
                    <FaBookOpen className="text-7xl mb-6" />
                    <p className="text-lg font-semibold">Sorry No Donated Books Found</p>
                    <p className="mt-2 text-center max-w-sm">
                        Sorry, we couldn't find any Donated Bookd at the moment. Please check back later.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {books.map((book) => {
                        const isBookmarked = fullUser?.wishlist?.includes(book._id);
                        return (
                            <Link to={`/book/${book._id}`} key={book._id}>
                                <div className="bg-white rounded-md border border-gray-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative flex flex-col p-3 hover:scale-[1.02]">
                                    {/* Bookmark Button */}
                                    <button
                                        className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition"
                                        onClick={(e) => handleBookmark(book._id, e)}
                                    >
                                        <FaHeart
                                            className={`text-lg transition ${isBookmarked ? 'text-red-600' : 'text-gray-400 hover:text-red-600'}`}
                                        />
                                    </button>

                                    {/* Book Image */}
                                    <div className="w-full h-44 bg-gray-200 rounded-md overflow-hidden">
                                        <img
                                            src={book.images[0]}
                                            alt={book.title}
                                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                        />
                                    </div>

                                    {/* Book Info */}
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
                                        <p className="font-semibold text-indigo-900 truncate italic">by: {book.author || 'Unknown'}</p>
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
    )
}

export default Donate