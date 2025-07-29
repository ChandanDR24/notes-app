// src/context/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import axios from "axios";

type AuthContextType = {
  isAuthenticated: boolean;
  name: string;
  email: string;
  loading: boolean;
  login: (token: string, name: string, email: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedName = localStorage.getItem("name");
    const savedEmail = localStorage.getItem("email");

    if (token && savedName && savedEmail) {
      setIsAuthenticated(true);
      setName(savedName);
      setEmail(savedEmail);
      setLoading(false);
    } else {
      axios
        .post("http://localhost:5000/api/auth/refresh-token", {}, { withCredentials: true })
        .then((res) => {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("name", res.data.name);
          localStorage.setItem("email", res.data.email);
          setIsAuthenticated(true);
          setName(res.data.name);
          setEmail(res.data.email);
        })
        .catch(() => {
          setIsAuthenticated(false);
          setName("");
          setEmail("");
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const login = (token: string, userName: string, userEmail: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("name", userName);
    localStorage.setItem("email", userEmail);
    setIsAuthenticated(true);
    setName(userName);
    setEmail(userEmail);
  };

  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setName("");
    setEmail("");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, name, email, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
