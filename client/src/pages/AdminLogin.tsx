import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { Loader2 } from "lucide-react";

export default function AdminLogin() {
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Simple client-side validation for admin credentials
      // In a real application, this would be done server-side
      if (email === "admin@example.com" && password === "admin123") {
        // Store admin status in localStorage
        localStorage.setItem("isAdmin", "true");
        // Also dispatch a storage event to notify other tabs
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'isAdmin',
          newValue: 'true'
        }));
        // Redirect to admin dashboard
        setLocation("/admin");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Check if already logged in
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    console.log("Checking if already logged in:", isAdmin); // Debug log
    if (isAdmin === "true") {
      setLocation("/admin");
    }
  }, [setLocation]);

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: colors.background }}
    >
      <Card 
        className="w-full max-w-md"
        style={{ 
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
        }}
      >
        <CardHeader className="text-center">
          <CardTitle 
            className="font-serif text-2xl"
            style={{ color: colors.text.primary }}
          >
            Admin Login
          </CardTitle>
          <CardDescription style={{ color: colors.text.secondary }}>
            Sign in to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div 
                className="p-3 rounded-md text-sm"
                style={{ 
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  color: "#ef4444",
                  border: "1px solid #ef4444"
                }}
              >
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label 
                htmlFor="email" 
                className="text-sm font-medium"
                style={{ color: colors.text.primary }}
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ 
                  backgroundColor: colors.background,
                  color: colors.text.primary,
                  borderColor: colors.border,
                }}
              />
            </div>
            <div className="space-y-2">
              <label 
                htmlFor="password" 
                className="text-sm font-medium"
                style={{ color: colors.text.primary }}
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="admin123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ 
                  backgroundColor: colors.background,
                  color: colors.text.primary,
                  borderColor: colors.border,
                }}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              style={{
                backgroundColor: colors.accent,
                color: colors.background,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.accentHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.accent;
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}