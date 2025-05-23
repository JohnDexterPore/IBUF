import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import Alert from "./Alert";

function NavBar() {
  const [cookies, , removeCookie] = useCookies(["user"]);
  const [fetchCompanies, setFetchCompanies] = useState([]);
  const [navigationItems, setNavigationItems] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication on load
  useEffect(() => {
    if (!cookies.user) {
      console.log("Redirecting because user cookie is missing");
      navigate("/");
    } else {
      axios
        .get("http://localhost:3001/getCompanies")
        .then((res) => setFetchCompanies(res.data))
        .catch((err) => console.error("Companies fetch error:", err));

      axios
        .get(`http://localhost:3001/getNavigation/${cookies.user.AccountType}`)
        .then((res) => setNavigationItems(res.data))
        .catch((err) => console.error("Navigation fetch error:", err));
    }
  }, [cookies, navigate]);
  

  const handleSignOut = () => setShowAlert(true);
  const handleProceed = () => {
    removeCookie("user", { path: "/" });
    navigate("/");
  };
  const handleCancel = () => setShowAlert(false);

  const isActive = (path) =>
    location.pathname.toLowerCase() === path.toLowerCase();

  return (
    <>
      <button
        data-drawer-target="logo-sidebar"
        data-drawer-toggle="logo-sidebar"
        aria-controls="logo-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>
      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-800">
          {/* Company Logo */}
          <div className="flex justify-center items-center ps-2.5 h-1/12">
            {fetchCompanies.map((company, index) => (
              <React.Fragment key={company.company_id || index}>
                <img
                  src={company.logo_address}
                  className="lg:h-13 me-5 h-7"
                  alt={company.company_name}
                />
              </React.Fragment>
            ))}
          </div>

          {/* Navigation Links */}
          <ul className="flex flex-col h-11/12 space-y-2 font-medium pt-5">
            {cookies.user && cookies.user.FirstName && (
              <p className="text-center text-xl p-3 mb-10 rounded-lg group transition-colors bg-gray-200 text-blue-700 dark:bg-gray-700 dark:text-white">
                {cookies.user.FirstName}
              </p>
            )}

            {navigationItems.map((nav, index) => (
              <li key={index}>
                <a
                  href={nav.nav_link}
                  className={`flex items-center p-2 rounded-lg group transition-colors ${
                    isActive(nav.nav_link)
                      ? "bg-gray-200 text-blue-700 dark:bg-gray-700 dark:text-white"
                      : "text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  }`}
                >
                  <svg
                    className="w-7 h-7 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    viewBox="0 0 24 25"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    dangerouslySetInnerHTML={{ __html: nav.nav_svg }}
                  />
                  <span className="ms-3 whitespace-nowrap">{nav.nav_name}</span>
                </a>
              </li>
            ))}

            {/* Signout Button */}
            <li className="mt-auto">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  viewBox="0 0 24 25"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M11.25 2.62451C10.0074 2.62451 9 3.63187 9 4.87451V6.60927C9.76128 6.98704 10.2493 7.76589 10.2493 8.62451V10.3745L11.75 10.3745C12.9926 10.3745 14 11.3819 14 12.6245C14 13.8672 12.9926 14.8745 11.75 14.8745H10.2493V16.6245C10.2493 17.4831 9.76128 18.262 9 18.6397V20.3745C9 21.6172 10.0074 22.6245 11.25 22.6245H17.25C18.4926 22.6245 19.5 21.6172 19.5 20.3745V4.87451C19.5 3.63187 18.4926 2.62451 17.25 2.62451H11.25Z" />
                  <path d="M8.28618 7.93158C8.5665 8.04764 8.74928 8.32114 8.74928 8.62453L8.74928 11.8745L11.75 11.8745C12.1642 11.8745 12.5 12.2103 12.5 12.6245C12.5 13.0387 12.1642 13.3745 11.75 13.3745L8.74928 13.3745V16.6245C8.74928 16.9279 8.56649 17.2014 8.28617 17.3175C8.00585 17.4335 7.68322 17.3693 7.46877 17.1547L3.50385 13.187C3.34818 13.0496 3.25 12.8485 3.25 12.6245C3.25 12.4016 3.34723 12.2015 3.50159 12.0641L7.46878 8.09437C7.68324 7.87978 8.00587 7.81552 8.28618 7.93158Z" />
                </svg>
                <span className="ms-3 whitespace-nowrap">Sign Out</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>

      <Alert
        showAlert={showAlert}
        onConfirm={handleProceed}
        onCancel={handleCancel}
        message="Are you sure you want to Sign out?"
      />
    </>
  );
}

export default NavBar;
