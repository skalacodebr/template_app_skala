import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '../contexts/AuthContext';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const RouteGuard = ({ children, allowedRoles }: RouteGuardProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Show loading state if auth is still being determined
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If roles are specified and user doesn't have the required role
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  // If all checks pass, render the children
  return <>{children}</>;
};

export default RouteGuard;
