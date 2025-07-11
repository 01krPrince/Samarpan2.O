import { useState, useEffect } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaSignInAlt,
  FaUserPlus,
  FaPhone,
  FaList,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import codingAgeLogo from '../../assets/codingAge.png';

const SignUp = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [selectedBatchName, setSelectedBatchName] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [batches, setBatches] = useState([]);
  const [branches, setBranches] = useState([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
    if (selectedBranchId) {
      const fetchBatches = async () => {
        try {
          const response = await fetch(
            `https://samarpan2-o.onrender.com/api/v1/Batch/findAllByBranchId?branchId=${selectedBranchId}`,
            { headers: { accept: "*/*" } }
          );
          if (!response.ok) throw new Error("Failed to fetch batches");
          const data = await response.json();
          setBatches(data);
        } catch (err) {
          console.error("Error fetching batches:", err);
          setError("Failed to load batches");
        }
      };
      fetchBatches();
    }
  }, [selectedBranchId]);

  const handleNext = (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    setStep(2);
  };

  const autoLogin = async (email, password) => {
    try {
      const response = await fetch("https://samarpan2-o.onrender.com/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Unexpected response from server: ${text}`);
      }

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
      console.error("Auto-login error:", err);
      setError(err.message || "Auto-login failed.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    if (!selectedBatchId || !selectedBatchName || !selectedBranchId) {
      setError("Please select a branch and a batch.");
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
        console.log("Sign up success:", responseText);
        setSuccessMessage("User registered successfully! Logging you in...");
        await autoLogin(username, password);
      } else if (!response.ok && responseText.includes("already in use")) {
        setError("Email is already in use. Please try logging in.");
      } else {
        setError("Registration failed. Try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Failed to sign up. Check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      {step === 1 ? (
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <div className="flex justify-center mb-4">
            <img src={codingAgeLogo} className="h-16" alt="Coding Age" />
          </div>
          <h2 className="text-2xl font-bold text-center">Sign Up</h2>
          <p className="text-center text-gray-600 mb-4">Create a new account</p>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
          <form onSubmit={handleNext}>
            <InputField icon={<FaUser />} label="Full Name" value={name} setValue={setName} />
            <InputField icon={<FaEnvelope />} label="Email" type="email" value={username} setValue={setUsername} />
            <InputField icon={<FaPhone />} label="Contact Number" value={contact} setValue={setContact} />
            <InputField icon={<FaLock />} label="Password" type="password" value={password} setValue={setPassword} autoComplete="new-password" />
            <InputField icon={<FaLock />} label="Confirm Password" type="password" value={confirmPassword} setValue={setConfirmPassword} autoComplete="new-password" />
            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-2 rounded-md flex justify-center items-center text-lg font-medium cursor-pointer"
              disabled={loading}
            >
              {loading ? "Processing..." : "Next"}
            </button>
          </form>
          <button
            onClick={() => navigate("/")}
            className="mt-2 w-full border border-gray-900 text-gray-900 py-2 rounded-md flex justify-center items-center text-sm font-medium cursor-pointer hover:bg-gray-900 hover:text-white transition"
          >
            <FaSignInAlt className="mr-2" /> Already have an account? Login
          </button>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <div className="flex justify-center mb-4">
            <FaList className="text-4xl text-gray-700" />
          </div>
          <h2 className="text-2xl font-bold text-center">Select Branch & Batch</h2>
          <p className="text-center text-gray-600 mb-4">Choose your branch and batch</p>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Branch</label>
              <div className="flex items-center border rounded-md p-2 mt-1">
                <FaList className="text-gray-500 mr-2" />
                <select
                  value={selectedBranchId}
                  onChange={(e) => setSelectedBranchId(e.target.value)}
                  className="w-full outline-none"
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
            {selectedBranchId && (
              <div className="mb-4">
                <label className="block text-gray-700">Batch</label>
                <div className="flex items-center border rounded-md p-2 mt-1">
                  <FaList className="text-gray-500 mr-2" />
                  <select
                    value={selectedBatchId}
                    onChange={(e) => {
                      const selectedBatch = batches.find((b) => b.id === e.target.value);
                      setSelectedBatchId(e.target.value);
                      setSelectedBatchName(selectedBatch?.batchName);
                    }}
                    className="w-full outline-none"
                    required
                  >
                    <option value="">-- Select Batch --</option>
                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.batchName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-2 rounded-md flex justify-center items-center text-lg font-medium cursor-pointer"
              disabled={loading}
            >
              {loading ? "Signing Up..." : <><FaUserPlus className="mr-2" /> Sign Up</>}
            </button>
          </form>
          <button
            onClick={() => setStep(1)}
            className="mt-2 w-full border border-gray-900 text-gray-900 py-2 rounded-md flex justify-center items-center text-sm font-medium cursor-pointer hover:bg-gray-900 hover:text-white transition"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
};

const InputField = ({ icon, label, value, setValue, type = "text", ...props }) => (
  <div className="mb-4">
    <label className="block text-gray-700">{label}</label>
    <div className="flex items-center border rounded-md p-2 mt-1">
      <span className="text-gray-500 mr-2">{icon}</span>
      <input
        type={type}
        placeholder={label}
        className="w-full outline-none"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
        {...props}
      />
    </div>
  </div>
);

export default SignUp;
