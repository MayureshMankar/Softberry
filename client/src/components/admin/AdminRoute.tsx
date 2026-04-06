import { useState, useEffect } from "react";
import { useLocation } from "wouter";

interface AdminRouteProps {
  component: React.ComponentType;
}

export default function AdminRoute({ component: Component }: AdminRouteProps) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Function to check admin status
    const checkAdminStatus = () => {
      const adminStatus = localStorage.getItem("isAdmin");
      if (adminStatus === "true") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        // Redirect to admin login if not authenticated
        setLocation("/admin/login");
      }
    };

    // Check immediately on component mount
    checkAdminStatus();

    // Listen for storage events to detect login/logout in other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "isAdmin") {
        checkAdminStatus();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Set up periodic check for admin status (every 30 seconds)
    const interval = setInterval(checkAdminStatus, 30000);

    // Clean up event listener and interval on component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [setLocation]);

  // If still checking auth status, show loading
  if (isAdmin === null) {
    console.log("Showing loading state"); // Debug log
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is admin, show the component
  if (isAdmin) {
    console.log("Rendering admin component:", Component.name); // Debug log
    return <Component />;
  }

  // If user is not admin, redirect handled by effect
  console.log("Not admin, redirecting"); // Debug log
  return null;
}