import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import Login from "./components/Login";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Users from "./components/Users";
import Ongoing from "./components/Ongoing";
import axios from "axios";

function AppWrapper() {
  const location = useLocation();
  const hideNavbarPaths = ["/", "/admin"];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);
  const pathName = window.location.pathname; // e.g., "/dashboard/users"
  const segments = pathName.split("/").filter(Boolean); // removes empty strings

  // Join with space and make it sentence case
  const rawText = segments.join(" "); // "dashboard users"
  const sentenceCase =
    rawText.charAt(0).toUpperCase() + rawText.slice(1).toLowerCase();

  // State and handlers moved from Users.jsx
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [selectedUser, setSelectedUser] = useState(null); // User data for editing
  const [isPromptOpen, setIsPromptOpen] = useState(false); // Prompt visibility state
  const [promptMessage, setPromptMessage] = useState(""); // Prompt message state
  const [updateTrigger, setUpdateTrigger] = useState(false); // State to trigger useEffect
  const [showAlert, setShowAlert] = useState(false); // Alert visibility state
  const [alertMessage, setAlertMessage] = useState(""); // Alert message state
  const [userId, setUserId] = useState(""); // State to store user ID for deletion

  // Handlers moved from Users.jsx
  const runEmailUpdate = () => {
    axios
      .get("http://localhost:3001/updateEmails")
      .then((res) => {
        setPromptMessage(res.data.message); // Set the prompt message
        setIsPromptOpen(true); // Open the prompt
        setUpdateTrigger((prev) => !prev); // Trigger the useEffect to re-fetch users
      })
      .catch((err) => {
        setPromptMessage(
          err.response?.data?.message || "Error updating emails"
        ); // Set the prompt message
        setIsPromptOpen(true); // Open the prompt
        setUpdateTrigger((prev) => !prev); // Trigger the useEffect to re-fetch users
      });
  };

  const openModal = (user = null) => {
    if (user) {
      setSelectedUser(user);
    } else {
      setSelectedUser(null);
    }
    setIsModalOpen(true);
  };

  const handleDelete = (userId) => {
    setUserId(userId); // Store the user ID to be deleted
    setAlertMessage("Are you sure you want to delete this user?");
    setShowAlert(true);
  };

  const onConfirm = () => {
    axios
      .delete(`http://localhost:3001/deleteUser/${userId}`)
      .then(() => {
        setPromptMessage("User deleted successfully!");
        setIsPromptOpen(true);
        setUpdateTrigger((prev) => !prev); // refresh user list
      })
      .catch((err) => {
        console.error("User deletion error:", err);
      });

    setShowAlert(false);
  };

  const onCancel = () => {
    setShowAlert(false);
  };

  // Add handlers for add and edit success to show prompt
  const onAddEditSuccess = (message) => {
    setPromptMessage(message);
    setIsPromptOpen(true);
    setUpdateTrigger((prev) => !prev);
  };

  // Dynamic buttons and search input based on route
  let buttons = null;
  if (location.pathname === "/users") {
    buttons = (
      <>
        <button
          onClick={runEmailUpdate}
          className="text-white font-bold h-12 px-4 rounded-md bg-blue-500 flex items-center justify-center"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 25 24"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M7.17466 4.46302C8.83368 3.19001 10.8664 2.5 12.9575 2.5C15.0487 2.5 17.0814 3.19001 18.7404 4.46302C19.7896 5.26807 20.6522 6.27783 21.2815 7.42228L23.0527 6.92706C23.3449 6.84538 23.6575 6.94772 23.8447 7.18637C24.032 7.42502 24.0571 7.75297 23.9082 8.0173L22.1736 11.0983C22.076 11.2717 21.9136 11.3991 21.722 11.4527C21.5304 11.5063 21.3254 11.4815 21.1521 11.3839L18.0714 9.64919C17.8071 9.50036 17.6584 9.20697 17.6948 8.90582C17.7311 8.60466 17.9453 8.35506 18.2374 8.27338L19.7901 7.83927C19.2797 7.00108 18.6161 6.25835 17.8273 5.65305C16.4302 4.58106 14.7185 4 12.9575 4C11.1966 4 9.48486 4.58106 8.08781 5.65305C6.69076 6.72504 5.68647 8.22807 5.2307 9.92901C5.1235 10.3291 4.71225 10.5665 4.31215 10.4593C3.91205 10.3521 3.67461 9.94088 3.78182 9.54078C4.32304 7.52089 5.51565 5.73603 7.17466 4.46302Z" />
            <path d="M4.18603 12.5458C4.3776 12.4922 4.58261 12.517 4.75594 12.6146L7.83665 14.3493C8.10096 14.4981 8.2496 14.7915 8.21325 15.0927C8.17691 15.3938 7.96274 15.6434 7.6706 15.7251L6.1265 16.1568C6.63702 16.9958 7.30106 17.7392 8.09052 18.345C9.48757 19.417 11.1993 19.998 12.9602 19.998C14.7212 19.998 16.4329 19.417 17.83 18.345C19.227 17.273 20.2313 15.77 20.6871 14.069C20.7943 13.6689 21.2055 13.4315 21.6056 13.5387C22.0057 13.6459 22.2432 14.0572 22.136 14.4573C21.5947 16.4771 20.4021 18.262 18.7431 19.535C17.0841 20.808 15.0514 21.498 12.9602 21.498C10.8691 21.498 8.8364 20.808 7.17738 19.535C6.12761 18.7295 5.26458 17.719 4.63517 16.5738L2.85527 17.0714C2.56313 17.1531 2.25055 17.0507 2.06329 16.8121C1.87603 16.5734 1.85096 16.2455 1.99978 15.9812L3.73441 12.9001C3.832 12.7268 3.99445 12.5993 4.18603 12.5458Z" />
          </svg>
        </button>

        <button
          onClick={() => openModal()}
          className="text-white font-bold h-12 px-4 rounded-md bg-green-500 flex items-center"
        >
          Add User
        </button>

        <input
          type="text"
          placeholder="Search..."
          className="h-12 border border-gray-300 rounded-md px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </>
    );
  } else if (location.pathname === "/ongoing") {
    buttons = (
      <button
        onClick={() => alert("Ongoing button clicked")}
        className="text-white font-bold h-12 px-4 rounded-md bg-purple-500 flex items-center"
      >
        Ongoing Action
      </button>
    );
  } else {
    buttons = null;
  }

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
        <div className="w-full h-full flex gap-10 flex-col">
          <div className="flex items-center justify-between pb-5 h-1/12 border-b-3 border-b-gray-200">
            <h1 className="text-3xl font-bold">{sentenceCase}</h1>
            <div className="flex gap-2 items-center">{buttons}</div>
          </div>

          <div className="rounded-2xl overflow-auto shadow-md border border-gray-200 h-11/12">
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route
                path="/users"
                element={
                  <Users
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    openModal={openModal}
                    runEmailUpdate={runEmailUpdate}
                    updateTrigger={updateTrigger}
                    setUpdateTrigger={setUpdateTrigger}
                    setPromptMessage={setPromptMessage}
                    setIsPromptOpen={setIsPromptOpen}
                    handleDelete={handleDelete}
                    showAlert={showAlert}
                    alertMessage={alertMessage}
                    onConfirm={onConfirm}
                    onCancel={onCancel}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    selectedUser={selectedUser}
                    onAddEditSuccess={onAddEditSuccess}
                    isPromptOpen={isPromptOpen}
                    promptMessage={promptMessage}
                  />
                }
              />
              <Route path="/ongoing" element={<Ongoing />} />
            </Routes>
          </div>
        </div>
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
