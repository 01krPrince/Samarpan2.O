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

const SignUp = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [batches, setBatches] = useState([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchBatches = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/Batch/getAllBatch", {
        headers: {
          'accept': '*/*'
        }
      });
      if (!response.ok) throw new Error("Failed to fetch batches");
      const data = await response.json();
      setBatches(data);
      console.log("Batches fetched:", data);
    } catch (err) {
      console.error("Error fetching batches:", err);
      setError("Failed to load batches");
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleNext = (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedBatchId) {
      setError("Please select a batch!");
      return;
    }

    setLoading(true);
    try {
      const selectedBatch = batches.find((b) => b.id === selectedBatchId);
      
      const payload = {
        instituteName: "codingage",
        name: name,
        email: username,
        contact: contact,
        batch: {
          id: selectedBatch.id,
          batchName: selectedBatch.batchName,
          branch: {
            id: selectedBatch.branch.id,
            branchName: selectedBatch.branch.branchName
          }
        },
        password: password,
        language: "EN"
      };

      console.log("Sending payload:", payload); // Debug log

      const response = await fetch("http://localhost:8080/api/auth/signup/student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "*/*"
        },
        body: JSON.stringify(payload)
      });

      const contentType = response.headers.get("content-type");
      const data = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

      if (response.ok) {
        alert("Sign up successful! Redirecting to login...");
        navigate("/");
      } else {
        console.error("Server response:", data);
        setError(data.message || data || "Failed to sign up");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      {step === 1 ? (
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <div className="flex justify-center mb-4">
            <FaUserPlus className="text-4xl text-gray-700" />
          </div>
          <h2 className="text-2xl font-bold text-center">Sign Up</h2>
          <p className="text-center text-gray-600 mb-4">Create a new account</p>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleNext}>
            <InputField icon={<FaUser />} label="Full Name" value={name} setValue={setName} />
            <InputField icon={<FaEnvelope />} label="Email" type="email" value={username} setValue={setUsername} />
            <InputField icon={<FaPhone />} label="Contact Number" value={contact} setValue={setContact} />
            <InputField icon={<FaLock />} label="Password" type="password" value={password} setValue={setPassword} />
            <InputField icon={<FaLock />} label="Confirm Password" type="password" value={confirmPassword} setValue={setConfirmPassword} />

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
          <h2 className="text-2xl font-bold text-center">Select Batch</h2>
          <p className="text-center text-gray-600 mb-4">Choose your batch</p>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Batch</label>
              <div className="flex items-center border rounded-md p-2 mt-1">
                <FaList className="text-gray-500 mr-2" />
                <select
                  value={selectedBatchId}
                  onChange={(e) => setSelectedBatchId(e.target.value)}
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

            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-2 rounded-md flex justify-center items-center text-lg font-medium cursor-pointer"
              disabled={loading}
            >
              {loading ? "Signing Up..." : (
                <>
                  <FaUserPlus className="mr-2" /> Sign Up
                </>
              )}
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

const InputField = ({ icon, label, value, setValue, type = "text" }) => (
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
      />
    </div>
  </div>
);

export default SignUp;