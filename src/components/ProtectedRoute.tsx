// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import { useToast } from "@/hooks/use-toast";
import React, { useEffect } from "react";
interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRole?: ("employee" | "admin" | "company" | "executive")[];
}

export const ProtectedRoute = ({
  children,
  requiredRole,
}: ProtectedRouteProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  if (!user) {
    useEffect(() => {
      toast({
        title: "Not Authenticated",
        description: "Kindly log in to continue.",
        variant: "destructive",
      });
    }, []);
    // Not logged in → redirect to login/auth
    return <Navigate to="/" replace />;
  }

  if (requiredRoles && !requiredRoles.includes(user.role)) {
    useEffect(() => {
      toast({
        title: "Unauthorized",
        description: "You do not have permission to access this page.",
        variant: "destructive",
      });
    }, []);

    // Logged in but wrong role → redirect
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
