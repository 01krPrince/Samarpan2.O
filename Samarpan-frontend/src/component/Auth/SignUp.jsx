import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaUserPlus,
  FaPhone,
  FaList,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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
}) => (
  <div className="mb-3 relative">
    <label className="block text-gray-700 font-medium mb-1">
      {label} <span className="text-red-500">*</span>
    </label>
    <div className="flex items-center border rounded-md p-2 mt-1 bg-gray-50 focus-within:ring-2 focus-within:ring-red-200 transition">
      <span className="text-gray-400 mr-2">{icon}</span>
      <input
        type={isPassword ? (showPassword ? "text" : "password") : type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={`Enter ${label.toLowerCase()}`}
        className="w-full outline-none bg-transparent text-gray-900 placeholder-gray-400"
        required
        autoComplete={autoComplete}
        spellCheck="false"
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

const SignUp = ({ onClose }) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [selectedBatchName, setSelectedBatchName] = useState("");
  const [branches, setBranches] = useState([]);
  const [batches, setBatches] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch(
          "https://samarpan2-o.onrender.com/api/v1/branch/getAllBranches",
          { headers: { accept: "*/*" } }
        );
        if (!response.ok) throw new Error("Failed to fetch branches");
        const data = await response.json();
        setBranches(data);
      } catch (err) {
        console.error("Error fetching branches:", err);
        setError("Failed to load branches");
      }
    };
    fetchBranches();
  }, []);

  useEffect(() => {
    if (!selectedBranchId) {
      setBatches([]);
      setSelectedBatchId("");
      setSelectedBatchName("");
      return;
    }
    const fetchBatches = async () => {
      try {
        const response = await fetch(
          `https://samarpan2-o.onrender.com/api/v1/Batch/findAllByBranchId?branchId=${selectedBranchId}`,
          { headers: { accept: "*/*" } }
        );
        if (!response.ok) throw new Error("Failed to fetch batches");
        const data = await response.json();
        setBatches(data);
        setSelectedBatchId("");
        setSelectedBatchName("");
      } catch (err) {
        console.error("Error fetching batches:", err);
        setError("Failed to load batches");
      }
    };
    fetchBatches();
  }, [selectedBranchId]);

  const autoLogin = async (email, pass) => {
    try {
      const response = await fetch("https://samarpan2-o.onrender.com/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password: pass }),
      });
      const text = await response.text();
      let data = {};
      try {
        data = JSON.parse(text);
      } catch {}

      if (response.ok) {
        const role = data.user.roles ? data.user.roles[0] : data.user.role;
        if (!role) throw new Error("Role not found");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("userRole", role.toUpperCase());
        navigate(role.toUpperCase() === "ADMIN" ? "/landingpage" : "/dashboard");
      } else {
        setError(data.message || "Auto-login failed.");
      }
    } catch (err) {
      setError(err.message || "Auto-login failed.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }
    if (!selectedBranchId || !selectedBatchId || !selectedBatchName) {
      setError("Please select both a branch and a batch.");
      setLoading(false);
      return;
    }

    const formData = {
      name,
      email: username,
      contact,
      batch: {
        id: selectedBatchId,
        batchName: selectedBatchName,
        branchId: selectedBranchId,
      },
      password,
      language: "EN",
    };

    try {
      const response = await fetch("https://samarpan2-o.onrender.com/api/auth/signup/student", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseText = await response.text();

      if (response.ok && responseText.includes("User registered successfully")) {
        setSuccessMessage("User registered successfully! Logging you in...");
        await autoLogin(username, password);
      } else if (!response.ok && responseText.includes("already in use")) {
        setError("Email is already in use. Please try logging in.");
      } else {
        setError("Registration failed. Try again.");
      }
    } catch (err) {
      setError("Failed to sign up. Check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6">Sign Up</h2>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}
      {successMessage && <p className="text-green-600 text-center mb-4">{successMessage}</p>}

      <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <InputField
          icon={<FaUser />}
          label="Full Name"
          value={name}
          setValue={setName}
          autoComplete="name"
        />
        <InputField
          icon={<FaEnvelope />}
          label="Email"
          type="email"
          value={username}
          setValue={setUsername}
          autoComplete="email"
        />
        <InputField
          icon={<FaPhone />}
          label="Contact Number"
          value={contact}
          setValue={setContact}
          autoComplete="tel"
        />
        <InputField
          icon={<FaLock />}
          label="Password"
          isPassword
          showPassword={showPassword}
          toggleShowPassword={() => setShowPassword((prev) => !prev)}
          value={password}
          setValue={setPassword}
          autoComplete="new-password"
        />
        <InputField
          icon={<FaLock />}
          label="Confirm Password"
          isPassword
          showPassword={showConfirmPassword}
          toggleShowPassword={() => setShowConfirmPassword((prev) => !prev)}
          value={confirmPassword}
          setValue={setConfirmPassword}
          autoComplete="new-password"
        />
        <div className="flex flex-col mb-3">
          <label htmlFor="branch-select" className="block text-gray-700 font-medium mb-1">
            Branch <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center border rounded-md p-2 bg-gray-50">
            <FaList className="text-gray-500 mr-2 mt-1" />
            <select
              id="branch-select"
              className="w-full outline-none bg-transparent"
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              required
            >
              <option value="">-- Select Branch --</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.branchName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-col mb-3">
          <label htmlFor="batch-select" className="block text-gray-700 font-medium mb-1">
            Batch <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center border rounded-md p-2 bg-gray-50">
            <FaList className="text-gray-500 mr-2 mt-1" />
            <select
              id="batch-select"
              className="w-full outline-none bg-transparent"
              value={selectedBatchId}
              onChange={(e) => {
                const selectedBatch = batches.find((b) => b.id === e.target.value);
                setSelectedBatchId(e.target.value);
                setSelectedBatchName(selectedBatch?.batchName || "");
              }}
              required
              disabled={branches.length === 0 || !selectedBranchId}
            >
              <option value="">-- Select Batch --</option>
              {batches.map((batch) => (
                <option key={batch.id} value={batch.id}>
                  {batch.batchName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="md:col-span-2 mt-6">
          <button
            type="submit"
            className={`w-full bg-gray-900 text-white py-3 rounded-lg flex justify-center items-center text-xl font-semibold transition hover:bg-gray-800 ${
              loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"
            }`}
            disabled={loading}
          >
            {loading ? (
              "Signing Up..."
            ) : (
              <>
                <FaUserPlus className="mr-3" /> Sign Up
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center text-gray-600 text-sm">
        Already have an account?{" "}
        <button
          className="text-red-600 hover:underline font-semibold"
          onClick={() => onClose()}
          type="button"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default SignUp;
