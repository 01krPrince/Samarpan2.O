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
  const [loading, setLoading] = useState(false);

  // Redirect logic to avoid loops on logout/login
useEffect(() => {
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
  ];

  // Normalize the current path - with or without trailing slash
  const currentPath = location.pathname.replace(/\/+$/, "") || "/";

  if (!userRole) {
    // User is not logged in

    // If trying to access any protected route, redirect to "/"
    if (protectedPaths.includes(currentPath)) {
      navigate("/", { replace: true });
      return; // exit early to avoid multiple navigations
    }

    // Otherwise, allow access on public routes like "/" or "/login" or "/signup"
    // so do nothing here
    return;
  }

  // User is logged in

  // If user is on root "/" or "/login", redirect according to role
  if (currentPath === "/" || currentPath === "/login") {
    if (userRole === "ADMIN") {
      navigate("/landingpage", { replace: true });
    } else if (userRole === "STUDENT") {
      navigate("/dashboard", { replace: true });
    }
  } else if (!protectedPaths.includes(currentPath)) {
    // Optional: if logged user visits unknown/unhandled path (non-protected),
    // could redirect them to their default dashboard to avoid 404 confusion
    // This is optional, comment out if you don't want forced redirect
    if (userRole === "ADMIN") {
      navigate("/landingpage", { replace: true });
    } else if (userRole === "STUDENT") {
      navigate("/dashboard", { replace: true });
    }
  }
}, [userRole, location.pathname, navigate]);


  const hideSidebarRoutes = ["/", "/forget-password/reset"];

  const shouldShowSidebar = !hideSidebarRoutes.includes(location.pathname) && !!userRole;

  if (loading) {
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
          {/* Public / Auth */}
          <Route path="/" element={<Auth setUserRole={setUserRole} />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/signup" element={<Navigate to="/" replace />} />
          <Route path="/forget-password/reset" element={<ForgetPassword />} />

          {/* Student routes */}
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
              <ProtectedRoute
                userRole={userRole}
                allowedRoles={["STUDENT", "ADMIN"]}
              >
                <StudentProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/batchmates"
            element={
              <ProtectedRoute
                userRole={userRole}
                allowedRoles={["STUDENT", "ADMIN"]}
              >
                <Batchmates />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
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
