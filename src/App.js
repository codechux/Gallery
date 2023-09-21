import React from "react";
import "./App.css";
import Login from "./components/Login";
import { Route, Routes } from "react-router-dom";
import Gallery from "./components/Gallery";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/gallery" element={<Gallery />} />
        </Route>
        <Route path="/" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;
