import React, { useState } from 'react';
import { FaShieldAlt, FaLock, FaEnvelope, FaPhone } from 'react-icons/fa';

const ForgetPassword = ({ setView }) => {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(
        'https://samarpan2-o.onrender.com/api/auth/reset-password',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, phoneNumber, newPassword }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess('Password reset successful. You can now login.');
        setEmail('');
        setPhoneNumber('');
        setNewPassword('');
      } else {
        setError(data.message || 'Failed to reset password.');
      }
    } catch (err) {
      console.error('Reset error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-sm">
      <div className="flex justify-center mb-4">
        <FaShieldAlt className="text-4xl text-indigo-600" />
      </div>
      <h2 className="text-2xl font-bold text-center text-gray-900">
        Reset Password
      </h2>
      <p className="text-center text-gray-500 mb-6">
        Enter your details to reset your password
      </p>

      {error && (
        <p className="text-red-600 text-center mb-4 font-medium">{error}</p>
      )}
      {success && (
        <p className="text-green-500 text-center mb-4 font-medium">{success}</p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <div className="flex items-center border border-gray-200 rounded-lg p-2">
            <FaEnvelope className="text-gray-500 mr-2" />
            <input
              type="email"
              placeholder="cagers@example.com"
              className="w-full outline-none focus:ring-2 focus:ring-indigo-600 text-gray-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              aria-label="Email address"
              autoComplete="email"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Phone Number
          </label>
          <div className="flex items-center border border-gray-200 rounded-lg p-2">
            <FaPhone className="text-gray-500 mr-2" />
            <input
              type="tel"
              placeholder="+91-234567890"
              className="w-full outline-none focus:ring-2 focus:ring-indigo-600 text-gray-900"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              disabled={loading}
              aria-label="Phone number"
              autoComplete="tel"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-1">
            New Password
          </label>
          <div className="flex items-center border border-gray-200 rounded-lg p-2">
            <FaLock className="text-gray-500 mr-2" />
            <input
              type="password"
              placeholder="********"
              className="w-full outline-none focus:ring-2 focus:ring-indigo-600 text-gray-900"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={loading}
              aria-label="New password"
              autoComplete="new-password"
            />
          </div>
        </div>

        <button
          type="submit"
          className={`w-full bg-indigo-600 text-white py-2 rounded-lg flex justify-center items-center text-lg font-medium transition duration-200 ${
            loading ? 'cursor-not-allowed opacity-70' : 'hover:bg-indigo-700'
          }`}
          disabled={loading}
        >
          {loading ? 'Resetting...' : 'Set Password'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => setView('login')}
          className={`text-indigo-600 hover:text-indigo-700 font-medium focus:outline-none transition duration-200 ${
            loading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
          }`}
          disabled={loading}
          aria-label="Back to login"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgetPassword;