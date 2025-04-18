import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole) {
      navigate(userRole === "ADMIN" ? "/landingpage" : "/dashboard");
    }
  }, [navigate]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://samarpan2-o.onrender.com/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Unexpected response from server: ${text}`);
      }

      if (response.ok) {
        console.log("Login Response:", data);

        let role = data.user.roles ? data.user.roles[0] : data.user.role;

        if (!role) {
          throw new Error("Role not found in response");
        }

        console.log("User Role:", role);

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("userRole", role.toUpperCase());

        console.log("Navigating to:", role.toUpperCase() === "ADMIN" ? "/landingpage" : "/dashboard");

        navigate(role.toUpperCase() === "ADMIN" ? "/landingpage" : "/dashboard");
      } else {
        setError(data.message || "Invalid username or password");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <LoginForm
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          handleSubmit={handleLoginSubmit}
          loading={loading}
          error={error}
          navigate={navigate}
        />
      </div>
    </div>
  );
};

export default LoginPage;



