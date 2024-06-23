--import "./App.css";
import "../src/assets/css/style.scss";
import Dashboard from "./dashboard/dashboard";
import OTPVerify from "./auth/OTPVerify";
import SignUp from "./auth/signUp";
import ErrorMessage from "../errorMessage";
import ForgetPassword from "./auth/ForgetPassword";
import Login from "./auth/Login";
import { Route, Routes, Navigate } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";

function App() {
  const [toggleAuth, setToggleAuth] = useState(false);
  const { isSession } = useSelector((state) => state.auth);
  const isAuthenticated = isSession?.status || "";

  console.log("isAuthenticated", isAuthenticated);

  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/otp/verify"
        element={isAuthenticated ? <OTPVerify /> : <Navigate to="/login" />}
      />
      <Route
        path="/forgetpassword"
        element={
          isAuthenticated ? <ForgetPassword /> : <Navigate to="/login" />
        }
      />
    </Routes>
  );
}

export default App;
