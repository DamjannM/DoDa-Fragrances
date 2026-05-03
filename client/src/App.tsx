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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        setIsLogedIn(false);
      } else {
        console.log("Logout failed on server");
      }
    } catch (err) {
      console.log("Logout error", err);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          console.log(data);
          setIsLogedIn(true);
          setRole(data.role);
        } else {
          setIsLogedIn(false);
        }
      } catch (err) {
        console.log("Auth check failed", err);
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
