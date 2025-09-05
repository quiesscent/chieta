// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import React, { useEffect } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRoles?: ("employee" | "admin" | "company" | "executive")[];
}

export const ProtectedRoute = ({
  children,
  requiredRoles,
}: ProtectedRouteProps) => {
  const { toast } = useToast();

  // Parse user from localStorage
  const user = localStorage.getItem("user");

  useEffect(() => {
    if (!user) {
      toast({
        title: "Not Authenticated",
        description: "Kindly log in to continue.",
        variant: "destructive",
      });
    } else if (requiredRoles && !requiredRoles.includes(user.role)) {
      toast({
        title: "Unauthorized",
        description: "You do not have permission to access this page.",
        variant: "destructive",
      });
    }
  }, [user, requiredRoles, toast]);

  if (!user) {
    // Not logged in → redirect to login
    return <Navigate to="/" replace />;
  }

  if (requiredRoles && !requiredRoles.includes(user.role)) {
    // Logged in but wrong role → redirect
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
