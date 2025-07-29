// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "@/components/ui/provider"
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider> {/* ✅ No error - uses default theme */}
      <BrowserRouter>
        <AuthProvider>
          <App />
          <ToastContainer position="top-center" autoClose={3000} />
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
