import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import Login from "./components/Login";
import NavBar from "./components/NavBar";
import Inbox from "./components/Inbox";
import Users from "./components/Users";
import Ongoing from "./components/Ongoing";
import ViewForm from "./components/ViewForm";
import axios from "axios";
import "./App.css";
import Search from "./components/Search";
import Button from "./components/Button";

function AppWrapper() {
  const location = useLocation();
  const hideNavbarPaths = ["/", "/admin"];
  const pathName = location.pathname; // e.g., "/dashboard/users"
  const shouldShowNavbar = !hideNavbarPaths.includes(pathName);
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
  const [userId, setUserId] = useState(""); // State to store user0 ID for deletion
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showForm, setShowForm] = useState(false);

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
  const buttonConfig = {
    "/inbox": [
      {
        text: "Mark All Read",
        color: "bg-blue-500",
        icon: (
          <>
            <path d="M9.125 12.375C9.125 10.7872 10.4122 9.5 12 9.5C13.5878 9.5 14.875 10.7872 14.875 12.375C14.875 13.9628 13.5878 15.25 12 15.25C10.4122 15.25 9.125 13.9628 9.125 12.375Z" />
            <path d="M15.8751 14.9999C15.8751 14.5857 16.2109 14.2499 16.6251 14.2499C17.0393 14.2499 17.3751 14.5857 17.3751 14.9999V15.8749H18.2502C18.6644 15.8749 19.0002 16.2107 19.0002 16.6249C19.0002 17.0391 18.6644 17.3749 18.2502 17.3749H17.3751V18.25C17.3751 18.6643 17.0393 19 16.6251 19C16.2109 19 15.8751 18.6643 15.8751 18.25V17.3749H15C14.5858 17.3749 14.25 17.0391 14.25 16.6249C14.25 16.2107 14.5858 15.8749 15 15.8749H15.8751V14.9999Z" />
            <path d="M2.27757 11.1101C3.97429 7.43132 7.68801 4.875 11.9999 4.875C16.3119 4.875 20.0256 7.43133 21.7223 11.1101C22.0924 11.9125 22.0924 12.8377 21.7223 13.6402C20.0256 17.3189 16.3119 19.8752 11.9999 19.8752C7.68801 19.8752 3.97428 17.3189 2.27757 13.6402C1.90748 12.8377 1.90748 11.9125 2.27757 11.1101ZM7.625 12.375C7.625 14.7912 9.58375 16.75 12 16.75C14.4162 16.75 16.375 14.7912 16.375 12.375C16.375 9.95875 14.4162 8 12 8C9.58375 8 7.625 9.95875 7.625 12.375Z" />
          </>
        ),
      },
    ],
    "/ongoing": [
      {
        text: "New Item",
        color: "bg-blue-500",
        clicked: () => {
          setShowForm(true);
        },
        icon: (
          <>
            <path d="M4.5 19.75V9.75084H10.0004C11.2436 9.75084 12.2512 8.74244 12.2504 7.49924L12.2474 2H17.25C18.4926 2 19.5 3.00736 19.5 4.25V10.3782C18.6253 9.97492 17.6514 9.75 16.625 9.75C12.828 9.75 9.75 12.828 9.75 16.625C9.75 18.8006 10.7606 20.7403 12.338 22H6.75C5.50736 22 4.5 20.9926 4.5 19.75Z" />
            <path d="M10.5262 2.65951C10.5961 2.58957 10.6701 2.52471 10.7477 2.46516L10.7504 7.5003C10.7507 7.91473 10.4148 8.25084 10.0004 8.25084H4.96533C5.02455 8.1737 5.08902 8.10008 5.15851 8.03055L10.5262 2.65951Z" />
            <path d="M16.625 11.25C13.6565 11.25 11.25 13.6565 11.25 16.625C11.25 19.5935 13.6565 22 16.625 22C19.5935 22 22 19.5935 22 16.625C22 13.6565 19.5935 11.25 16.625 11.25ZM16.6251 14.2498C17.0393 14.2498 17.3751 14.5855 17.3751 14.9998V15.8748H18.2502C18.6644 15.8748 19.0002 16.2106 19.0002 16.6248C19.0002 17.039 18.6644 17.3748 18.2502 17.3748H17.3751V18.2499C17.3751 18.6642 17.0393 18.9999 16.6251 18.9999C16.2109 18.9999 15.8751 18.6642 15.8751 18.2499V17.3748H15C14.5858 17.3748 14.25 17.039 14.25 16.6248C14.25 16.2106 14.5858 15.8748 15 15.8748H15.8751V14.9998C15.8751 14.5855 16.2109 14.2498 16.6251 14.2498Z" />
          </>
        ),
      },
      "search", // special keyword to insert search
    ],
    "/users": [
      {
        text: "Update Email",
        color: "bg-blue-500",
        clicked: runEmailUpdate,
        icon: (
          <>
            <path d="M11.9985 2.50098C9.90741 2.50098 7.8747 3.19099 6.21568 4.464C4.55666 5.737 3.36406 7.52186 2.82283 9.54175C2.71563 9.94185 2.95306 10.3531 3.35316 10.4603C3.75326 10.5675 4.16451 10.3301 4.27172 9.92998C4.72749 8.22904 5.73177 6.72602 7.12882 5.65403C8.52587 4.58203 10.2376 4.00098 11.9985 4.00098C13.7595 4.00098 15.4712 4.58203 16.8683 5.65403C17.6571 6.25932 18.3207 7.00205 18.8311 7.84024L17.2784 8.27435C16.9863 8.35603 16.7721 8.60564 16.7358 8.90679C16.6994 9.20794 16.8481 9.50134 17.1124 9.65017L20.1931 11.3849C20.3664 11.4825 20.5714 11.5072 20.763 11.4537C20.9546 11.4001 21.117 11.2727 21.2146 11.0993L22.9492 8.01828C23.0981 7.75395 23.073 7.426 22.8857 7.18735C22.6985 6.9487 22.3859 6.84636 22.0938 6.92804L20.3225 7.42325C19.6932 6.27881 18.8306 5.26905 17.7814 4.464C16.1224 3.19099 14.0897 2.50098 11.9985 2.50098Z" />
            <path d="M10.7858 12.0876C9.54953 12.0876 8.54738 13.0898 8.54738 14.326V15.2562C8.54738 15.6704 8.88317 16.0062 9.29738 16.0062H14.7024C15.1166 16.0062 15.4524 15.6704 15.4524 15.2562V14.326C15.4524 13.0898 14.4503 12.0876 13.2141 12.0876H10.7858Z" />
            <path d="M3.79695 12.6155C3.62362 12.5179 3.41862 12.4932 3.22704 12.5467C3.03547 12.6003 2.87301 12.7278 2.77542 12.9011L1.0408 15.9821C0.891979 16.2465 0.917043 16.5744 1.1043 16.8131C1.29157 17.0517 1.60414 17.1541 1.89629 17.0724L3.67618 16.5747C4.30559 17.72 5.16861 18.7305 6.21839 19.536C7.87741 20.809 9.91012 21.499 12.0013 21.499C14.0924 21.499 16.1251 20.809 17.7841 19.536C19.4431 18.263 20.6358 16.4781 21.177 14.4582C21.2842 14.0581 21.0468 13.6469 20.6467 13.5397C20.2466 13.4325 19.8353 13.6699 19.7281 14.07C19.2723 15.7709 18.268 17.274 16.871 18.346C15.4739 19.418 13.7622 19.999 12.0013 19.999C10.2403 19.999 8.52859 19.418 7.13154 18.346C6.34208 17.7402 5.67803 16.9968 5.16752 16.1578L6.71162 15.7261C7.00375 15.6444 7.21793 15.3948 7.25427 15.0936C7.29061 14.7925 7.14198 14.4991 6.87766 14.3502L3.79695 12.6155Z" />
            <path d="M10.385 9.86061C10.385 8.96867 11.1081 8.24561 12 8.24561H12.0054C12.8973 8.24561 13.6204 8.96867 13.6204 9.86061C13.6204 10.7525 12.8973 11.4756 12.0054 11.4756H12C11.1081 11.4756 10.385 10.7525 10.385 9.86061Z" />
          </>
        ),
      },
      {
        text: "Add User",
        color: "bg-green-500",
        clicked: openModal,
        icon: (
          <>
            <path d="M15.3289 11.4955C14.4941 11.4955 13.724 11.2188 13.1051 10.7522C13.3972 10.3301 13.6284 9.86262 13.786 9.36254C14.1827 9.7539 14.7276 9.99545 15.3289 9.99545C16.5422 9.99545 17.5258 9.01185 17.5258 7.79851C17.5258 6.58517 16.5422 5.60156 15.3289 5.60156C14.7276 5.60156 14.1827 5.84312 13.786 6.23449C13.6284 5.73441 13.3972 5.26698 13.1051 4.84488C13.7239 4.37824 14.4941 4.10156 15.3289 4.10156C17.3706 4.10156 19.0258 5.75674 19.0258 7.79851C19.0258 9.84027 17.3706 11.4955 15.3289 11.4955Z" />
            <path d="M14.7723 13.1891C15.0227 13.437 15.2464 13.6945 15.4463 13.9566C16.7954 13.9826 17.7641 14.3143 18.4675 14.7651C19.2032 15.2366 19.6941 15.8677 20.0242 16.5168C20.3563 17.1698 20.5204 17.8318 20.6002 18.337C20.6398 18.5878 20.6579 18.795 20.6661 18.9365C20.6702 19.0071 20.6717 19.061 20.6724 19.0952L20.6726 19.1161L20.6727 19.1313L20.6727 19.1363L21.4197 19.1486C20.6793 19.1358 20.6728 19.136 20.6727 19.1363L20.6727 19.1376C20.6666 19.5509 20.9961 19.8914 21.4096 19.8985C21.8237 19.9057 22.1653 19.5758 22.1725 19.1617L21.4284 19.1488C22.1725 19.1617 22.1725 19.1621 22.1725 19.1617L22.1725 19.1599L22.1726 19.1575L22.1726 19.1511L22.1727 19.1319C22.1727 19.1163 22.1726 19.0951 22.1721 19.0686C22.1712 19.0158 22.1689 18.9419 22.1636 18.85C22.153 18.6665 22.1303 18.4094 22.0819 18.1029C21.9856 17.4936 21.7848 16.6697 21.3612 15.8368C20.9357 15 20.2801 14.1451 19.2768 13.5022C18.2708 12.8574 16.9604 12.4549 15.274 12.4549C14.8284 12.4549 14.4092 12.483 14.0148 12.5362C14.2852 12.7384 14.5376 12.9566 14.7723 13.1891Z" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.13173 7.79855C5.13173 5.75678 6.7869 4.1016 8.82867 4.1016C10.8704 4.1016 12.5256 5.75678 12.5256 7.79855C12.5256 9.84031 10.8704 11.4955 8.82867 11.4955C6.7869 11.4955 5.13173 9.84031 5.13173 7.79855ZM8.82867 5.6016C7.61533 5.6016 6.63173 6.58521 6.63173 7.79855C6.63173 9.01189 7.61533 9.99549 8.82867 9.99549C10.042 9.99549 11.0256 9.01189 11.0256 7.79855C11.0256 6.58521 10.042 5.6016 8.82867 5.6016Z"
            />
            <path d="M3.37502 19.1374C3.38126 19.5507 3.0517 19.8914 2.63812 19.8986C2.22397 19.9058 1.88241 19.5759 1.87522 19.1617L2.62511 19.1487C1.87522 19.1617 1.87523 19.1621 1.87522 19.1617L1.87519 19.1599L1.87516 19.1575L1.87509 19.1511L1.875 19.1319C1.87499 19.1163 1.87512 19.0951 1.87559 19.0687C1.87653 19.0158 1.87882 18.942 1.88413 18.85C1.89474 18.6665 1.91745 18.4094 1.96585 18.103C2.0621 17.4936 2.26292 16.6697 2.68648 15.8368C3.11206 15 3.76758 14.1452 4.77087 13.5022C5.77688 12.8575 7.08727 12.455 8.77376 12.455C10.4602 12.455 11.7706 12.8575 12.7767 13.5022C13.7799 14.1452 14.4355 15 14.861 15.8368C15.2846 16.6697 15.4854 17.4936 15.5817 18.103C15.6301 18.4094 15.6528 18.6665 15.6634 18.85C15.6687 18.942 15.671 19.0158 15.6719 19.0687C15.6724 19.0951 15.6725 19.1163 15.6725 19.1319L15.6724 19.1511L15.6724 19.1575L15.6723 19.1599C15.6723 19.1603 15.6723 19.1617 14.9282 19.1488L15.6723 19.1617C15.6651 19.5759 15.3235 19.9058 14.9094 19.8986C14.4959 19.8914 14.1664 19.5509 14.1725 19.1376L14.1725 19.1364C14.1726 19.1361 14.1791 19.1358 14.9199 19.1487L14.1725 19.1364L14.1725 19.1314L14.1724 19.1161L14.1722 19.0952C14.1716 19.061 14.17 19.0072 14.1659 18.9366C14.1577 18.7951 14.1396 18.5878 14.1 18.337C14.0202 17.8319 13.8561 17.1699 13.524 16.5168C13.1939 15.8677 12.703 15.2366 11.9673 14.7651C11.2343 14.2954 10.2132 13.955 8.77376 13.955C7.33434 13.955 6.31319 14.2954 5.58022 14.7651C4.84453 15.2366 4.35363 15.8677 4.02351 16.5168C3.6914 17.1699 3.52727 17.8319 3.44749 18.337C3.40787 18.5878 3.38981 18.7951 3.38163 18.9366C3.37756 19.0072 3.37596 19.061 3.37536 19.0952C3.37505 19.1123 3.375 19.1245 3.375 19.1314L3.37502 19.1374Z" />
          </>
        ),
      },
    ],
  };

  const renderButtons = (route) => {
    const configs = buttonConfig[route] || [];

    return configs.map((btn, idx) => {
      if (btn === "search") {
        return (
          <Search
            key="search"
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            showMobileSearch={showMobileSearch}
            setShowMobileSearch={setShowMobileSearch}
          />
        );
      }

      return (
        <Button
          key={idx}
          text={btn.text}
          color={btn.color}
          clicked={btn.clicked}
          path={btn.icon}
        />
      );
    });
  };

  const buttons = <>{renderButtons(pathName)}</>;

  // Fullscreen layout (e.g., Login page)
  if (!shouldShowNavbar) {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    );
  }

  return (
    <div className="lg:ml-64 md:ml-44">
      <div className="h-screen p-6 overflow-hidden">
        <NavBar />

        <div className="w-full h-full flex flex-col gap-10">
          {/* Header section */}
          <div className="flex items-center justify-between pb-5 h-[10%] border-b-4 border-b-gray-200 w-full">
            <h1 className="text-3xl font-bold w-1/3">
              {"IBUF - " + sentenceCase}
            </h1>
            <div className="w-2/3 flex flex-wrap gap-2 sm:gap-4 items-center justify-end">
              {buttons}
            </div>
          </div>

          {/* Main content with scrollable Routes */}
          <div className="h-[90%] rounded-2xl overflow-hidden shadow-md border border-gray-200 flex-grow">
            <Routes>
              <Route path="/inbox" element={<Inbox />} />
              <Route
                path="/ongoing"
                element={
                  <Ongoing
                    searchTerm={searchTerm}
                    updateTrigger={updateTrigger}
                    setUpdateTrigger={setUpdateTrigger}
                    showForm={showForm}
                    setShowForm={setShowForm}
                  />
                }
              />
              <Route
                path="/users"
                element={
                  <Users
                    searchTerm={searchTerm}
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
