import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, LogOut, Send, Menu } from "lucide-react";
import profileImage from "../../../assets/generic-profile-icon.png";

const StudentSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  const [userData, setUserData] = useState(null);

  // Load user data
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUserData(JSON.parse(storedUser));
      } catch (e) {
        console.error("Invalid JSON in localStorage 'user'", e);
      }
    }
  }, []);

  // Detect screen resize
  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth < 768;
      setIsMobile(isNowMobile);
      if (isNowMobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    console.log("Logged out");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-30 h-full bg-white text-black shadow-lg transition-all duration-300 ease-in-out
        ${isSidebarOpen ? "w-64" : "w-16"} 
        ${isMobile ? "pt-16" : "pt-[6vh]"} 
        flex flex-col justify-between`}
      >
        <div className="mt-6 space-y-4 p-3">
          <NavItem
            to="/dashboard"
            icon={<Home size={20} />}
            text="Dashboard"
            active={location.pathname === "/dashboard"}
            isOpen={isSidebarOpen}
          />
          <NavItem
            to="/submit-project"
            icon={<Send size={20} />}
            text="Submit Project"
            active={location.pathname === "/submit-project"}
            isOpen={isSidebarOpen}
          />
          <button
            className="flex items-center space-x-3 p-2 hover:bg-gray-200 rounded w-full text-left"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out 
        ${isSidebarOpen ? "ml-64" : "ml-16"}`}
      >
        <Header userData={userData} onToggleSidebar={toggleSidebar} />

        <div className="p-4 mt-16 overflow-auto">
          {/* Page content goes here */}
        </div>
      </div>
    </div>
  );
};

const Header = ({ userData, onToggleSidebar }) => {
  const navigate = useNavigate();
  return (
    <header className="w-full flex justify-between items-center bg-white text-black px-4 py-2 shadow-md fixed top-0 left-0 z-40">
      <div className="flex items-center space-x-4">
        <button onClick={onToggleSidebar} className="md:hidden">
          <Menu size={24} />
        </button>
        <h1 className="text-lg font-bold hidden sm:inline">Project Samarpan</h1>
      </div>
      <div
        className="flex items-center cursor-pointer"
        onClick={() => navigate("/profile")}
      >

        <img
          src={profileImage}
          alt="profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="ml-3 hidden md:block">
          <h1 className="text-sm font-semibold">{userData?.name || "Student"}</h1>
          <h3 className="text-xs text-gray-500">
            {userData?.batch?.batchName || "No Batch Assigned"}
          </h3>
        </div>
      </div>
    </header>
  );
};

const NavItem = ({ to, icon, text, active, isOpen }) => {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 p-2 rounded transition 
        ${active ? "bg-gray-200 font-medium" : "hover:bg-gray-100"}
        `}
    >
      {icon}
      {isOpen && <span>{text}</span>}
    </Link>
  );
};

export default StudentSidebar;
