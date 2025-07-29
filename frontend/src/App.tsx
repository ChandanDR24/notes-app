import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./context/AuthContext";
import { Spinner, Flex } from "@chakra-ui/react";

const App = () => {
  const { isAuthenticated, login, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const name = params.get("name");
    const email = params.get("email");

    if (token && name && email) {
      login(token, name, email);
      navigate("/dashboard", { replace: true });
    }
  }, [location.search, login, navigate]);

  // 🔐 Wait until AuthContext finishes token check
  if (loading) {
    return (
      <Flex minH="100vh" justify="center" align="center" bg="white">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
      />
    </Routes>
  );
};

export default App;
