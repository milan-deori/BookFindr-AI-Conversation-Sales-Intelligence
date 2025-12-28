import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaHeart } from "react-icons/fa";
import { GoShareAndroid } from "react-icons/go";
import { FaWhatsapp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
    FaUserCircle
} from "react-icons/fa";
import axios from 'axios';


const BookDetails = ({ user, isLoggedIn, setWishlist, }) => {




    //
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [currentImg, setCurrentImg] = useState(0);
    const [bookmarked, setBookmarked] = useState(false);
    const [recommendedBooks, setRecommendedBooks] = useState([]);
    const [isZoomed, setIsZoomed] = useState(false);




    const navigate = useNavigate();


    useEffect(() => {
        const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        setBookmarked(storedWishlist.includes(id));
    }, [id]);


    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/books/${id}`);
                const bookData = response.data;
                setBook(bookData);

                const rec = await axios.get(`http://localhost:3000/api/books/category/${bookData.category}`);
                setRecommendedBooks(rec.data.filter(b => b._id !== id));
            } catch (err) {
                console.error("Error fetching book or recommendations:", err);
            }
        };

        fetchBook();
    }, [id]);




    useEffect(() => {
        if (book && user && user.id) {
            fetch(`http://localhost:3000/api/books/${book._id}/view`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId: user.id })
            });
        }
    }, [book, user]);








    if (!book) return <div className="p-6">Loading...</div>;


    const handlePrev = () => {
        setCurrentImg((prev) => (prev === 0 ? book.images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentImg((prev) => (prev === book.images.length - 1 ? 0 : prev + 1));
    };


    //for booklist 






    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                const response = await fetch(`http://localhost:3000/api/books/${id}`, {
                    method: "DELETE",
                    credentials: "include",
                });

                if (response.ok) {
                    alert('Post deleted successfully');
                    window.location.href = '/'; // Redirect to home or another page
                } else {
                    const errorData = await response.json();
                    alert(`Error deleting post: ${errorData.message}`);
                }
            } catch (err) {
                console.error('Error deleting post:', err);
                alert('Failed to delete post. Please try again later.');
            }
        }

    };


    const handleShare = () => {
        const url = window.location.href;
        const text = `Check out this book: ₹${book.price} - ${book.title} - ${url}`;
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, "_blank");
    };


    const handlewpShare = () => {


        if (!isLoggedIn) {
            toast.warning("You have to login first!", {
                position: "top-center",
                autoClose: 2000,
            });
            setTimeout(() => {
                navigate("/login");
            }, 1000); // Wait 2 seconds before redirect
            return;
        }
        const url = window.location.href;
        const text = `hi, I am interested in this book:- ${url}`;
        const phone = book.phone;

        const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, "_blank");
    };







    const handleBookmark = async () => {
        if (!isLoggedIn) {
            toast.warning("You have to login first!");
            setTimeout(() => navigate("/login"), 1000);
            return;
        }

        try {
            if (!bookmarked) {
                // Add to wishlist
                await axios.post("http://localhost:3000/api/wishlist/add", {
                    userId: user.id,
                    bookId: id,
                });
                setWishlist((prev) => [...prev, id]);
                toast.success("Added to wishlist");
            } else {
                // Remove from wishlist
                await axios.post("http://localhost:3000/api/wishlist/remove", {
                    userId: user.id,
                    bookId: id,
                });
                setWishlist((prev) => prev.filter((item) => item !== id));
                toast.success("Removed from wishlist");
            }

            setBookmarked(!bookmarked);
        } catch (err) {
            console.error("Error updating wishlist", err);
            toast.error("Failed to update wishlist");
        }
    };









    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Side - Image Slider */}
                <div className="lg:col-span-2 relative">
                    {/* Main Image with slide buttons */}
                    <div
                        className="bg-black h-[450px] flex items-center justify-center relative rounded-md overflow-hidden shadow-lg cursor-zoom-in"
                        onClick={() => setIsZoomed(true)}
                    >
                        <img
                            src={book.images[currentImg]}
                            alt={`Book Image ${currentImg + 1}`}
                            className="w-full h-full object-contain transition-transform duration-300 hover:scale-105 mt-8"
                            style={{ maxHeight: '100%', maxWidth: '100%' }}
                        />

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handlePrev();
                            }}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white text-black bg-opacity-80 p-3 rounded-full shadow-md hover:bg-opacity-100 hover:scale-105 transition duration-200"
                        >
                            <FaChevronLeft size={22} />
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleNext();
                            }}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white text-black bg-opacity-80 p-3 rounded-full shadow-md hover:bg-opacity-100 hover:scale-105 transition duration-200"
                        >
                            <FaChevronRight size={22} />
                        </button>

                        <div className="absolute bottom-3 right-4 bg-black bg-opacity-60 text-white text-sm px-3 py-1 rounded-full shadow">
                            {currentImg + 1} / {book.images.length}
                        </div>
                    </div>
                    {/* Zoomed Image Modal */}
                    {isZoomed && (
                        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
                            <img
                                src={book.images[currentImg]}
                                alt={`Zoomed Book Image`}
                                className="max-h-[80%] max-w-[85%] object-contain transform scale-100 transition duration-300"
                            />

                            {/* Close Button */}
                            <button
                                onClick={() => setIsZoomed(false)}
                                className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-red-400"
                            >
                                &times;
                            </button>

                            {/* Prev/Next Arrows */}
                            <button
                                onClick={handlePrev}
                                className="absolute left-5 top-1/2 transform -translate-y-1/2 bg-white text-black bg-opacity-70 p-2 rounded-full hover:scale-110"
                            >
                                <FaChevronLeft size={24} />
                            </button>
                            <button
                                onClick={handleNext}
                                className="absolute right-5 top-1/2 transform -translate-y-1/2 bg-white text-black bg-opacity-70 p-2 rounded-full hover:scale-110"
                            >
                                <FaChevronRight size={24} />
                            </button>
                            <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-full px-6">
                                <div className="flex gap-3 overflow-x-auto justify-center scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300">
                                    {book.images.map((img, i) => (
                                        <img
                                            key={i}
                                            src={img}
                                            alt={`Thumb ${i}`}
                                            className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 transition-transform duration-300 ${currentImg === i
                                                ? 'border-blue-500 shadow-lg scale-105'
                                                : 'border-gray-400 hover:scale-105'
                                                }`}
                                            onClick={() => setCurrentImg(i)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}




                    {/* Thumbnails */}
                    <div className="mt-3 flex gap-2 overflow-x-auto">
                        {book.images.map((img, i) => (
                            <img
                                key={i}
                                src={img}
                                alt={`Thumbnail ${i}`}
                                className={`w-20 h-20 object-cover border ${currentImg === i ? 'border-blue-500' : 'border-gray-300'} cursor-pointer`}
                                onClick={() => setCurrentImg(i)}
                            />
                        ))}
                    </div>




                    {/* Description */}
                    <div className="mt-6 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                        <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">📘 Description</h2>
                        <p className="text-base text-gray-700 leading-relaxed tracking-wide">
                            {book.description}
                        </p>
                    </div>

                </div>

                {/* Right Side Info */}
                <div className="space-y-4">
                    <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200 relative space-y-2">
                        {/* Top Right Icons */}
                        <div className="absolute top-4 right-4 flex gap-3 text-gray-600">
                            <button
                                onClick={handleShare}
                                title="Share"
                                className="p-2 rounded-full hover:bg-cyan-100 transition duration-200"
                            >
                                <GoShareAndroid className="text-[24px] font-bold text-black" />
                            </button>
                            <button
                                onClick={handleBookmark}
                                title="Save to Wishlist"
                                className="p-2 rounded-full transition duration-300"
                            >
                                <FaHeart
                                    className={`text-[24px] font-bold transition-colors duration-300 ${bookmarked ? "text-red-600" : "text-gray-400 hover:text-red-600"
                                        }`}
                                />
                            </button>
                        </div>

                        {/* Book Info */}

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
                        <p className="text-lg font-medium text-gray-700">{book.title}</p>
                        <p className="text-sm text-indigo-900 truncate italic">by: {book.author || "Unknown Author"}</p>
                        <p className="text-sm text-gray-500">
                            {book.city}, {book.state}
                        </p>
                        <p className="text-xs text-gray-400">
                            Posted on {new Date(book.createdAt).toLocaleDateString()}
                        </p>
                    </div>


                    <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200">
                        {/* Profile Info */}
                        <div className="flex items-center gap-4 mb-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-yellow-400 shadow-md">
                                {book.user?.profilePic ? (
                                    <img
                                        src={book.user.profilePic}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="bg-yellow-400 w-full h-full flex items-center justify-center text-white text-xl">
                                        <FaUserCircle className="text-2xl" />
                                    </div>
                                )}
                            </div>

                            <div>
                                <p className="font-semibold text-gray-900">
                                    Posted by {(book.user.name || "Unknown").toUpperCase()}
                                </p>
                                <span className="text-sm text-gray-600">
                                    member since{" "}
                                    {book.user?.createdAt
                                        ? new Date(book.user.createdAt).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: ("short").toLowerCase(),
                                        })
                                        : "N/A"}
                                </span>

                            </div>
                        </div>

                        {/* Actions Based on Ownership */}
                        {user && book.user._id === user.id ? (
                            // Owner Actions
                            <div className="mt-4 flex flex-col gap-2">
                                <div className="flex gap-3">
                                    <Link to={`/edit/${id}`} className="w-1/2">
                                        <button className="w-full border border-blue-500 text-blue-500 py-2 rounded hover:bg-blue-50 transition">
                                            Edit
                                        </button>
                                    </Link>
                                    <button
                                        onClick={handleDelete}
                                        className="w-1/2 border border-red-500 text-red-500 py-2 rounded hover:bg-red-50 transition"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Non-owner Action: WhatsApp Chat
                            <button
                                onClick={handlewpShare}
                                className="mt-4 w-full flex items-center justify-center gap-2 bg-green-500 text-white py-2 px-4 rounded-lg shadow hover:bg-green-600 transition duration-300 ease-in-out"
                            >
                                <FaWhatsapp className="text-xl" />
                                <span className="font-medium">Chat with Seller</span>
                            </button>
                        )}
                    </div>



                    <div className="bg-white p-5 rounded-xl shadow border border-gray-200 space-y-3">
                        <h3 className="text-lg font-bold text-gray-800"> Posted Location</h3>

                        <p className="text-sm text-gray-600">
                            {book.city}, {book.state}, {book.pincode}
                        </p>

                        <div className="overflow-hidden rounded-sm border border-gray-300">
                            <iframe
                                src={`https://www.google.com/maps?q=${book.city || 'Pune'}+${book.pincode || '411001'}&z=15&output=embed`}
                                frameBorder="0"
                                width="100%"
                                height="200"
                                className="w-full rounded"
                                allowFullScreen
                                loading="lazy"
                                title="Location map"
                            ></iframe>
                        </div>
                    </div>

                </div>
            </div>
            {/* ⭐ Recommended Books Section */}
            <div className="mt-12 max-w-7xl mx-auto px-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">
                    📚 Recommended Books
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {recommendedBooks.map((recBook) => (
                        <Link to={`/book/${recBook._id}`} key={recBook._id}>
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden relative flex flex-col p-3 hover:scale-[1.03] hover:border-indigo-300">

                                {/* Image */}
                                <div className="w-full h-44 bg-gray-100 rounded-md overflow-hidden">
                                    <img
                                        src={recBook.images[0]}
                                        alt={recBook.title}
                                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex flex-col justify-between mt-3 px-2 flex-grow text-sm text-gray-700 space-y-2">

                                    <div className="flex items-center justify-between">
                                        {recBook.category?.toLowerCase() === "donate" ? (
                                            <h2 className="text-base font-extrabold text-green-700">
                                                ₹ 00
                                            </h2>
                                        ) : (
                                            <h2 className="text-base font-semibold text-indigo-800">
                                                ₹ {recBook.price}
                                            </h2>
                                        )}

                                        {recBook.category?.toLowerCase() === "donate" && (
                                            <span className="bg-gradient-to-r from-green-400 to-blue-500 text-white text-[11px] md:text-xs px-3 py-1 rounded-full font-semibold shadow-sm">
                                                For Donate
                                            </span>
                                        )}
                                    </div>

                                    <p className="font-semibold text-gray-800 truncate">{recBook.title}</p>
                                    <p className="italic font-medium text-purple-700 truncate">by {recBook.author || "Unknown"}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default BookDetails;


