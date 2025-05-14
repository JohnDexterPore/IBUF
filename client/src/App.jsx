import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import Login from "./components/Login";
import Home from "./components/Home";
import Companies from "./components/Companies";
import NavBar from "./components/NavBar";

function AppWrapper() {
  const location = useLocation();
  const hideNavbarPaths = ["/", "/Companies", "/admin"];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);


  return (
    <>
      {shouldShowNavbar && <NavBar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/companies" element={<Companies />} />
      </Routes>
    </>
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
