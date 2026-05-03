import type { FormEvent } from "react";
import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";

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
    <div className="flex flex-1 items-center justify-center">
      <div className="shadow-2xl shadow-stone-800 flex min-w-8/12 min-h-8/12 border-2 border-amber-50 rounded-2xl bg-amber-50/30 backdrop-blur-md p-1! text-stone-800/90 text-xl ">
        <form onSubmit={signUp} className="flex flex-col items-center gap-3">
          <h1 className="text-2xl font-bold">Register</h1>
          <p>{serverMessage}</p>
          <div className="flex border-stone-400 border-2 rounded-2xl p-1! items-center ">
            <input
              type="email"
              placeholder="email"
              required
              className="outline-none"
              value={user.email}
              onChange={(e) => {
                setUser({ ...user, email: e.target.value });
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
              value={user.password}
              onChange={(e) => {
                setUser({ ...user, password: e.target.value });
              }}
            />
            <FaLock className="text-stone-500" />
          </div>
          {/* <div className="gap-10 flex items-center align-middle">
            <a href="#" className="font-bold underline">
              Forgot password?
            </a>
          </div> */}
          <button
            type="submit"
            className=" border-stone-800 border-2 rounded-2xl w-25 font-bold"
          >
            Register
          </button>
          <div className="gap-2 flex">
            <p>Already have an account?</p>
            <a
              href="#"
              className="font-bold underline"
              onClick={(e) => {
                e.preventDefault();
                handleRegister();
              }}
            >
              Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
