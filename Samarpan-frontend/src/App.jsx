import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Dashboard from "./component/STUDENT/dashboard/Dashboard";
import SubmitProject from "./component/STUDENT/dashboard/SubmitProject";
import CreateBatch from "./component/ADMIN/CreateBatch";
import CreateSubject from "./component/ADMIN/CreateSubject";
import ProjectDetails from "./component/ADMIN/ProjectDetails";
import Login from "./component/Auth/Login";
import SignUp from "./component/Auth/SignUp";
import Landing from "./component/ADMIN/Landing";
import AdminSidebar from "./component/ADMIN/AdminSidebar";
import StudentSidebar from "./component/STUDENT/navbar/StudentSidebar";
import ViewAll from "./component/ADMIN/ViewAll";

function App() {
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchUserRole = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.roles && parsedUser.roles.length > 0) {
            const role = parsedUser.roles[0];
            setUserRole(role);
          } else {
            setUserRole(null);
          }
        } catch (error) {
          console.error("Error parsing user role:", error);
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
    };
  
    fetchUserRole();
    window.addEventListener("storage", fetchUserRole);
    return () => window.removeEventListener("storage", fetchUserRole);
  }, []);

  const hideSidebarRoutes = ["/login", "/signup"];
  const shouldShowSidebar = !hideSidebarRoutes.includes(location.pathname) && userRole;

  return (
    <div className="flex">
      {shouldShowSidebar && userRole === "ADMIN" && <AdminSidebar />}
      {shouldShowSidebar && userRole === "STUDENT" && <StudentSidebar />}

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Student Routes */}
          <Route
            path="/dashboard"
            element={userRole === "STUDENT" ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/submit-project"
            element={userRole === "STUDENT" ? <SubmitProject /> : <Navigate to="/login" />}
          />

          <Route
            path="/landingpage"
            element={userRole === "ADMIN" ? <Landing /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/create-batch"
            element={userRole === "ADMIN" ? <CreateBatch /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/create-subject"
            element={userRole === "ADMIN" ? <CreateSubject /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/view-all"
            element={userRole === "ADMIN" ? <ViewAll /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/project/:id"
            element={userRole === "ADMIN" ? <ProjectDetails /> : <Navigate to="/login" />}
          />
          
        </Routes>
      </div>
    </div>
  );
}

export default App;
