import { useEffect, useState } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import { Route, Routes } from "react-router-dom";
import PerfumeDetails from "./components/PerfumeDetails";

function App() {
  const [isRegistered, setIsRegistered] = useState(true);
  const [isLogedIn, setIsLogedIn] = useState(false);
  const [role, setRole] = useState("");

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch (err) {
      console.log("Logout error", err);
    }
    localStorage.removeItem("token");
    setIsLogedIn(false);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLogedIn(false);
        return;
      }
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          console.log(data);
          setIsLogedIn(true);
          setRole(data.role);
        } else {
          localStorage.removeItem("token");
          setIsLogedIn(false);
        }
      } catch (err) {
        console.log("Auth check failed", err);
        localStorage.removeItem("token");
        setIsLogedIn(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <Routes>
      <Route path="/:id" element={<PerfumeDetails />} />
      <Route
        path="/"
        element={
          <div className="min-h-screen background flex flex-col w-screen">
            {/* sm:min-w-full */}
            {isLogedIn ? (
              <Home onLogout={handleLogout} role={role} />
            ) : isRegistered ? (
              <Login
                setIsRegistered={setIsRegistered}
                setIsLogedIn={setIsLogedIn}
                setRole={setRole}
              />
            ) : (
              <Register setIsRegistered={setIsRegistered} />
            )}
          </div>
        }
      />
    </Routes>
  );
}

export default App;
