import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

const Register = () => {
  const { register, loading, error, resetError } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }

    resetError();
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
      isValid = false;
    }

    if (!formData.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    if (!agreeToTerms) {
      errors.terms = "You must agree to the Terms and Conditions";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.role
      );
      toast({
        title: "Account created successfully!",
        description: "You can now start shopping at SuperMart.",
      });
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔐 Google Sign-Up logic
  const handleGoogleLogin = async (response) => {
    const { credential } = response;
    try {
      const userData = await fetchGoogleUserData(credential);

      await register(userData.name, userData.email, userData.id, "user");

      toast({
        title: "Account created with Google!",
        description: "Welcome to SuperMart 🎉",
      });

      navigate("/login");
    } catch (error) {
      toast({
        title: "Google Sign-Up Failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const fetchGoogleUserData = async (token) => {
    const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch Google user data");
    }

    const data = await res.json();
    return {
      name: data.name,
      email: data.email,
      id: data.sub, // Use this as a unique pseudo-password
    };
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Create an Account</h1>
          <p className="text-gray-600 mt-1">
            Join SuperMart for fresh groceries delivered to your door
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />
            {formErrors.name && (
              <p className="text-red-500 text-sm">{formErrors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
            {formErrors.email && (
              <p className="text-red-500 text-sm">{formErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {formErrors.password && (
              <p className="text-red-500 text-sm">{formErrors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {formErrors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {formErrors.confirmPassword}
              </p>
            )}
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={agreeToTerms}
              onCheckedChange={setAgreeToTerms}
            />
            <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
              I agree to the{" "}
              <a href="#" className="text-supermart-primary hover:underline">
                Terms and Conditions
              </a>
            </Label>
          </div>
          {formErrors.terms && (
            <p className="text-red-500 text-sm">{formErrors.terms}</p>
          )}

          <Button
            type="submit"
            className="w-full bg-supermart-primary hover:bg-supermart-dark"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...
              </>
            ) : (
              "Register"
            )}
          </Button>
        </form>

        {/* Google Login */}
        <div className="mt-6">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => console.log("Google Login Failed")}
          />
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-supermart-primary hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
