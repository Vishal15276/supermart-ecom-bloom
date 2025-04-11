import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3000/api/login", { email, password });

      const user = res.data.user;
      setCurrentUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", res.data.token);

      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.name}!`,
      });

      return user.role; // return the user's role so Login component can redirect
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: message,
      });
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3000/api/register", { name, email, password });

      const user = res.data.user;
      setCurrentUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", res.data.token);

      toast({
        title: "Registration Successful",
        description: "Your account has been created!",
      });

      return user;
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: message,
      });
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const resetError = () => setError(null);

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    resetError,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
