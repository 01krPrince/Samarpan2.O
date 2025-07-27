import React, { useState } from "react";
import LoginForm from "./Login";
import SignUp from "./SignUp";
import logo from "../../assets/logo.png";
import Lottie from "lottie-react";
import loginAnimation from "../../assets/animations/login.json";
import registerAnimation from "../../assets/animations/register.json";


const Auth = ({ setUserRole }) => {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6" }}>
      <header
        style={{
          width: "100%",
          backgroundColor: "#ffffff",
          boxShadow: "0 2px 4px rgb(0 0 0 / 0.1)",
          display: "flex",
          alignItems: "center",
          padding: "10px 40px",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <img src={logo} alt="Samarpan Logo" className="h-12 w-auto mr-4" />
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-wide">
          Samarpan
        </h1>
      </header>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          paddingLeft: "140px",
          minHeight: "calc(100vh - 60px)",
          maxWidth: "100vw",
        }}
      >
        <div className="hidden md:flex md:w-1/3 flex-col justify-center items-center px-10 py-12 max-h-screen overflow-y-auto">
          <Lottie
            animationData={!showSignup ? loginAnimation : registerAnimation}
            loop={true}
            style={{ width: 350, height: 350 }}
          />
        </div>

        <div
          className="w-full md:w-2/3 relative flex items-center justify-center p-8 overflow-auto"
          style={{ maxWidth: "900px" }}
        >
          {!showSignup && (
            <LoginForm
              setUserRole={setUserRole}
              openSignup={() => setShowSignup(true)}
            />
          )}
          {showSignup && <SignUp onClose={() => setShowSignup(false)} />}
        </div>
      </div>
    </div>
  );
};

export default Auth;
