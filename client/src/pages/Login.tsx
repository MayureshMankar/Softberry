import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";

import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/lib/authStore";
import { apiRequest } from "@/lib/queryClient";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  token: string;
  message: string;
}

export default function Login() {
  const [, setLocation] = useLocation();
  const { colors } = useTheme();
  const { toast } = useToast();
  const { login } = useAuthStore();
  
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginCredentials): Promise<LoginResponse> => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      login(data.user, data.token);
      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.user.firstName}!`,
      });
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(credentials);
  };

  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: colors.background }}
    >
      <Card 
        className="w-full max-w-md shadow-xl border-0"
        style={{
          backgroundColor: `${colors.surface}80`,
          backdropFilter: 'blur(16px)'
        }}
      >
        <CardHeader className="space-y-1 pb-8">
          <CardTitle 
            className="text-3xl font-bold text-center bg-clip-text"
            style={{
              background: `linear-gradient(90deg, ${colors.accent}, ${colors.accent})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Welcome Back
          </CardTitle>
          <CardDescription 
            className="text-center"
            style={{ color: colors.text.secondary }}
          >
            Sign in to your Soft Berry Skincare account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label 
                htmlFor="email" 
                className="text-sm font-medium"
                style={{ color: colors.text.primary }}
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={credentials.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                style={{
                  backgroundColor: `${colors.surface}40`,
                  borderColor: `${colors.border}40`,
                  color: colors.text.primary,
                  borderWidth: '1px',
                  borderStyle: 'solid'
                }}
                className="h-11 focus:outline-none"
              />
            </div>
            
            <div className="space-y-2">
              <Label 
                htmlFor="password" 
                className="text-sm font-medium"
                style={{ color: colors.text.primary }}
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
                style={{
                  backgroundColor: `${colors.surface}40`,
                  borderColor: `${colors.border}40`,
                  color: colors.text.primary,
                  borderWidth: '1px',
                  borderStyle: 'solid'
                }}
                className="h-11 focus:outline-none"
              />
            </div>



            <Button
              type="submit"
              className="w-full h-11 font-medium transition-all duration-200"
              style={{
                background: `linear-gradient(90deg, ${colors.accent}, ${colors.accent})`,
                color: colors.background
              }}
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span 
                  className="w-full"
                  style={{
                    borderTop: `1px solid ${colors.border}`
                  }}
                />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span 
                  className="px-2"
                  style={{ 
                    backgroundColor: `${colors.surface}80`,
                    color: colors.text.secondary
                  }}
                >
                  Or
                </span>
              </div>
            </div>
            
            <p 
              className="text-sm"
              style={{ color: colors.text.secondary }}
            >
              Don't have an account?{" "}
              <Link href="/register">
                <a 
                  className="font-medium transition-colors"
                  style={{ color: colors.accent }}
                >
                  Create account
                </a>
              </Link>
            </p>
            
            <p 
              className="text-sm"
              style={{ color: colors.text.secondary }}
            >
              Continue as{" "}
              <Link href="/">
                <a 
                  className="font-medium transition-colors"
                  style={{ color: colors.accent }}
                >
                  Guest
                </a>
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
