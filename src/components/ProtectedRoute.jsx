// src/components/ProtectedRoute.js
import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { auth } from "../firebase";
const ProtectedRoute = () => {
  return auth.currentUser ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
