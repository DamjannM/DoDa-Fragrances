// import { useEffect, useState } from "react";
import { useEffect, useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";

interface ChildProps {
  setIsRegistered: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLogedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setRole: React.Dispatch<React.SetStateAction<string>>;
}

const Login: React.FC<ChildProps> = ({
  setIsRegistered,
  setIsLogedIn,
  setRole,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [serverMessage, setServerMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleRegister = () => {
    setIsRegistered(false);
  };
  // const handleLogin = () => {
  //   setIsLogedIn(true);
  // };

  const handleLogin = async () => {
    if (!email.includes("@") && !email.includes("."))
      return setServerMessage("❌ Invalid email format");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email,
            password,
            rememberMe,
          }),
        },
      );
      const data = await response.json();
      setEmail("");
      setPassword("");

      if (!response.ok) {
        setServerMessage(`❌ ${data.message}`);
        throw new Error(`Server error: ${response.status}`);
      }

      setIsLogedIn(true);
      setRole(data.role);
    } catch (err) {
      console.log("Login failed", err);
    }
  };
  useEffect(() => {
    const handleEnterKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleLogin();
      }
    };

    window.addEventListener("keydown", handleEnterKeyDown);
    return () => window.removeEventListener("keydown", handleEnterKeyDown);
  });
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="shadow-2xl shadow-stone-800  min-w-8/12 min-h-8/12 border-2 border-amber-50 rounded-2xl bg-amber-50/30 backdrop-blur-md p-1! text-stone-800/90 text-xl">
        <form action="" className="flex flex-col items-center gap-3">
          <h1 className="text-2xl font-bold">Login</h1>
          <p>{serverMessage}</p>
          <div className="flex border-stone-400 border-2 rounded-2xl p-1! items-center ">
            <input
              type="text"
              placeholder="email"
              required
              className="outline-none"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <FaUser className="text-stone-500" />
          </div>
          <div className="flex border-stone-400 border-2 rounded-2xl p-1! items-center ">
            <input
              type="password"
              placeholder="password"
              required
              className="outline-none"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <FaLock className="text-stone-500" />
          </div>
          <div className="gap-10 flex items-center align-middle">
            <label>
              <input
                type="checkbox"
                className=""
                onChange={() => setRememberMe(!rememberMe)}
              />
              Remember me
            </label>
            <a href="#" className="font-bold underline">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className=" border-stone-800 border-2 rounded-2xl w-25 font-bold"
            onClick={handleLogin}
          >
            Login
          </button>
          <div className="gap-2 flex">
            <p>Don't have an account?</p>
            <a
              href="#"
              className="font-bold underline"
              onClick={handleRegister}
            >
              Register
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
