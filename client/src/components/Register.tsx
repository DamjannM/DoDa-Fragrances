import type { FormEvent } from "react";
import { useState } from "react";
import { CiLock, CiMail } from "react-icons/ci";

type UserData = {
  email: string;
  password: string;
};

interface ChildProps {
  setIsRegistered: React.Dispatch<React.SetStateAction<boolean>>;
}

const Register: React.FC<ChildProps> = ({ setIsRegistered }) => {
  const [user, setUser] = useState<UserData>({ email: "", password: "" });
  const [serverMessage, setServerMessage] = useState("");
  const handleRegister = () => {
    setIsRegistered(true);
  };

  const signUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user.email.includes("@") || !user.email.includes("."))
      return setServerMessage("❌ Invalid email format");
    if (user.password.length < 8)
      return setServerMessage("❌ Password must contain atleast 8 characters");
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          password: user.password,
        }),
      },
    );

    const data = await response.json();
    if (!response.ok) {
      setServerMessage(`❌ ${data.message}`);
      throw new Error(`Server error: ${response.status}`);
    }

    // if (data.token) {
    //   token = data.token;
    //   // sessionStorage.setItem("token", token);
    // } else {
    //   throw Error("❌ Failed to authenticate...");
    // }
    handleRegister();
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bgimage">
      <div className="shadow-xl shadow-gray-300 min-w-69  min-h-8/12 border max-w-96 border-gray-100 rounded-2xl bg-secondary backdrop-blur-md p-1! text-gray-800/90 text-xl m-3!">
        <form
          onSubmit={signUp}
          className="flex flex-col items-center gap-3 w-full justify-start p-3!"
        >
          <h1 className="text-2xl font-bold">Register</h1>
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
              value={user.email}
              onChange={(e) => {
                setUser({ ...user, email: e.target.value });
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
              value={user.password}
              onChange={(e) => {
                setUser({ ...user, password: e.target.value });
              }}
            />
          </div>
          <button
            type="submit"
            className=" bg-linear-to-r from-primary to-purple-400 items-center rounded-2xl w-full text-xs py-2! text-white mt-2!"
          >
            Register
          </button>
        </form>
        <div className="gap-2 flex text-xs justify-center">
          <p>Already have an account?</p>
          <a
            href="#"
            className="text-xs text-purple-600"
            onClick={(e) => {
              e.preventDefault();
              handleRegister();
            }}
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;
