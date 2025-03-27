
// import { useState, useEffect, useRef } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { Home,  Menu, X,  LogOut } from "lucide-react";
// import user from "../../../assets/generic-profile-icon.png"

// const Sidebar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const sidebarRef = useRef(null);
//   const location = useLocation();

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   return (
//     <div className="pt-[5vh] md:pt-[10vh] h-screen ">
    
//     <div
//       ref={sidebarRef}
//       className={`fixed min-h-screen left-0 bg-white text-black md:p-5 p-3 transition-all shadow-lg flex flex-col justify-between ${
//         isOpen ? "w-64" : "md:w-20 w-16"
//       }`}
//     //   style={{ height: "calc(100vh - 8vh)" }} 
//     >
//       {/* Sidebar Toggle Button */}
//       <button
//         className="absolute top-5 right-5 text-black"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         {isOpen ? <X size={20} /> : <Menu size={20} />}
//       </button>

//       {/* Sidebar Links */}
//       <div className="mt-10 space-y-4">
//         <NavItem to="/" icon={<Home size={20} />} text="Dashboard" active={location.pathname === "/"} isOpen={isOpen} />

//         {/* Logout Button */}
//         <button
//           className="flex items-center space-x-3 p-2 hover:bg-gray-300 rounded w-full text-left"
//           onClick={() => console.log("Logging out...")}
//         >
//           <LogOut size={20} />
//           {isOpen && <span>Logout</span>}
//         </button>
//       </div>

//       <div className="flex items-center p-2 hover:bg-gray-300 rounded transition">
//         <img src={user} alt="profile" className="w-14 rounded-full " />
//         {isOpen && (
//           <div className="ml-3">
//             <h1 className="text-sm font-semibold">Student Name</h1>
//             <h3 className="text-xs text-gray-500">Batch</h3>
//           </div>
//         )}
//       </div>
//     </div>

//     <div className={`flex-1 flex flex-col transition-all duration-300 ${isOpen ? "ml-64" : "ml-20"}`}>
//       <Header />
//     </div>
//   </div>
//   );
// };

// const Header = () => {
//   return (
//     <header className="w-full bg-white text-black md:p-4 p-2 shadow-sm fixed top-0 left-0 z-10">
//       <h1 className="md:text-lg text-sm font-bold"> Project Track</h1>
//     </header>
//   );
// };

// const NavItem = ({ to, icon, text, active, isOpen }) => {
//   return (
//     <Link
//       to={to}
//       className={`flex items-center space-x-3 p-2 rounded transition ${
//         active ? "bg-gray-200" : "hover:bg-gray-300"
//       }`}
//     >
//       {icon}
//       {isOpen && <span>{text}</span>}
//     </Link>
//   );
// };

// export default Sidebar;





import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Menu, X, LogOut } from "lucide-react";
import user from "../../../assets/generic-profile-icon.png";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const location = useLocation();

  // Close sidebar when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex h-screen">
     
      <div
        ref={sidebarRef}
        className={`fixed md:top-[8vh] top-[7vh] left-0 h-full bg-white text-black shadow-lg flex flex-col justify-between transition-all duration-300 ${
          isOpen ? "w-64 " : "w-16"
        }`}
      >
        <button
          className="absolute top-5 right-5 text-black"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="md:mt-16 mt-10 space-y-4 p-3">
          <NavItem to="/" icon={<Home size={20} />} text="Dashboard" active={location.pathname === "/"} isOpen={isOpen} />

          <button
            className="flex items-center space-x-3 p-2 hover:bg-gray-300 rounded w-full text-left"
            onClick={() => console.log("Logging out...")}
          >
            <LogOut size={20} />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      <div className={`flex-1 flex flex-col transition-all duration-300 ${isOpen ? "ml-64" : "ml-16"}`}>
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

export default Sidebar;

