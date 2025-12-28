// src/pages/AuthSuccess.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthSuccess = ({ setIsLoggedIn, setUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("token");

    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userInfo = {
        name: payload.name,
        email: payload.email,
        profilePic: payload.profilePic, // ✅ this matches your JWT
        id: payload.sub || payload.id,
      };

      // Save login info
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userInfo));
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("loginTime", Date.now().toString());

      setUser(userInfo);
      setIsLoggedIn(true);

      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [navigate, setIsLoggedIn, setUser]);

  return <p>Logging you in...</p>;
};

export default AuthSuccess;
