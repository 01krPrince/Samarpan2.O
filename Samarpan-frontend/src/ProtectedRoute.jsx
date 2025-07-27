import { Navigate, useLocation } from "react-router-dom";

/**
 * Only renders children if the userRole is allowed.
 * Otherwise, redirects to /login (or to "/" if not allowed).
 */
export default function ProtectedRoute({ userRole, allowedRoles, children }) {
  const location = useLocation();

  // If not logged in, redirect to login (unless already on login)
  if (!userRole) {
    if (location.pathname === "/login") return children;
    return <Navigate to="/login" replace />;
  }

  // If logged in but not allowed, redirect to home (optional: could be a 403 page)
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  // Allowed, render the children
  return children;
}
