import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const Login = () => {
  const { login, loading, error, resetError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please fill in all required fields.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (role) => {
    setIsSubmitting(true);
    try {
      if (role === 'admin') {
        await login('admin@example.com', 'password');
      } else {
        await login('user@example.com', 'password');
      }
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Demo login failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-gray-600 mt-1">Sign in to your SuperMart account</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                resetError();
              }}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
              <Link to="/forgot-password" className="text-sm text-supermart-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  resetError();
                }}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="remember" 
              checked={rememberMe} 
              onCheckedChange={setRememberMe}
            />
            <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">Remember me</Label>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-supermart-primary hover:bg-supermart-dark"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-supermart-primary hover:underline">
              Create an account
            </Link>
          </p>
        </div>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or sign in with demo account</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <Button type="button" variant="outline" onClick={() => handleDemoLogin('user')} disabled={isSubmitting}>
              Demo User
            </Button>
            <Button type="button" variant="outline" onClick={() => handleDemoLogin('admin')} disabled={isSubmitting}>
              Demo Admin
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
