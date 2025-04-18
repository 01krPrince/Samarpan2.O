import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, LogOut, Send, Menu, Users } from "lucide-react";

const StudentSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 640 && window.innerWidth < 1024);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [userData, setUserData] = useState(null);

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

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 640;
      const tablet = window.innerWidth >= 640 && window.innerWidth < 1024;
      const desktop = window.innerWidth >= 1024;

      setIsMobile(mobile);
      setIsTablet(tablet);
      setIsSidebarOpen(desktop);
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

  const handleNavClick = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-30 h-full bg-white shadow-md text-black transition-all duration-300 ease-in-out mt-10
        ${isSidebarOpen ? (isMobile ? "w-16" : "w-64") : "w-16"} 
        pt-4 sm:pt-[2vh] flex flex-col justify-between`}
      >
        <div className="space-y-4 px-2 py-4">
          <NavItem
            to="/dashboard"
            icon={<Home size={20} />}
            text="Dashboard"
            active={location.pathname === "/dashboard"}
            isOpen={isSidebarOpen && !isMobile}
            onClick={handleNavClick}
          />
          <NavItem
            to="/submit-project"
            icon={<Send size={20} />}
            text="Submit Project"
            active={location.pathname === "/submit-project"}
            isOpen={isSidebarOpen && !isMobile}
            onClick={handleNavClick}
          />
          <NavItem
            to="/batchmates"
            icon={<Users size={20} />}
            text="Batchmates"
            active={location.pathname === "/batchmates"}
            isOpen={isSidebarOpen && !isMobile}
            onClick={handleNavClick}
          />
          <button
            className="flex items-center space-x-3 p-2 hover:bg-gray-200 rounded w-full text-left"
            onClick={() => {
              handleLogout();
              handleNavClick();
            }}
          >
            <LogOut size={20} />
            {isSidebarOpen && !isMobile && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out 
        ${isSidebarOpen ? (isMobile ? "ml-16" : "ml-64") : "ml-16"}`}
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
    <header className="w-full flex justify-between items-center bg-white text-black px-4 py-3 shadow fixed top-0 left-0 z-40">
      <div className="flex items-center space-x-4">
        <button onClick={onToggleSidebar} className="block sm:block md:hidden">
          <Menu size={24} />
        </button>
        <h1 className="text-lg font-bold hidden sm:inline">Project Samarpan</h1>
      </div>
      <div
        className="flex items-center cursor-pointer"
        onClick={() => navigate("/profile")}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
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

const NavItem = ({ to, icon, text, active, isOpen, onClick }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center space-x-3 p-2 rounded transition-all duration-200 
        ${active ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"}`}
    >
      {icon}
      {isOpen && <span>{text}</span>}
    </Link>
  );
};

export default StudentSidebar;
