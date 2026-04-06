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

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterResponse {
  user: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  token: string;
  message: string;
}

export default function Register() {
  const [, setLocation] = useLocation();
  const { colors } = useTheme();
  const { toast } = useToast();
  const { login } = useAuthStore();
  
  const [formData, setFormData] = useState<RegisterData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<string[]>([]);

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.firstName.trim()) {
      newErrors.push("First name is required");
    }

    if (!formData.lastName.trim()) {
      newErrors.push("Last name is required");
    }

    if (!formData.email.trim()) {
      newErrors.push("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.push("Please enter a valid email address");
    }

    if (!formData.password) {
      newErrors.push("Password is required");
    } else if (formData.password.length < 6) {
      newErrors.push("Password must be at least 6 characters long");
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.push("Passwords do not match");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const registerMutation = useMutation({
    mutationFn: async (data: Omit<RegisterData, 'confirmPassword'>): Promise<RegisterResponse> => {
      const response = await apiRequest("POST", "/api/auth/register", data);
      return response.json();
    },
    onSuccess: (data) => {
      login(data.user, data.token);
      toast({
        title: "Registration Successful",
        description: `Welcome to Soft Berry Skincare, ${data.user.firstName}!`,
      });
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const { confirmPassword, ...registrationData } = formData;
    registerMutation.mutate(registrationData);
  };

  const handleInputChange = (field: keyof RegisterData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ backgroundColor: colors.background }}
    >
      <Card 
        className="w-full max-w-md shadow-xl border-0"
        style={{
          backgroundColor: `${colors.surface}80`,
          backdropFilter: 'blur(16px)'
        }}
      >
        <CardHeader className="space-y-1 pb-6">
          <CardTitle 
            className="text-3xl font-bold text-center bg-clip-text"
            style={{
              background: `linear-gradient(90deg, ${colors.accent}, ${colors.accent})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Join Soft Berry Skincare
          </CardTitle>
          <CardDescription 
            className="text-center"
            style={{ color: colors.text.secondary }}
          >
            Create your account to explore our luxury skincare and beauty
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label 
                  htmlFor="firstName" 
                  className="text-sm font-medium"
                  style={{ color: colors.text.primary }}
                >
                  First Name
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
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
                  htmlFor="lastName" 
                  className="text-sm font-medium"
                  style={{ color: colors.text.primary }}
                >
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
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
            </div>

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
                value={formData.email}
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
                placeholder="Create a password"
                value={formData.password}
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
            
            <div className="space-y-2">
              <Label 
                htmlFor="confirmPassword" 
                className="text-sm font-medium"
                style={{ color: colors.text.primary }}
              >
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
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

            {(errors.length > 0 || registerMutation.error) && (
              <div 
                className="rounded-md p-4"
                style={{
                  backgroundColor: `${colors.accent}10`,
                  border: `1px solid ${colors.accent}40`
                }}
              >
                <div 
                  className="text-sm"
                  style={{ color: colors.accent }}
                >
                  {errors.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  ) : (
                    (registerMutation.error as any)?.message || "Registration failed. Please try again."
                  )}
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 font-medium transition-all duration-200"
              style={{
                background: `linear-gradient(90deg, ${colors.accent}, ${colors.accent})`,
                color: colors.background
              }}
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? "Creating Account..." : "Create Account"}
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
              Already have an account?{" "}
              <Link href="/login">
                <a 
                  className="font-medium transition-colors"
                  style={{ color: colors.accent }}
                >
                  Sign in
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
