import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import Login from "./components/Login";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Users from "./components/Users";

function AppWrapper() {
  const location = useLocation();
  const hideNavbarPaths = ["/", "/admin"];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <div className="flex flex-row min-h-screen w-screen">
      {/* Sidebar / NavBar */}
      {shouldShowNavbar && (
        <div className="w-2/12 border-r border-gray-200">
          <NavBar />
        </div>
      )}

      {/* Main Content */}
      <div className="w-10/12 p-4">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <CookiesProvider>
      <BrowserRouter>
        <AppWrapper />
      </BrowserRouter>
    </CookiesProvider>
  );
}

export default App;
