// src/pages/AuthCallback.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";

const AuthCallback = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleGoogleRedirect = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const credential = urlParams.get('credential');

      if (credential) {
        try {
          const userData = await fetchGoogleUserData(credential);
          await loginWithGoogle(userData);
          toast({
            title: "Logged in successfully",
            description: "Welcome back!",
          });
          navigate("/profile"); // Redirect to profile after login
        } catch (error) {
          toast({
            title: "Google login failed",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    };

    handleGoogleRedirect();
  }, [loginWithGoogle, navigate]);

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
      id: data.sub, // Google unique user ID
    };
  };

  return <div>Redirecting...</div>;
};

export default AuthCallback;
