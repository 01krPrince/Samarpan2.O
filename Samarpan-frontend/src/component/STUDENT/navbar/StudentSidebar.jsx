import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, LogOut, Send, Menu, Users } from "lucide-react";
import profilepic from "../../../assets/profilepic.png";

const MOBILE_BREAKPOINT = 640;
const TABLET_BREAKPOINT = 1024;

const StudentSidebar = ({ setUserRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef(null);

  // Track viewport size
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Track sidebar open state - on desktop always open
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= TABLET_BREAKPOINT);

  // Detect if mobile (<640px)
  const isMobile = windowWidth < MOBILE_BREAKPOINT;

  // Detect if tablet
  const isTablet = windowWidth >= MOBILE_BREAKPOINT && windowWidth < TABLET_BREAKPOINT;

  // Detect desktop
  const isDesktop = windowWidth >= TABLET_BREAKPOINT;

  // Set user data from localStorage
  const [userData, setUserData] = useState(null);

  // Window resize listener - updates width and sidebar open/close state
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);

      if (width >= TABLET_BREAKPOINT) {
        setIsSidebarOpen(true); // desktop: always open wide sidebar
      } else {
        setIsSidebarOpen(false); // mobile/tablet: sidebar closed by default
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load user data on mount
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

  // Logout handler clears localStorage and resets user role in app, then navigates to login (/)
  const handleLogout = () => {
    console.log("[Sidebar] Logout initiated");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    setUserRole(null);
    navigate("/", { replace: true });
    setIsSidebarOpen(false);
  };

  // Close sidebar on nav link click if mobile/tablet
  const handleNavClick = () => {
    if (isMobile || isTablet) {
      setIsSidebarOpen(false);
      console.log("[Sidebar] Sidebar closed by nav click");
    }
  };

  // Whether to show a white transparent overlay when sidebar is open in mobile/tablet
  const showOverlay = (isMobile || isTablet) && isSidebarOpen;

  // Sidebar width classes - like AdminSidebar
  const sidebarWidthClass = isMobile ? "w-14" : isSidebarOpen || isDesktop ? "w-64" : "w-14";

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 overflow-hidden">
      <Header
        userData={userData}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isMobile={isMobile}
        isTablet={isTablet}
      />

      <div className="flex flex-1 pt-16 relative overflow-hidden">
        {showOverlay && (
          <div
            className="fixed inset-0 bg-white z-20 transition-all duration-300"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.4)" }}
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close sidebar overlay"
            tabIndex={0}
            role="button"
          />
        )}

        <aside
          ref={sidebarRef}
          className={`fixed top-0 left-0 h-full bg-white shadow text-black flex flex-col justify-between transition-all duration-300 ${sidebarWidthClass} pt-16 z-30`}
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
              onClick={handleLogout}
              aria-label="Logout"
            >
              <LogOut size={20} />
              {(isSidebarOpen || isDesktop) && <span>Logout</span>}
            </button>
          </nav>
        </aside>

        <main
          className={`flex-1 transition-all duration-300 ease-in-out ${isDesktop ? "ml-64" : isSidebarOpen ? "ml-64" : "ml-14"}`}
          style={{ minHeight: "calc(100vh - 4rem)", paddingBottom: "3rem", paddingTop: "4rem" }}
        >
          {/* Your routed content will go here */}
        </main>

      </div>

      <footer className="fixed bottom-0 left-0 right-0 h-12 bg-white border-t flex items-center justify-center text-sm text-gray-500 z-40">
        &copy; {new Date().getFullYear()} Project Samarpan. All rights reserved.
      </footer>
    </div>
  );
};

const Header = ({ userData, isSidebarOpen, setIsSidebarOpen, isMobile, isTablet }) => {
  const navigate = useNavigate();
  const showToggle = isMobile || isTablet;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    console.log("[Sidebar] Toggled sidebar:", !isSidebarOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow flex justify-between items-center px-4 z-40">
      <div className="flex items-center space-x-4">
        {showToggle && (
          <button onClick={toggleSidebar} className="block" aria-label="Toggle sidebar">
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
        <img src={profilepic} alt="profile" className="w-10 h-10 rounded-full object-cover" />
        <div className="ml-3 hidden md:block">
          <h1 className="text-sm font-semibold">{userData?.name || "Student"}</h1>
          <h3 className="text-xs text-gray-500">{userData?.batch?.batchName || "No Batch Assigned"}</h3>
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
