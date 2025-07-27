import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Send, Menu, Users } from "lucide-react";
import profilepic from "../../../assets/profilepic.png";

const MOBILE_BREAKPOINT = 640;

const StudentSidebar = () => {
  const location = useLocation();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= MOBILE_BREAKPOINT);
  const [userData, setUserData] = useState(null);

  const isMobile = windowWidth < MOBILE_BREAKPOINT;

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      if (width >= MOBILE_BREAKPOINT) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUserData(JSON.parse(storedUser));
      } catch {
        console.error("[Sidebar] Failed to parse user data");
      }
    }
  }, []);

  const handleNavClick = () => {
    if (isMobile) setIsSidebarOpen(false);
  };

  const showOverlay = isMobile && isSidebarOpen;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header
        userData={userData}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isMobile={isMobile}
      />

      <div className="flex flex-1 pt-16 relative">
        {showOverlay && (
          <div
            className="fixed inset-0 bg-black/40 z-30"
            onClick={() => setIsSidebarOpen(false)}
            role="button"
            tabIndex={0}
            aria-label="Close sidebar overlay"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`bg-white border-r z-40 shadow-md transform transition-transform duration-300 ease-in-out
            ${isMobile
              ? `fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`
              : "w-64 h-[calc(100vh-4rem)] fixed top-16 left-0"
            }`}
        >
          <nav className="space-y-2 px-4 py-4 overflow-y-auto h-full">
            <NavItem to="/dashboard" icon={<Home size={20} />} text="Dashboard" active={location.pathname.startsWith("/dashboard")} onClick={handleNavClick} />
            <NavItem to="/submit-project" icon={<Send size={20} />} text="Submit Project" active={location.pathname.startsWith("/submit-project")} onClick={handleNavClick} />
            <NavItem to="/batchmates" icon={<Users size={20} />} text="Batchmates" active={location.pathname.startsWith("/batchmates")} onClick={handleNavClick} />
            <NavItem to="/about" icon={<Users size={20} />} text="About" active={location.pathname.startsWith("/about")} onClick={handleNavClick} />
          </nav>
        </aside>

        {/* Content */}
        <main
          className={`flex-1 ml-0 sm:ml-64 bg-gradient-to-b from-gray-50 to-gray-100 min-h-[calc(100vh-4rem-2.5rem)] p-4 ${isMobile ? "hidden" : "block"
            }`}
        >
        </main>

      </div>

      <footer className="fixed bottom-0 left-0 right-0 h-10 bg-white border-t flex items-center justify-center text-sm text-gray-500 z-40">
        &copy; {new Date().getFullYear()} Project Samarpan. All rights reserved.
      </footer>
    </div>
  );
};

const Header = ({ userData, isSidebarOpen, setIsSidebarOpen, isMobile }) => {
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm flex justify-between items-center px-4 z-50">
      <div className="flex items-center gap-4">
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="text-gray-700"
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>
        )}
        <h1 className="text-lg font-bold">Project Samarpan</h1>
      </div>

      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate("/profile")}
        role="button"
        tabIndex={0}
        aria-label="Go to profile"
      >
        <img
          src={profilepic}
          alt="profile"
          className="w-10 h-10 rounded-full object-cover border"
        />
        <div className="hidden md:block">
          <p className="text-sm font-semibold">{userData?.name || "Student"}</p>
          <p className="text-xs text-gray-500">{userData?.batch?.batchName || "No Batch Assigned"}</p>
        </div>
      </div>
    </header>
  );
};

const NavItem = ({ to, icon, text, active, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors duration-200 ${active
        ? "bg-gray-200 text-black font-semibold border-l-4 border-red-500"
        : "hover:bg-gray-100 text-gray-700"
      }`}
    aria-current={active ? "page" : undefined}
  >
    {icon}
    <span>{text}</span>
  </Link>
);

export default StudentSidebar;
