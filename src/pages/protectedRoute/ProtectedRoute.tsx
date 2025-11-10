// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
// import type { ReactNode } from "react";

// interface ProtectedRouteProps {
//   children: ReactNode;
// }

export default function ProtectedRoute() {
  const isAuthenticated = localStorage.getItem("accessToken");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  } 

  return <><Outlet/></>;
}
