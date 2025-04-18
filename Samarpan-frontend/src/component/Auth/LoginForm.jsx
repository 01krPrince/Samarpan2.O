// LoginForm.jsx
import React from "react";
import {
  FaGoogle,
  FaShieldAlt,
  FaLock,
  FaEnvelope,
  FaSignInAlt,
} from "react-icons/fa";

const LoginForm = ({
  username,
  setUsername,
  password,
  setPassword,
  handleSubmit,
  loading,
  error,
  setView,
  setError,
  navigate,
}) => {
  return (
    <>
      <div className="flex justify-center mb-4">
        <FaShieldAlt className="text-4xl text-gray-700" />
      </div>
      <h2 className="text-2xl font-bold text-center">Login</h2>
      <p className="text-center text-gray-600 mb-4">Please login to continue</p>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <div className="flex items-center border rounded-md p-2 mt-1">
            <FaEnvelope className="text-gray-500 mr-2" />
            <input
              type="email"
              placeholder="cagers@example.com"
              className="w-full outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <div className="flex items-center border rounded-md p-2 mt-1">
            <FaLock className="text-gray-500 mr-2" />
            <input
              type="password"
              placeholder="********"
              className="w-full outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gray-900 text-white py-2 rounded-md flex justify-center items-center text-lg font-medium cursor-pointer hover:bg-gray-800"
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

      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-300" />
        <span className="mx-2 text-gray-600">Or continue with</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      <button className="w-full border border-gray-400 py-2 rounded-md flex justify-center items-center text-lg font-extrabold text-gray-700">
        <FaGoogle className="mr-2 text-gray-600" /> Google
      </button>

      <div className="mt-4 text-center text-gray-600 text-sm flex justify-center items-center gap-2">
        <FaShieldAlt className="text-gray-500" />
        <span>This login is protected by reCAPTCHA</span>
      </div>

      <div className="mt-4 text-center">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setView("forget");
            setError("");
          }}
          className="text-gray-600 hover:underline"
        >
          Forgot Password?
        </a>
      </div>

      <button
        onClick={() => navigate("/signup")}
        className="mt-2 w-full border border-gray-900 text-gray-900 py-2 rounded-md flex justify-center items-center text-sm font-medium cursor-pointer hover:bg-gray-900 hover:text-white transition"
      >
        Don't have an account? Sign Up
      </button>
    </>
  );
};

export default LoginForm;
