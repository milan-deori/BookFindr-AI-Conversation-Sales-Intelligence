import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Sell from './pages/Sell';
import BookDetails from './pages/BookDetails';
import Wishlist from './pages/Wishlist';
import EditPost from './pages/EditPost';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import StudyPage from "./pages/catagories/StudyPage";
import Fiction from "./pages/catagories/Fiction";
import BioPage from "./pages/catagories/BioPage";
import Regional from "./pages/catagories/Regional";
import Competitive from "./pages/catagories/Competitive";
import EBook from "./pages/catagories/EBook";
import NotePage from "./pages/catagories/NotePage";
import OthersPage from "./pages/catagories/OthersPage";
import AuthSuccess from "./pages/AuthSuccess";
import SearchResults from "./components/SearchResults"
import Donate from "./pages/catagories/Donate";




function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);




  // Check login status and user data on initial load

  useEffect(() => {
    const status = localStorage.getItem("isLoggedIn");
    const storedUser = localStorage.getItem("user");
    const loginTime = localStorage.getItem("loginTime");

    const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    if (status === "true" && storedUser && loginTime) {
      const elapsed = Date.now() - parseInt(loginTime);
      if (elapsed < oneDay) {
        setIsLoggedIn(true);
        setUser(JSON.parse(storedUser));
      } else {
        //  Session expired: clear and redirect or logout
        localStorage.clear(); // or remove specific keys only
        setIsLoggedIn(false);
        setUser(null);
      }
    }
  }, []);


  //  Load wishlist from localStorage
  useEffect(() => {
    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  }, []);

  // Save wishlist to localStorage on any change
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  return (
    <BrowserRouter>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} user={user} setUser={setUser} />
     
      <Routes>
        <Route path="/" element={<Home setWishlist={setWishlist} user={user} />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth-success" element={<AuthSuccess setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
        <Route path="/sell" element={isLoggedIn ? <Sell user={user} /> : <Navigate to="/login" />} />
        <Route path="/book/:id" element={<BookDetails user={user} isLoggedIn={isLoggedIn} setWishlist={setWishlist} />} />
        <Route path="/edit/:id" element={<EditPost user={user} />} />
        <Route path="/wishlist" element={<Wishlist user={user} />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard user={user} /> : <Navigate to="/login" />} />
        <Route path="/search-results" element={<SearchResults setWishlist={setWishlist} user={user} />} />
        {/* Category Routes */}
        <Route path="/books/study" element={<StudyPage setWishlist={setWishlist} user={user} />} />
        <Route path="/books/fiction" element={<Fiction setWishlist={setWishlist} user={user} />} />
        <Route path="/books/biography" element={<BioPage setWishlist={setWishlist} user={user} />} />
        <Route path="/books/regional" element={<Regional setWishlist={setWishlist} user={user} />} />
        <Route path="/books/competitive" element={<Competitive setWishlist={setWishlist} user={user} />} />
        <Route path="/books/ebook" element={<EBook setWishlist={setWishlist} user={user} />} />
        <Route path="/books/notes" element={<NotePage setWishlist={setWishlist} user={user} />} />
        <Route path="/books/others" element={<OthersPage setWishlist={setWishlist} user={user} />} />
        <Route path="/books/donate" element={<Donate setWishlist={setWishlist} user={user} />} />
        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;




