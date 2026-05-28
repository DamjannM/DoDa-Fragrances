// import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useState } from "react";
import { CiMail, CiLock } from "react-icons/ci";

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

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.includes("@") || !email.includes("."))
      return setServerMessage("❌ Invalid email format");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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

      localStorage.setItem("token", data.token);
      setIsLogedIn(true);
      setRole(data.role);
    } catch (err) {
      console.log("Login failed", err);
    }
  };
  return (
    <div className="flex flex-col flex-1 items-center justify-center bgimage">
      <div className="shadow-xl shadow-gray-300 min-w-69 min-h-8/12 border max-w-96 border-gray-100 rounded-2xl bg-secondary backdrop-blur-md p-1! text-gray-800/90 text-xl m-3!">
        <form
          onSubmit={handleLogin}
          className="flex flex-col items-center gap-3 w-full justify-start p-3!"
        >
          <h1 className="text-2xl font-bold">Login</h1>
          <p>{serverMessage}</p>
          <label className="flex justify-start w-full font-semibold text-sm">
            Email
          </label>
          <div className="flex border-stone-200 border rounded-2xl py-2! p-1! items-center justify-start w-full bg-white gap-2">
            <CiMail />
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="outline-none p-1! text-xs"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <label className="w-full justify-start font-semibold text-sm">
            Password
          </label>
          <div className="flex border-stone-200 border rounded-2xl py-2! p-1! items-center justify-start w-full bg-white gap-2">
            <CiLock className="text-stone-500" />
            <input
              type="password"
              placeholder="Enter your password"
              required
              className="outline-none p-1! text-xs"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div className="gap-10 flex items-center align-middle">
            <label className="flex gap-2">
              <input
                type="checkbox"
                className=""
                onChange={() => setRememberMe(!rememberMe)}
              />
              <p className="text-xs">Remember me</p>
            </label>
            <a
              href="#"
              className="text-xs text-purple-600"
              onClick={(e) => e.preventDefault()}
            >
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className=" bg-linear-to-r from-primary to-purple-400 items-center rounded-2xl w-full text-xs py-2! text-white mt-5!"
          >
            Log in
          </button>
        </form>
        <div className="gap-2 flex text-xs justify-center">
          <p>Don't have an account?</p>
          <a
            href="#"
            className="text-xs text-purple-600"
            onClick={(e) => {
              e.preventDefault();
              handleRegister();
            }}
          >
            Register
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
