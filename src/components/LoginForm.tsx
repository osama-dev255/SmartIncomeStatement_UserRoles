import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Lock, User, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
// Import Supabase auth service
import { signIn } from "@/services/authService";

interface LoginFormProps {
  onLogin: (credentials: { username: string; password: string }) => void;
  onNavigate?: (destination: string) => void;
}

export const LoginForm = ({ onLogin, onNavigate }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "success",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Try Supabase authentication first
      const result = await signIn(email, password);
      
      if (result.error) {
        // Handle specific email confirmation error
        if (result.error.message && result.error.message.includes('Email not confirmed')) {
          toast({
            title: "Email Confirmation Required",
            description: "Please check your email and click the confirmation link before logging in.",
            variant: "success",
          });
          setIsLoading(false);
          return;
        }
        
        // Show error message instead of falling back to mock authentication
        toast({
          title: "Authentication Error",
          description: "Failed to authenticate. Please check your credentials and try again.",
          variant: "success",
        });
        setIsLoading(false);
        return;
      } else {
        // Supabase auth successful
        console.log("Supabase auth successful:", result);
        onLogin({ username: email, password });
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast({
        title: "Error",
        description: "Authentication failed. Please try again.",
        variant: "success",
      });
      setIsLoading(false);
    }
  };

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Sign Up button clicked, onNavigate:", onNavigate);
    if (onNavigate) {
      console.log("Calling onNavigate with 'register'");
      onNavigate("register");
    } else {
      console.log("onNavigate not available, using fallback hash navigation");
      // Fallback to hash-based navigation
      window.location.hash = "#register";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 relative login-form">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center pb-4 sm:pb-6">
          <div className="mx-auto mb-3 sm:mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-primary">
            <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold">Kilango Group</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Sign in to access your business dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-6 sm:pb-8">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 py-5 sm:py-6 text-sm sm:text-base"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm sm:text-base">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 py-5 sm:py-6 text-sm sm:text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full h-10 sm:h-12 text-sm sm:text-base"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-muted">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Don't have an account? Create one to get started
              </p>
              <Button 
                variant="link"
                className="text-primary hover:underline px-0 signup-link"
                onClick={handleRegisterClick}
              >
                Sign Up
              </Button>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <Button variant="link" className="text-sm">
              Haki zote zimehifadhiwa  🌍
            </Button>
          </div>
          
          {/* Debug element to ensure the section is visible */}
          <div className="mt-2 text-center text-xs text-muted-foreground">
            v1.0.0
          </div>
        </CardContent>
      </Card>
    </div>
  );
};