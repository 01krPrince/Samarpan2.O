import { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaSignInAlt, FaUserPlus, FaPhone } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await fetch("http://localhost:8080/api/auth/signup/student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instituteName: "codingage",
          email: username,
          contact: contact,
          password: password,
          language: "EN",
        }),
      });
  
      const contentType = response.headers.get("content-type");
  
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json(); // ✅ Handle JSON response
      } else {
        data = await response.text(); // ✅ Handle plain text response
      }
  
      if (response.ok) {
        alert("Sign up successful! Redirecting to login...");
        navigate("/");
      } else {
        setError(data.message || data || "Failed to sign up");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <div className="flex justify-center mb-4">
          <FaUserPlus className="text-4xl text-gray-700" />
        </div>
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        <p className="text-center text-gray-600 mb-4">Create a new account</p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Full Name</label>
            <div className="flex items-center border rounded-md p-2 mt-1">
              <FaUser className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="John Doe"
                className="w-full outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <div className="flex items-center border rounded-md p-2 mt-1">
              <FaEnvelope className="text-gray-500 mr-2" />
              <input
                type="email"
                placeholder="admin@example.com"
                className="w-full outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Contact Number</label>
            <div className="flex items-center border rounded-md p-2 mt-1">
              <FaPhone className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="1234567890"
                className="w-full outline-none"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
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

          <div className="mb-4">
            <label className="block text-gray-700">Confirm Password</label>
            <div className="flex items-center border rounded-md p-2 mt-1">
              <FaLock className="text-gray-500 mr-2" />
              <input
                type="password"
                placeholder="********"
                className="w-full outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-2 rounded-md flex justify-center items-center text-lg font-medium cursor-pointer"
            disabled={loading}
          >
            {loading ? "Signing Up..." : <><FaUserPlus className="mr-2" /> Sign Up</>}
          </button>
        </form>

        <button 
          onClick={() => navigate('/')} 
          className="mt-2 w-full border border-gray-900 text-gray-900 py-2 rounded-md flex justify-center items-center text-sm font-medium cursor-pointer hover:bg-gray-900 hover:text-white transition"
        >
          <FaSignInAlt className="mr-2" /> Already have an account? Login
        </button>
      </div>
    </div>
  );
};

export default SignUp;
