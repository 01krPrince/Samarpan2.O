import React, { useState } from "react";
import StudentProfile from "./StudentProfile";
import ResumeCreator from "./ResumeCreator";

export default function ProfileTransition() {
  const [showResume, setShowResume] = useState(false);
  const [folding, setFolding] = useState(false);

  // When Create Resume is clicked
  const handleCreateResume = () => {
    setFolding(true);
    setTimeout(() => {
      setShowResume(true);
      setFolding(false);
    }, 1500); // 1.5 seconds
  };

  const handleBackToProfile = () => {
    setShowResume(false);
  };

  return (
    <div className="relative min-h-screen">
      {!showResume && (
        <div
          className={`transition-all duration-[1500ms] ease-in-out
            ${folding ? "opacity-0 -translate-y-32 scale-y-75 pointer-events-none" : "opacity-100 translate-y-0 scale-y-100"}
            origin-top`}
        >
          <StudentProfile onCreateResume={handleCreateResume} />
        </div>
      )}
      {showResume && (
        <div className="animate-unfold-in">
          <ResumeCreator onBack={handleBackToProfile} />
        </div>
      )}
      <style>
        {`
        .animate-unfold-in {
          animation: unfoldIn 1.5s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes unfoldIn {
          0% {
            opacity: 0;
            transform: translateY(-50px) scaleY(0.75);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scaleY(1);
          }
        }
        `}
      </style>
    </div>
  );
}
