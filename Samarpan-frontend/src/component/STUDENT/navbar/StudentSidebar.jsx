import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, LogOut, Send, Menu, Users } from "lucide-react";
import profilepic from "../../../assets/profilepic.png";

const MOBILE_BREAKPOINT = 640;
const TABLET_BREAKPOINT = 1024;

const StudentSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);
  const [isTablet, setIsTablet] = useState(
    window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < TABLET_BREAKPOINT
  );
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= TABLET_BREAKPOINT);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= TABLET_BREAKPOINT);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < MOBILE_BREAKPOINT);
      setIsTablet(width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT);
      setIsDesktop(width >= TABLET_BREAKPOINT);

      // Sidebar open state
      if (width >= TABLET_BREAKPOINT) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleNavClick = () => {
    if (isMobile || isTablet) setIsSidebarOpen(false);
  };

  const showOverlay = (isMobile || isTablet) && isSidebarOpen;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 overflow-hidden">
      {/* Header */}
      <Header
        userData={userData}
        onToggleSidebar={toggleSidebar}
        isMobile={isMobile}
        isTablet={isTablet}
        isDesktop={isDesktop}
      />

      <div className="flex flex-1 pt-16 relative overflow-hidden">
        {/* Overlay */}
        {showOverlay && (
          <div
            className="fixed inset-0 bg-white z-20 transition-all duration-300"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close sidebar overlay"
            tabIndex={0}
            role="button"
          />

        )}

        {/* Sidebar */}
        <aside
          className={`
            transition-all duration-300 ease-in-out bg-white shadow text-black flex flex-col justify-between
            ${isMobile || isTablet
              ? `fixed top-0 left-0 h-full pt-16 w-[70%] max-w-xs z-30 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`
              : `fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 z-30`
            }
          `}
          aria-label="Sidebar Navigation"
        >
          <nav className="space-y-4 px-2 py-4">
            <NavItem
              to="/dashboard"
              icon={<Home size={20} />}
              text="Dashboard"
              active={location.pathname === "/dashboard"}
              isOpen={isSidebarOpen || isDesktop}
              onClick={handleNavClick}
            />
            <NavItem
              to="/submit-project"
              icon={<Send size={20} />}
              text="Submit Project"
              active={location.pathname === "/submit-project"}
              isOpen={isSidebarOpen || isDesktop}
              onClick={handleNavClick}
            />
            <NavItem
              to="/batchmates"
              icon={<Users size={20} />}
              text="Batchmates"
              active={location.pathname === "/batchmates"}
              isOpen={isSidebarOpen || isDesktop}
              onClick={handleNavClick}
            />
            <NavItem
              to="/about"
              icon={<Users size={20} />}
              text="About"
              active={location.pathname === "/about"}
              isOpen={isSidebarOpen || isDesktop}
              onClick={handleNavClick}
            />
            <button
              type="button"
              className="flex items-center space-x-3 p-2 cursor-pointer hover:bg-gray-200 rounded w-full text-left"
              onClick={() => {
                handleLogout();
                handleNavClick();
              }}
              aria-label="Logout"
            >
              <LogOut size={20} />
              {(isSidebarOpen || isDesktop) && <span>Logout</span>}
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ease-in-out ${isDesktop ? "ml-64" : ""
            }`}
        >
          <div
            className="pt-4 overflow-y-auto"
            style={{
              minHeight: "calc(100vh - 4rem - 3rem)",
              paddingBottom: "3rem",
            }}
          >
            {/* 👉 Your dynamic content goes here */}
          </div>
        </main>
      </div>

      {/* Footer */}
        <footer className="fixed bottom-0 left-0 right-0 h-12 bg-white border-t flex items-center justify-center text-sm text-gray-500 z-40">
            &copy; {new Date().getFullYear()} Project Samarpan. All rights reserved.
        </footer>
   

    </div>
  );
};

const Header = ({ userData, onToggleSidebar, isMobile, isTablet }) => {
  const navigate = useNavigate();
  const showToggle = isMobile || isTablet;

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow flex justify-between items-center px-4 z-40">
      <div className="flex items-center space-x-4">
        {showToggle && (
          <button
            onClick={onToggleSidebar}
            className="block"
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>
        )}
        <h1 className="text-lg font-bold hidden sm:inline">Project Samarpan</h1>
      </div>
      <div
        className="flex items-center cursor-pointer"
        onClick={() => navigate("/profile")}
        tabIndex={0}
        aria-label="Profile"
        role="button"
      >
        <img
          src={profilepic}
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

const NavItem = ({ to, icon, text, active, isOpen, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center space-x-3 p-2 rounded transition-all duration-200
      ${active ? "bg-gray-200 font-semibold text-black border-l-4 border-red-500" : "hover:bg-gray-100 text-gray-700"}`}
    aria-current={active ? "page" : undefined}
  >
    {icon}
    {isOpen && <span>{text}</span>}
  </Link>
);

export default StudentSidebar;
