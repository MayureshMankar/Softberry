import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/authStore";
import { useEffect } from "react";

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export function useAuth() {
  const { user, token, isAuthenticated, login, setUser, logout } = useAuthStore();
  
  const { data: fetchedUser, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
    enabled: !!token, // Only fetch if we have a token
  });

  // Update user data when fetched from server
  useEffect(() => {
    if (fetchedUser && fetchedUser._id && fetchedUser._id !== 'guest-user') {
      setUser(fetchedUser);
    }
  }, [fetchedUser, setUser]);

  // If token exists but API call fails with 401, logout
  useEffect(() => {
    if (error && error.message.includes('401') && token) {
      logout();
    }
  }, [error, token, logout]);

  return {
    user: token ? user : fetchedUser, // Use stored user if token exists, otherwise use guest
    isLoading,
    isAuthenticated: isAuthenticated && !!token,
    token,
    login,
    logout,
  };
}