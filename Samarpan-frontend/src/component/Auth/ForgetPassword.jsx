import React, { useState, useEffect } from "react";
import {
  FaShieldAlt,
  FaLock,
  FaEnvelope,
  FaPhone,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import codingAgeLogo from "../../assets/codingAge.png";

const InputField = ({
  icon,
  label,
  value,
  setValue,
  type = "text",
  autoComplete = "",
  disabled = false,
  isPassword = false,
  showPassword,
  toggleShowPassword,
}) => (
  <div className="mb-4 relative">
    <label className="block text-gray-700 font-medium mb-1">
      {label} <span className="text-red-500">*</span>
    </label>
    <div className="flex items-center border border-gray-300 rounded-md p-2 bg-gray-50 focus-within:ring-2 focus-within:ring-red-500 transition">
      <span className="text-gray-400 mr-2">{icon}</span>
      <input
        type={isPassword ? (showPassword ? "text" : "password") : type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={`Enter ${label.toLowerCase()}`}
        className="w-full outline-none bg-transparent text-gray-900 placeholder-gray-400"
        required
        autoComplete={autoComplete}
        disabled={disabled}
        aria-label={label}
      />
      {isPassword && (
        <button
          type="button"
          onClick={toggleShowPassword}
          className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          tabIndex={-1}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      )}
    </div>
  </div>
);

const FEATURES = [
  "Project-based, hands-on learning",
  "Top faculty & industry experts",
  "Career guidance and certification",
  "Modern courses (Java, Spring Boot, React, Vue, Python, and more)",
];

const ForgetPassword = ({ setView }) => {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpGenerated, setOtpGenerated] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [visibleIndexes, setVisibleIndexes] = useState([]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    let i = 0;
    setVisibleIndexes([]);
    const interval = setInterval(() => {
      setVisibleIndexes((prev) => [...prev, i]);
      i++;
      if (i >= FEATURES.length) clearInterval(interval);
    }, 180);
    return () => clearInterval(interval);
  }, []);

  const isValidEmail = (email) => {
    return /^\S+@\S+\.\S+$/.test(email);
  };

  const handleSendOtp = async () => {
    setSendingOtp(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "https://samarpan2-o.onrender.com/api/auth/send-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        setOtpGenerated(true);
        setSuccess("OTP sent to your email. Please check.");
      } else {
        setError(data.message || "Failed to send OTP.");
      }
    } catch (err) {
      setError("An error occurred while sending OTP. Please try again.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    if (!otpGenerated || !otp.trim()) {
      setError("Please enter the OTP sent to your email.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://samarpan2-o.onrender.com/api/auth/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, phoneNumber, newPassword, otp }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess("Password reset successful. You can now login.");
        setEmail("");
        setPhoneNumber("");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
        setOtpGenerated(false);
      } else {
        setError(data.message || "Failed to reset password.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const bgStyle = {
    minHeight: "100vh",
    width: "100vw",
    background: `
      linear-gradient(rgba(243,244,246,0.98), rgba(243,244,246,0.98)),
      url(${codingAgeLogo})
    `,
    backgroundRepeat: "repeat",
    backgroundSize: "120px auto",
    backgroundPosition: "center center",
    display: "flex",
  };

  return (
    <div style={bgStyle} className="flex flex-col md:flex-row">
      {/* Left panel: only logo and heading */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-center items-center px-10 py-12 text-gray-800 text-left max-h-screen">
        <img
          src={codingAgeLogo}
          alt="Coding Age Logo"
          className="h-20 mb-4 opacity-90 drop-shadow-md"
        />
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-wide text-center">
          Coding Age
        </h1>
      </div>

      {/* Right panel: Reset Password Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-10 overflow-y-auto max-h-screen">
        <div className="bg-white rounded-xl shadow-md w-full max-w-md border-l-4 border-red-500 p-6 md:p-8">
          <div className="flex justify-center mb-4">
            <FaShieldAlt className="text-4xl text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
            Reset Password
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Enter your details to reset your password
          </p>

          {error && (
            <p className="text-red-600 text-center mb-4 font-medium">{error}</p>
          )}
          {success && (
            <p className="text-green-600 text-center mb-4 font-medium">{success}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 w-full">
            <InputField
              icon={<FaEnvelope />}
              label="Email"
              type="email"
              value={email}
              setValue={setEmail}
              autoComplete="email"
              disabled={loading}
            />

            {isValidEmail(email) && !otpGenerated && (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={sendingOtp || loading}
                className={`w-full bg-red-600 text-white py-2 rounded-md text-lg font-semibold shadow transition hover:bg-red-700 ${
                  sendingOtp || loading
                    ? "cursor-not-allowed opacity-70"
                    : "cursor-pointer"
                }`}
              >
                {sendingOtp ? "Sending OTP..." : "Generate OTP"}
              </button>
            )}

            {otpGenerated && (
              <InputField
                icon={<FaLock />}
                label="OTP"
                type="text"
                value={otp}
                setValue={setOtp}
                autoComplete="one-time-code"
                disabled={loading}
              />
            )}

            <InputField
              icon={<FaPhone />}
              label="Phone Number"
              type="tel"
              value={phoneNumber}
              setValue={setPhoneNumber}
              autoComplete="tel"
              disabled={loading}
            />

            <InputField
              icon={<FaLock />}
              label="New Password"
              type="password"
              value={newPassword}
              setValue={setNewPassword}
              autoComplete="new-password"
              disabled={loading}
              isPassword={true}
              showPassword={showPassword}
              toggleShowPassword={() => setShowPassword(!showPassword)}
            />

            <InputField
              icon={<FaLock />}
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              setValue={setConfirmPassword}
              autoComplete="new-password"
              disabled={loading}
              isPassword={true}
              showPassword={showConfirmPassword}
              toggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
            />

            <button
              type="submit"
              disabled={
                loading ||
                !otpGenerated ||
                !otp.trim() ||
                !newPassword ||
                newPassword !== confirmPassword
              }
              className={`w-full bg-gray-900 text-white py-2 rounded-md flex justify-center items-center text-lg font-semibold shadow transition hover:bg-gray-800 ${
                loading ||
                !otpGenerated ||
                !otp.trim() ||
                !newPassword ||
                newPassword !== confirmPassword
                  ? "cursor-not-allowed opacity-70"
                  : "cursor-pointer"
              }`}
            >
              {loading ? "Resetting..." : "Set Password"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setView("login")}
              className="text-red-600 hover:text-red-700 font-semibold focus:outline-none transition"
              type="button"
              disabled={loading}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
