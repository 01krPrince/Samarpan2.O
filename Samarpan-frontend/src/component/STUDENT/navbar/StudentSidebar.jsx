import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, LogOut , Send } from "lucide-react";
import user from "../../../assets/generic-profile-icon.png";

const StudentSidebar = () => {
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  const handleClick = () => {
    localStorage.clear();
    navigate('/');
    console.log("Logged out");
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen md:pt-[5vh] pt-[4vh]">
    
      <div
        ref={sidebarRef}
        className={`fixed left-0 h-full bg-white text-black shadow-lg flex flex-col justify-between transition-all duration-300 
          ${isMobile ? "w-14" : "w-64"}`}
      >
        <div className="md:mt-16 mt-10 space-y-4 p-3">
          <NavItem to="/dashboard" icon={<Home size={20} />} text="Dashboard" active={location.pathname === "/dashboard"} isOpen={!isMobile} />
          <NavItem to="/submit-project  " icon={<Send size={20} />} text="Submit Project" active={location.pathname === "/submit-project"} isOpen={!isMobile} />

          <button
            className="flex items-center space-x-3 p-2 hover:bg-gray-300 rounded w-full text-left"
            onClick={() => handleClick()}
          >
            <LogOut size={20} />
            {!isMobile && <span>Logout</span>}
          </button>
        </div>
      </div>

      <div className={`flex-1 flex flex-col transition-all duration-300 ${isMobile ? "ml-14" : "ml-64"}`}>
        <Header />
      </div>
    </div>
  );
};

const Header = () => {
  return (
    <header className="w-full flex justify-between bg-white text-black md:p-4 p-2 shadow-sm fixed top-0 left-0 z-10">
      <h1 className="text-lg font-bold">Project Track</h1>
      <div className="flex items-center">
        <img src={user} alt="profile" className="w-10 h-10 rounded-full" />
        <div className="ml-3 hidden md:block">
          <h1 className="text-sm font-semibold">Student Name</h1>
          <h3 className="text-xs text-gray-500">Batch</h3>
        </div>
      </div>
    </header>
  );
};

const NavItem = ({ to, icon, text, active, isOpen }) => {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 p-2 rounded transition ${
        active ? "bg-gray-200" : "hover:bg-gray-300"
      }`}
    >
      {icon}
      {isOpen && <span>{text}</span>}
    </Link>
  );
};

export default StudentSidebar;