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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="w-full bg-white shadow-sm sticky top-0 z-50 flex items-center px-6 py-3">
        <img src={logo} alt="Samarpan Logo" className="h-12 w-auto mr-4" />
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-wide">
          Samarpan
        </h1>
      </header>

      <main className="flex flex-1 flex-col md:flex-row items-center justify-center p-4 md:p-10 max-w-screen-xl mx-auto w-full space-y-10 md:space-y-0 md:space-x-20">
        {/* Left animation panel - hidden on mobile */}
        <div className="hidden md:flex md:flex-col md:w-1/3 justify-center items-center max-h-screen overflow-y-auto">
          <Lottie
            animationData={!showSignup ? loginAnimation : registerAnimation}
            loop={true}
            style={{ width: 350, height: 350, maxWidth: "100%" }}
          />
        </div>

        {/* Right form panel */}
        <div className="w-full md:w-2/3 max-w-lg bg-white rounded-xl shadow-lg p-8 overflow-y-auto max-h-[80vh]">
          {!showSignup && (
            <LoginForm setUserRole={setUserRole} openSignup={() => setShowSignup(true)} />
          )}
          {showSignup && <SignUp onClose={() => setShowSignup(false)} />}
        </div>
      </main>
    </div>
  );
};

export default Auth;
