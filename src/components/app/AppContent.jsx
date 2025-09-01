import { Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import Home from "../home/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { useAuth } from "../context/AuthContext";
import { Toaster } from "sonner";
import { Helmet } from "react-helmet";
import { useEffect } from "react";
import ProtectedRoute from '../app/ProtectedRoute'

const AppContent = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getRouteName = (route) => {
    switch (route) {
      case "/":
        return { title: "PayPulse | Home" };
      case "/dashboard":
        return { title: `PayPulse | ${user?.name}` || `My Dashboard` };
      case "/login":
        return { title: "PayPulse | Login" };
      case "/register":
        return { title: "PayPulse | Register" };
      default:
        return { title: "PayPulse" };
    }
  };

  useEffect(() => {
    getRouteName(location.pathname);
  }, [location])

  const { title } = getRouteName(location.pathname);

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />


        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <Dashboard />
            </ProtectedRoute>
          }
        />




      </Routes>
    </>
  );
};

export default AppContent;
