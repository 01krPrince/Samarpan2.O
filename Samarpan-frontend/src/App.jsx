import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Dashboard from "./component/STUDENT/dashboard/Dashboard";
import SubmitProject from "./component/STUDENT/dashboard/SubmitProject";
import UpdateProject from "./component/STUDENT/dashboard/UpdateProject";
import ViewProjectStudent from "./component/STUDENT/dashboard/viewProjectStudent";
import About from "./component/STUDENT/dashboard/About";
import StudentProfile from "./component/STUDENT/dashboard/profile/ProfileTransition";
import Batchmates from "./component/STUDENT/dashboard/Batchmates";

import Landing from "./component/ADMIN/Landing";
import CreateBatch from "./component/ADMIN/CreateBatch";
import CreateSubject from "./component/ADMIN/CreateSubject";
import ProjectDetails from "./component/ADMIN/ProjectDetails";
import ViewAll from "./component/ADMIN/ViewAll";

import AdminSidebar from "./component/ADMIN/AdminSidebar";
import StudentSidebar from "./component/STUDENT/navbar/StudentSidebar";

import ForgetPassword from "./component/Auth/ForgetPassword";
import Auth from "./component/Auth/Auth";

import ProtectedRoute from "./ProtectedRoute";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [userRole, setUserRole] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const protectedPaths = [
    "/dashboard",
    "/submit-project",
    "/update-project",
    "/view-project",
    "/about",
    "/profile",
    "/batchmates",
    "/landingpage",
    "/admin/create-batch",
    "/admin/create-subject",
    "/admin/view-all",
    "/admin/review-project",
    "/edit-profile",
  ];

  // ✅ Save last visited path (on every path change)
  useEffect(() => {
    const currentPath = location.pathname;
    if (userRole && protectedPaths.includes(currentPath)) {
      localStorage.setItem("lastPath", currentPath);
    }
  }, [location.pathname, userRole]);

  // ✅ Auto login on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const role = localStorage.getItem("userRole");

    if (token && user && (role === "STUDENT" || role === "ADMIN")) {
      setUserRole(role);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
    }

    setAuthChecked(true);
  }, []);

  // ✅ Redirect user after auth check
  useEffect(() => {
    if (!authChecked) return;

    const currentPath = location.pathname.replace(/\/+$/, "") || "/";
    const lastPath = localStorage.getItem("lastPath");

    if (!userRole) {
      if (protectedPaths.includes(currentPath)) {
        navigate("/", { replace: true });
      }
    } else {
      if (["/", "/login", "/signup"].includes(currentPath)) {
        if (lastPath && protectedPaths.includes(lastPath)) {
          navigate(lastPath, { replace: true });
        } else {
          navigate(userRole === "ADMIN" ? "/landingpage" : "/dashboard", {
            replace: true,
          });
        }
      }
    }
  }, [authChecked, userRole, location.pathname, navigate]);

  const hideSidebarRoutes = ["/", "/forget-password/reset"];
  const shouldShowSidebar =
    authChecked && !hideSidebarRoutes.includes(location.pathname) && !!userRole;

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {shouldShowSidebar && userRole === "ADMIN" && (
        <AdminSidebar setUserRole={setUserRole} />
      )}
      {shouldShowSidebar && userRole === "STUDENT" && (
        <StudentSidebar setUserRole={setUserRole} />
      )}
      <div className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/" element={<Auth setUserRole={setUserRole} />} />
          <Route path="/signup" element={<Navigate to="/" replace />} />
          <Route path="/forget-password/reset" element={<ForgetPassword />} />

          {/* Student Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute userRole={userRole} allowedRoles={["STUDENT"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/submit-project"
            element={
              <ProtectedRoute userRole={userRole} allowedRoles={["STUDENT"]}>
                <SubmitProject />
              </ProtectedRoute>
            }
          />
          <Route
            path="/update-project"
            element={
              <ProtectedRoute userRole={userRole} allowedRoles={["STUDENT"]}>
                <UpdateProject />
              </ProtectedRoute>
            }
          />
          <Route
            path="/view-project"
            element={
              <ProtectedRoute userRole={userRole} allowedRoles={["STUDENT"]}>
                <ViewProjectStudent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute userRole={userRole} allowedRoles={["STUDENT"]}>
                <About />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute userRole={userRole} allowedRoles={["STUDENT", "ADMIN"]}>
                <StudentProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/batchmates"
            element={
              <ProtectedRoute userRole={userRole} allowedRoles={["STUDENT", "ADMIN"]}>
                <Batchmates />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/landingpage"
            element={
              <ProtectedRoute userRole={userRole} allowedRoles={["ADMIN"]}>
                <Landing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/create-batch"
            element={
              <ProtectedRoute userRole={userRole} allowedRoles={["ADMIN"]}>
                <CreateBatch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/create-subject"
            element={
              <ProtectedRoute userRole={userRole} allowedRoles={["ADMIN"]}>
                <CreateSubject />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/view-all"
            element={
              <ProtectedRoute userRole={userRole} allowedRoles={["ADMIN"]}>
                <ViewAll />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/review-project"
            element={
              <ProtectedRoute userRole={userRole} allowedRoles={["ADMIN"]}>
                <ProjectDetails />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={
              userRole ? (
                <div className="p-8 text-center text-xl font-semibold">
                  404 - Page Not Found
                </div>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
