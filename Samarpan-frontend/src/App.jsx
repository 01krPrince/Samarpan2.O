import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Dashboard from "./component/STUDENT/dashboard/Dashboard";
import SubmitProject from "./component/STUDENT/dashboard/SubmitProject";
import AdminLogin from "./component/Auth/Login";
import AdminSignUp from "./component/Auth/SignUp";
import CreateBatch from "./component/ADMIN/CreateBatch";
import CreateSubject from "./component/ADMIN/CreateSubject";
import ViewAll from "./component/ADMIN/viewAll";
import Landing from "./component/ADMIN/Landing";
import ProjectDetails from "./component/ADMIN/ProjectDetails";
import StudentSidebar from "./component/STUDENT/navbar/StudentSidebar";
import AdminSidebar from "./component/ADMIN/AdminSidebar";
import { useEffect, useState } from "react";

function App() {
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);

  // Fetch user role from localStorage on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.roles) {
      console.log(storedUser);
      setUserRole(storedUser.roles[0]);
    }
  }, []);

  // Define paths where Sidebar should be hidden
  const hideSidebarPaths = ["/", "/signup"];

  // Check if the user is authenticated
  const isAuthenticated = !!localStorage.getItem("token");

  // Protected Route Component
  const ProtectedRoute = ({ children, allowedRole }) => {
    if (!isAuthenticated) {
      return <Navigate to="/" />;
    }
    if (allowedRole && userRole !== allowedRole) {
      return <Navigate to={userRole === "ADMIN" ? "/landingpage" : "/dashboard"} />;
    }
    return children;
  };

  // Conditionally render the appropriate sidebar
  const renderSidebar = () => {
    if (hideSidebarPaths.includes(location.pathname)) return null;
    if (userRole === "ADMIN") return <AdminSidebar />;
    if (userRole === "STUDENT") return <StudentSidebar />;
    return null; // Default case (e.g., no role yet)
  };

  return (
    <div className="flex">
      {renderSidebar()}
      <div className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<AdminLogin />} />
          <Route path="/signup" element={<AdminSignUp />} />

          {/* Student Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRole="STUDENT">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/submit-project"
            element={
              <ProtectedRoute allowedRole="STUDENT">
                <SubmitProject />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/landingpage"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <Landing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/createBatch"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <CreateBatch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/createSubject"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <CreateSubject />
              </ProtectedRoute>
            }
          />
          <Route
            path="/viewAll"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <ViewAll />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project/:id"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <ProjectDetails />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;