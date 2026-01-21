import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ allowedRoles = [], redirectPath = "/unauthorized" }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // console.log("🔒 ProtectedRoute Debug:", { 
  //   path: location.pathname,
  //   user: user ? `${user.username} (${user.role})` : 'null',
  //   allowedRoles,
  //   isAllowed: allowedRoles.length === 0 ? true : allowedRoles.includes(user?.role)
  // });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!user) {
    // console.log("❌ Not authenticated, redirecting to login");
    // Save the current location so we can come back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If allowedRoles is empty, allow all authenticated users
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // console.log(`🚫 Access denied: User role ${user.role} not in allowed roles:`, allowedRoles);
    
    // If admin trying to access user route, redirect to admin
    if (user.role === 'admin' && location.pathname.includes('/user/')) {
      return <Navigate to="/admin" replace />;
    }
    // If user trying to access admin route, redirect to user dashboard
    else if (user.role === 'user' && location.pathname.includes('/admin/')) {
      return <Navigate to="/user/dashboard" replace />;
    }
    
    return <Navigate to={redirectPath} replace />;
  }

  // console.log("✅ Access granted to", location.pathname);
  return <Outlet />;
};

export default ProtectedRoute;