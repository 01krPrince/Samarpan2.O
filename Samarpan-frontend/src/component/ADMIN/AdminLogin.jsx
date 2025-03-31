import { useState } from "react";
import { FaGoogle, FaShieldAlt, FaLock, FaEnvelope, FaSignInAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setIsLoggedIn(true);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <div className="flex justify-center mb-4">
          <FaShieldAlt className="text-4xl text-gray-700" />
        </div>
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <p className="text-center text-gray-600 mb-4">Please login to continue</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <div className="flex items-center border rounded-md p-2 mt-1">
              <FaEnvelope className="text-gray-500 mr-2" />
              <input
                type="email"
                placeholder="admin@example.com"
                className="w-full outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

          <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Remember me
            </label>
            <a href="#" className="text-blue-700">Forgot password?</a>
          </div>

          <button 
            type="submit"
            className="w-full bg-gray-900 text-white py-2 rounded-md flex justify-center items-center text-lg font-medium cursor-pointer"
            disabled={loading}
          >
            {loading ? "Logging in..." : <><FaSignInAlt className="mr-2" /> Login</>}
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

          <button 
            onClick={() => navigate('/signup')}
            className="mt-2 w-full border border-gray-900 text-gray-900 py-2 rounded-md flex justify-center items-center text-sm font-medium cursor-pointer hover:bg-gray-900 hover:text-white transition"
          >
           Don't have an account? Sign Up
          </button>
      </div>
    </div>
  );
};

export default AdminLogin;
