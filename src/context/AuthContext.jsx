
import { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check if user is already logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  // Mock login function - will be replaced with actual API call
  const login = async (email, password) => {
    try {
      setLoading(true);
      // This would be an API call in production
      if (email === 'admin@example.com' && password === 'password') {
        const user = {
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin'
        };
        setCurrentUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        toast({
          title: "Login Successful",
          description: "Welcome back, Admin!",
        });
        return user;
      } else if (email && password) {
        const user = {
          id: '2',
          name: 'Regular User',
          email: email,
          role: 'user'
        };
        setCurrentUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        return user;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mock register function - will be replaced with actual API call
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      // This would be an API call in production
      if (name && email && password) {
        const user = {
          id: Math.floor(Math.random() * 1000).toString(),
          name,
          email,
          role: 'user'
        };
        setCurrentUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        toast({
          title: "Registration Successful",
          description: "Your account has been created!",
        });
        return user;
      } else {
        throw new Error('Please fill in all required fields');
      }
    } catch (error) {
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };
  
  // Reset error state
  const resetError = () => {
    setError(null);
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    resetError,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
