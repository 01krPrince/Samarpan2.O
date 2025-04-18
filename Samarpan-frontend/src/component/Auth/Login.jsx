import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import ForgetPasswordForm from "./ForgetPasswordForm";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [view, setView] = useState("login");
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

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://samarpan2-o.onrender.com/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phoneNumber, newPassword }),
      });

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Unexpected response from server: ${text}`);
      }

      if (response.ok) {
        console.log("Password Reset Response:", data);
        setView("login");
        setError("Password reset successfully. Please log in.");
        setEmail("");
        setPhoneNumber("");
        setNewPassword("");
      } else {
        setError(data.message || "Failed to reset password. Please try again.");
      }
    } catch (error) {
      console.error("Error during password reset:", error);
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSetView = (newView) => {
    setView(newView);
    setError(""); // Clear error on view change
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        {view === "login" ? (
          <LoginForm
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            handleSubmit={handleLoginSubmit}
            loading={loading}
            error={error}
            setView={handleSetView}
            navigate={navigate} // Pass navigate for Sign Up button
          />
        ) : (
          <ForgetPasswordForm
            email={email}
            setEmail={setEmail}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            handleSubmit={handleResetPassword}
            loading={loading}
            error={error}
            setView={handleSetView}
          />
        )}
      </div>
    </div>
  );
};

export default Login;