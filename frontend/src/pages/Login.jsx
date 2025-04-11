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
  const [isAdmin, setIsAdmin] = useState(false); // toggle between user/admin

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
      const role = await login(email, password); // returns the user's role from context

      // Redirect based on role
      if (role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">{isAdmin ? "Admin Login" : "Welcome Back"}</h1>
          <p className="text-gray-600 mt-1">
            {isAdmin
              ? "Sign in to your SuperMart admin panel"
              : "Sign in to your SuperMart account"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{isAdmin ? "Admin Email" : "Email"}</Label>
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
              {!isAdmin && (
                <Link
                  to="/forgot-password"
                  className="text-sm text-supermart-primary hover:underline"
                >
                  Forgot password?
                </Link>
              )}
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
            <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
              Remember me
            </Label>
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
          {!isAdmin ? (
            <>
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="text-supermart-primary hover:underline">
                  Create an account
                </Link>
              </p>
              <p className="mt-2 text-sm">
                Are you an admin?{" "}
                <button
                  onClick={() => {
                    setIsAdmin(true);
                    resetError();
                  }}
                  className="text-supermart-primary hover:underline"
                >
                  Switch to Admin Login
                </button>
              </p>
            </>
          ) : (
            <p className="text-sm">
              Not an admin?{" "}
              <button
                onClick={() => {
                  setIsAdmin(false);
                  resetError();
                }}
                className="text-supermart-primary hover:underline"
              >
                Switch to User Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
