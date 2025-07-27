import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Home, Users, BookOpen, Folder } from "lucide-react";

const AdminSidebar = ({ setUserRole }) => {
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  // Resize listener to toggle sidebar width on mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    // Clear localStorage keys related to auth/login
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");

    // Update app state (userRole=null) so ProtectedRoute and routing reacts accordingly
    if (setUserRole) {
      setUserRole(null);
    }

    // Navigate to login page with replace to prevent history stack issues
    navigate("/", { replace: true });

    console.log("Logged out");
  };

  return (
    <div className="flex h-screen md:pt-[5vh] pt-[4vh]">
      <div
        ref={sidebarRef}
        className={`fixed left-0 h-full bg-white text-black shadow-lg flex flex-col justify-between transition-all duration-300 ${
          isMobile ? "w-14" : "w-64"
        }`}
      >
        <div className="md:mt-16 mt-10 space-y-4 p-3">
          <NavItem
            to="/"
            icon={<Home size={20} />}
            text="Dashboard"
            active={location.pathname === "/"}
            isOpen={!isMobile}
          />

          <NavItem
            to="/admin/view-all"
            icon={<Folder size={20} />}
            text="Projects"
            active={location.pathname === "/admin/view-all"}
            isOpen={!isMobile}
          />

          <NavItem
            to="/admin/create-batch"
            icon={<Users size={20} />}
            text="Batches"
            active={location.pathname === "/admin/create-batch"}
            isOpen={!isMobile}
          />

          <NavItem
            to="/admin/create-subject"
            icon={<BookOpen size={20} />}
            text="Subjects"
            active={location.pathname === "/admin/create-subject"}
            isOpen={!isMobile}
          />

          <button
            className="flex items-center space-x-3 p-2 hover:bg-gray-300 rounded w-full text-left"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <LogOut size={20} />
            {!isMobile && <span>Logout</span>}
          </button>
        </div>
      </div>

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isMobile ? "ml-14" : "ml-64"
        }`}
      >
        <Header />
      </div>
    </div>
  );
};

const Header = () => {
  return (
    <header className="w-full flex justify-between bg-white text-black md:p-4 p-2 shadow-sm fixed top-0 left-0 z-10">
      <h1 className="text-lg font-bold">Samarpan</h1>
      <div className="flex items-center">
        <div className="ml-3 hidden md:block">
          <h1 className="text-sm font-semibold">Admin</h1>
        </div>
      </div>
    </header>
  );
};

const NavItem = ({ to, icon, text, active, isOpen }) => {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 p-2 rounded transition-all duration-200 ${
        active
          ? "bg-blue-100 text-gray-600 font-semibold border-l-4 border-gray-800"
          : "hover:bg-gray-100"
      }`}
    >
      {icon}
      {isOpen && <span>{text}</span>}
    </Link>
  );
};

export default AdminSidebar;
