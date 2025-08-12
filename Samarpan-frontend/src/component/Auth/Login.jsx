import React, { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaLock,
  FaSignInAlt,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const InputField = ({
  icon,
  label,
  value,
  setValue,
  type = "text",
  autoComplete = "",
  isPassword = false,
  showPassword,
  toggleShowPassword,
  placeholder = "",
}) => (
  <div className="mb-4 relative">
    <label className="block text-gray-700 font-medium mb-1">
      {label} <span className="text-red-500">*</span>
    </label>
    <div className="flex items-center border rounded-md p-2 mt-1 bg-gray-50 focus-within:ring-2 focus-within:ring-red-200 transition">
      <span className="text-gray-400 mr-2">{icon}</span>
      <input
        type={isPassword ? (showPassword ? "text" : "password") : type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full outline-none bg-transparent text-gray-900 ml-1 placeholder-gray-400"
        required
        autoComplete={autoComplete}
        spellCheck="false"
      />
      {isPassword && (
        <button
          type="button"
          onClick={toggleShowPassword}
          className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
          tabIndex={-1}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      )}
    </div>
  </div>
);

// LoginForm Component
export default function LoginForm({ setUserRole, openSignup }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    if (storedRole) {
      const targetPath = storedRole === "ADMIN" ? "/landingpage" : "/dashboard";
      if (location.pathname === "/" || location.pathname === "/login") {
        navigate(targetPath, { replace: true });
      }
    }
  }, [navigate, location.pathname]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://samarpan2-o.onrender.com/api/auth/signin",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Unexpected response from server: ${text}`);
      }

      if (response.ok) {
        const role = data.user.roles
          ? data.user.roles[0]
          : data.user.role;
        if (!role) throw new Error("Role not found in response");

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("userRole", role.toUpperCase());

        setUserRole(role.toUpperCase());

        const targetPath =
          role.toUpperCase() === "ADMIN" ? "/landingpage" : "/dashboard";

        if (location.pathname !== targetPath) {
          navigate(targetPath, { replace: true });
        }
      } else {
        setError(data.message || "Invalid username or password");
      }
    } catch (error) {
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-1">
        Sign In
      </h2>

      {error && (
        <p className="text-red-500 text-center mb-4 font-medium">{error}</p>
      )}

      <form
        onSubmit={handleLoginSubmit}
        autoComplete="on"
        className="space-y-4"
        noValidate
      >
        <InputField
          icon={<FaEnvelope />}
          label="Email"
          type="email"
          value={username}
          setValue={setUsername}
          autoComplete="username"
          placeholder="cagers01@gmail.com"
        />
        <InputField
          icon={<FaLock />}
          label="Password"
          isPassword={true}
          showPassword={showPassword}
          toggleShowPassword={() => setShowPassword(!showPassword)}
          value={password}
          setValue={setPassword}
          autoComplete="current-password"
          placeholder="********"
        />
        <button
          type="submit"
          className={`w-full bg-gray-900 text-white py-2 rounded-md flex justify-center items-center text-lg font-semibold shadow transition hover:bg-gray-800 ${
            loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"
          }`}
          disabled={loading}
        >
          {loading ? (
            "Logging in..."
          ) : (
            <>
              <FaSignInAlt className="mr-2" /> Login
            </>
          )}
        </button>
      </form>

      <button
        onClick={openSignup}
        type="button"
        className="mt-6 w-full text-red-600 hover:underline text-sm flex justify-center items-center cursor-pointer"
        disabled={loading}
      >
        Don't have an account? Sign Up
      </button>
    </div>
  );
}
