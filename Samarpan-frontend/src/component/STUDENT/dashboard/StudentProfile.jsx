import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  GraduationCap,
  User2,
  Mail,
  Phone,
  School2,
  Users,
  Calendar
} from "lucide-react";

// Profile field with icon
const ProfileField = ({ label, value, icon: Icon }) => (
  <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition">
    <Icon size={22} />
    <div>
      <p className="text-xs uppercase mb-1">{label}</p>
      <p className="font-semibold text-sm truncate">{value || "N/A"}</p>
    </div>
  </div>
);

// Skeleton loader for loading state
const SkeletonField = () => (
  <div className="flex items-center gap-3 p-2 animate-pulse rounded-xl">
    <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
    <div>
      <div className="h-3 w-20 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 w-32 bg-gray-200 rounded"></div>
    </div>
  </div>
);

// Pointer block for date
const PointerBlock = ({ date }) => (
  <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 border border-gray-200 rounded-full w-fit mx-auto mt-6 shadow-sm">
    <Calendar size={16} />
    <span className="text-xs font-medium">{date}</span>
  </div>
);

const StudentProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setTimeout(() => {
        setUserData(JSON.parse(storedUser));
        setLoading(false);
      }, 800); // Simulate loading
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate("/login");
    }
  };

  // Example: If batch has a date, show it in the pointer block
  const batchDate =
    !loading && userData?.batch?.date
      ? new Date(userData.batch.date).toLocaleDateString()
      : null;

  return (
    <div className="min-h-screen bg-white py-12 px-4 md:px-2 mt-8">

      <h2 className="text-xl sm:text-2xl font-semibold mb-4 px-3">Student Profile</h2>
      
      {/* Header */}
      <div className="text-center mb-10">
        
        {!loading && userData && (
          <p className="text-md mt-2">
            Welcome, <span className="font-semibold">{userData.name?.split(" ")[0]}</span>!
          </p>
        )}
      </div>

      {/* Profile Details */}
      <div className="flex flex-col md:flex-row items-center gap-10 max-w-3xl mx-auto">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-xl">
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => <SkeletonField key={index} />)
          ) : (
            <>
              <ProfileField label="Name" value={userData?.name} icon={User2} />
              <ProfileField label="Email" value={userData?.email} icon={Mail} />
              <ProfileField label="Phone" value={userData?.phone} icon={Phone} />
              <ProfileField label="Institute" value={userData?.instituteName} icon={School2} />
              <ProfileField label="Batch Name" value={userData?.batch?.batchName} icon={Users} />
            </>
          )}
        </div>
      </div>

      {/* Pointer Block for Date */}
      {!loading && batchDate && <PointerBlock date={batchDate} />}

      {/* Logout Button */}
      {!loading && (
        <div className="mt-16 text-center">
          <button
            onClick={handleLogout}
            className="inline-flex items-center cursor-pointer gap-2 bg-gray-700 hover:bg-gray-900 text-white font-bold px-6 py-2 rounded-lg shadow transition"
            title="Logout"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;
