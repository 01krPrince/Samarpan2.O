import React from "react";
import { FaShieldAlt, FaLock, FaEnvelope, FaPhone, FaSignInAlt } from "react-icons/fa";

const ForgetPasswordForm = ({
  email,
  setEmail,
  phoneNumber,
  setPhoneNumber,
  newPassword,
  setNewPassword,
  handleSubmit,
  loading,
  error,
  setView,
}) => {
  return (
    <>
      <div className="flex justify-center mb-4">
        <FaShieldAlt className="text-4xl text-gray-700" />
      </div>
      <h2 className="text-2xl font-bold text-center">Reset Password</h2>
      <p className="text-center text-gray-600 mb-4">Enter your details to reset your password</p>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <div className="flex items-center border rounded-md p-2 mt-1">
            <FaEnvelope className="text-gray-500 mr-2" />
            <input
              type="email"
              placeholder="cagers@example.com"
              className="w-full outline-none focus:ring-2 focus:ring-gray-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Phone Number</label>
          <div className="flex items-center border rounded-md p-2 mt-1">
            <FaPhone className="text-gray-500 mr-2" />
            <input
              type="tel"
              placeholder="+91-234567890"
              className="w-full outline-none focus:ring-2 focus:ring-gray-900"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">New Password</label>
          <div className="flex items-center border rounded-md p-2 mt-1">
            <FaLock className="text-gray-500 mr-2" />
            <input
              type="password"
              placeholder="********"
              className="w-full outline-none focus:ring-2 focus:ring-gray-900"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </div>

        <button
          type="submit"
          className={`w-full bg-gray-900 text-white py-2 rounded-md flex justify-center items-center text-lg font-medium ${
            loading ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:bg-gray-800"
          }`}
          disabled={loading}
        >
          {loading ? "Resetting..." : (
            <>
              <FaSignInAlt className="mr-2" /> Set Password
            </>
          )}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => setView("login")}
          className="text-gray-600 hover:underline focus:outline-none cursor-pointer"
          disabled={loading}
        >
          Back to Login
        </button>
      </div>
    </>
  );
};

export default ForgetPasswordForm;