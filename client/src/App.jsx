import React from "react";
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

  // Fullscreen layout (e.g., Login page)
  if (!shouldShowNavbar) {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        {/* Add more fullscreen routes if needed */}
      </Routes>
    );
  }

  // Layout with sidebar for authenticated views
  return (
    <div className="flex flex-row h-screen w-screen">
      <div className="w-2/12">
        <NavBar />
      </div>
      <div className="w-10/12 h-full max-w-full p-10 overflow-hidden">
        <Routes>
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
