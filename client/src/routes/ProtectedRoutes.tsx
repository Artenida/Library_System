import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

type UserRole = "user" | "admin";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { token, user } = useAppSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
