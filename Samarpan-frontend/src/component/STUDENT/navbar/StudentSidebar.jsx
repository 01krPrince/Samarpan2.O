import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Send, Menu, Users } from "lucide-react";
import profilepic from "../../../assets/profilepic.png";

const MOBILE_BREAKPOINT = 640;
const SIDEBAR_WIDTH = 256;

const StudentSidebar = ({ }) => {
  const location = useLocation();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= MOBILE_BREAKPOINT);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      setIsSidebarOpen(width >= MOBILE_BREAKPOINT);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < MOBILE_BREAKPOINT;
  const isTabletOrDesktop = windowWidth >= MOBILE_BREAKPOINT;

  const [userData, setUserData] = useState(null);
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
            className="fixed inset-0 bg-opacity-30 z-30"
            onClick={() => setIsSidebarOpen(false)}
            role="button"
            tabIndex={0}
            aria-label="Close sidebar overlay"
          />
        )}

        {(isSidebarOpen || isTabletOrDesktop) && (
          <aside
            className={`bg-white z-400 flex flex-col pt-4 shadow-md ${
              isMobile
                ? "fixed top-16 left-0 w-[256px] h-[calc(100vh-4rem)]"
                : "fixed top-16 left-0 w-64 h-[calc(100vh-4rem)]"
            }`}
            style={{
              overflow: "hidden"
            }}
          >
            <nav className="space-y-4 px-4 overflow-y-auto h-full pb-4 flex flex-col">
              <NavItem
                to="/dashboard"
                icon={<Home size={20} />}
                text="Dashboard"
                active={location.pathname === "/dashboard"}
                isOpen={true}
                onClick={handleNavClick}
              />
              <NavItem
                to="/submit-project"
                icon={<Send size={20} />}
                text="Submit Project"
                active={location.pathname === "/submit-project"}
                isOpen={true}
                onClick={handleNavClick}
              />
              <NavItem
                to="/batchmates"
                icon={<Users size={20} />}
                text="Batchmates"
                active={location.pathname === "/batchmates"}
                isOpen={true}
                onClick={handleNavClick}
              />
              <NavItem
                to="/about"
                icon={<Users size={20} />}
                text="About"
                active={location.pathname === "/about"}
                isOpen={true}
                onClick={handleNavClick}
              />

            </nav>
          </aside>
        )}

        <main
          className="flex-1 overflow-y-auto bg-white p-4"
          style={{
            // height: "calc(100vh - 4rem)",
            width: 0,
            zIndex: 20,
            marginLeft: isTabletOrDesktop ? SIDEBAR_WIDTH : -35,
            transition: "margin-left 0.3s ease-in-out",
          }}
        >
        </main>

      </div>

      <footer className="fixed bottom-0 left-0 right-0 h-[5%] bg-white border-t flex items-center justify-center text-sm text-gray-500 z-40 fixed">
        &copy; {new Date().getFullYear()} Project Samarpan. All rights reserved.
      </footer>
    </div>
  );
};

const Header = ({ userData, isSidebarOpen, setIsSidebarOpen, isMobile }) => {
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow flex justify-between items-center px-4 z-50 max-w-[100%]">
      <div className="flex items-center space-x-4">
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="block"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            aria-expanded={isSidebarOpen}
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
    className={`flex items-center space-x-3 p-2 rounded transition-all duration-200 ${
      active
        ? "bg-gray-200 font-semibold text-black border-l-4 border-red-500"
        : "hover:bg-gray-100 text-gray-700"
    }`}
    aria-current={active ? "page" : undefined}
  >
    {icon}
    {isOpen && <span>{text}</span>}
  </Link>
);

export default StudentSidebar;
