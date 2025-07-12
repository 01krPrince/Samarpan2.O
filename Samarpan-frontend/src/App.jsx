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
import UpdateProject from "./component/STUDENT/dashboard/UpdateProject";
import ViewDetails from "./component/STUDENT/dashboard/ViewProjectStudent";
import StudentProfile from "./component/STUDENT/dashboard/StudentProfile";
import Batchmates from "./component/STUDENT/dashboard/Batchmates";
import ForgetPassword from "./component/Auth/ForgetPassword";
import About from "./component/STUDENT/dashboard/About";

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
  }, [location.pathname]);

  const hideSidebarRoutes = ["/login", "/signup"];
  const shouldShowSidebar = !hideSidebarRoutes.includes(location.pathname) && userRole;

  return (
    <div className="flex">
      {shouldShowSidebar && userRole === "ADMIN" && <AdminSidebar />}
      {shouldShowSidebar && userRole === "STUDENT" && <StudentSidebar />}

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login setUserRole={setUserRole} />} />
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
            path="/update-project"
            element={userRole === "STUDENT" ? <UpdateProject /> : <Navigate to="/login" />}
          />

          <Route
            path="/view-project"
            element={userRole === "STUDENT" ? <ViewDetails /> : <Navigate to="/login" />}
          />

          <Route
            path="/about"
            element={userRole === "STUDENT" ? <About /> : <Navigate to="/about" />}
          />

          <Route
            path="/profile"
            element={userRole === "STUDENT" || userRole === "ADMIN" ? <StudentProfile /> : <Navigate to="/login" />}
          />

          <Route
            path="/batchmates"
            element={userRole === "STUDENT" || userRole === "ADMIN" ? <Batchmates /> : <Navigate to="/login" />}
          />

          <Route
            path="/forget-password/reset"
            element={userRole === "STUDENT" || userRole === "ADMIN" ? <ForgetPassword /> : <Navigate to="/login" />}
          />



          {/* Admin Routes */}
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
            path="/admin/review-project"
            element={userRole === "ADMIN" ? <ProjectDetails /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
