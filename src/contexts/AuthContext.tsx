import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "student" | "trainer" | "admin" | "super_admin";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatar?: string;
  enrolledCourses?: string[];
  completedCourses?: string[];
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

interface SignupData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for UI development
const mockUsers: Record<string, User & { password: string }> = {
  "student@codemande.com": {
    id: "1",
    email: "student@codemande.com",
    fullName: "Jean Baptiste",
    role: "student",
    password: "student123",
    enrolledCourses: ["software-dev", "data-science"],
    completedCourses: [],
    createdAt: new Date().toISOString(),
  },
  "trainer@codemande.com": {
    id: "2",
    email: "trainer@codemande.com",
    fullName: "Marie Claire",
    role: "trainer",
    password: "trainer123",
    createdAt: new Date().toISOString(),
  },
  "admin@codemande.com": {
    id: "3",
    email: "admin@codemande.com",
    fullName: "Emmanuel Kwizera",
    role: "admin",
    password: "admin123",
    createdAt: new Date().toISOString(),
  },
  "superadmin@codemande.com": {
    id: "4",
    email: "superadmin@codemande.com",
    fullName: "Sarah Uwimana",
    role: "super_admin",
    password: "super123",
    createdAt: new Date().toISOString(),
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem("codemande_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("codemande_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const mockUser = mockUsers[email.toLowerCase()];
    
    if (!mockUser || mockUser.password !== password) {
      setIsLoading(false);
      throw new Error("Invalid email or password");
    }
    
    const { password: _, ...userData } = mockUser;
    setUser(userData);
    localStorage.setItem("codemande_user", JSON.stringify(userData));
    setIsLoading(false);
  };

  const signup = async (data: SignupData) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    if (mockUsers[data.email.toLowerCase()]) {
      setIsLoading(false);
      throw new Error("An account with this email already exists");
    }
    
    // Create new student user
    const newUser: User = {
      id: Date.now().toString(),
      email: data.email,
      fullName: data.fullName,
      role: "student",
      enrolledCourses: [],
      completedCourses: [],
      createdAt: new Date().toISOString(),
    };
    
    setUser(newUser);
    localStorage.setItem("codemande_user", JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("codemande_user");
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("codemande_user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
