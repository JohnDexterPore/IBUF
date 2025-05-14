import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "./Modal";
import Prompt from "./Prompt";
function Users() {
  const [fetchUsers, setFetchUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [isPromptOpen, setIsPromptOpen] = useState(false); // Prompt visibility state
  const [promptMessage, setPromptMessage] = useState(""); // Prompt message state
  const [updateTrigger, setUpdateTrigger] = useState(false); // State to trigger useEffect

  useEffect(() => {
    axios
      .get("http://localhost:3001/getUsers")
      .then((res) => setFetchUsers(res.data))
      .catch((err) => console.error("Users fetch error:", err));
  }, [updateTrigger]); // Add updateTrigger as a dependency

  const runEmailUpdate = () => {
    axios
      .get("http://localhost:3001/updateEmails")
      .then((res) => {
        console.log("Email update response:", res.data.message);
        setPromptMessage(res.data.message); // Set the prompt message
        setIsPromptOpen(true); // Open the prompt
        setUpdateTrigger((prev) => !prev); // Trigger the useEffect to re-fetch users
      })
      .catch((err) => {
        console.error("Email update request error:", err);
      });
  };

  const columnNames =
    fetchUsers.length > 0
      ? Object.keys(fetchUsers[0]).filter(
          (col) => col.toLowerCase() !== "password"
        )
      : [];

  const filteredUsers = fetchUsers.filter((user) =>
    Object.values(user)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="w-full h-full flex gap-10 flex-col">
      <div className="flex items-center justify-between h-1/12">
        <h1 className="text-3xl font-bold">Users</h1>
        <div className="flex gap-5 items-center">
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
            onClick={openModal}
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
        </div>
      </div>

      <div className="w-full overflow-auto h-11/12">
        <table className="min-w-full border border-gray-200 shadow-md rounded-md">
          <thead className="bg-gray-800 text-white sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                Actions
              </th>
              {columnNames.map((col) => (
                <th
                  key={col}
                  className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-100 transition-colors duration-200"
                >
                  <td className="px-6 py-3 text-sm text-gray-700 flex gap-2">
                    <button className="text-white font-bold px-2 py-2 rounded-4xl bg-green-500">
                      <svg
                        className="w-7 h-7 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                        viewBox="0 0 24 25"
                        fill="white"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path d="M15.5412 3.25H5.5C4.25736 3.25 3.25 4.25736 3.25 5.5V18.5C3.25 19.7426 4.25736 20.75 5.5 20.75H18.5C19.7426 20.75 20.75 19.7426 20.75 18.5V8.45825L17.3896 11.8187C16.7848 12.4234 15.9916 12.8033 15.1413 12.8953L13.3944 13.0843C12.7171 13.1576 12.0431 12.9201 11.5614 12.4383C11.0797 11.9566 10.8421 11.2826 10.9154 10.6053L11.1044 8.85838C11.1964 8.00813 11.5763 7.21487 12.181 6.61014L15.5412 3.25Z" />
                        <path d="M20.8748 2.51256C20.1914 1.82914 19.0833 1.82915 18.3999 2.51256L17.7143 3.19812L20.8016 6.28534L21.4871 5.59978C22.1705 4.91637 22.1705 3.80833 21.4871 3.12491L20.8748 2.51256Z" />
                        <path d="M19.7409 7.346L16.6537 4.25878L13.2417 7.6708C12.8788 8.03363 12.6509 8.50959 12.5957 9.01974L12.4067 10.7667C12.3823 10.9924 12.4614 11.2171 12.622 11.3777C12.7826 11.5382 13.0073 11.6174 13.233 11.593L14.9799 11.404C15.4901 11.3488 15.9661 11.1209 16.3289 10.758L19.7409 7.346Z" />
                      </svg>
                    </button>
                    <button className="text-white font-bold px-2 py-2 rounded-4xl bg-red-500">
                      <svg
                        className="w-7 h-7 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                        viewBox="0 0 24 25"
                        fill="white"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path d="M7.99902 4.25C7.99902 3.00736 9.00638 2 10.249 2H13.749C14.9917 2 15.999 3.00736 15.999 4.25V5H18.498C19.7407 5 20.748 6.00736 20.748 7.25C20.748 8.28958 20.043 9.16449 19.085 9.42267C18.8979 9.4731 18.7011 9.5 18.498 9.5H5.5C5.29694 9.5 5.10016 9.4731 4.91303 9.42267C3.95503 9.16449 3.25 8.28958 3.25 7.25C3.25 6.00736 4.25736 5 5.5 5H7.99902V4.25ZM14.499 5V4.25C14.499 3.83579 14.1632 3.5 13.749 3.5H10.249C9.83481 3.5 9.49902 3.83579 9.49902 4.25V5H14.499Z" />
                        <path d="M4.97514 10.4578L5.54076 19.8848C5.61205 21.0729 6.59642 22 7.78672 22H16.2113C17.4016 22 18.386 21.0729 18.4573 19.8848L19.0229 10.4578C18.8521 10.4856 18.6767 10.5 18.498 10.5H5.5C5.32131 10.5 5.146 10.4856 4.97514 10.4578ZM10.774 13.4339L10.9982 17.9905C11.0185 18.4042 10.6996 18.7561 10.2859 18.7764C9.8722 18.7968 9.52032 18.4779 9.49997 18.0642L9.27581 13.5076C9.25546 13.0938 9.57434 12.742 9.98805 12.7216C10.4018 12.7013 10.7536 13.0201 10.774 13.4339ZM14.0101 12.7216C14.4238 12.742 14.7427 13.0938 14.7223 13.5076L14.4982 18.0642C14.4778 18.4779 14.1259 18.7968 13.7122 18.7764C13.2985 18.7561 12.9796 18.4042 13 17.9905L13.2241 13.4339C13.2445 13.0201 13.5964 12.7013 14.0101 12.7216Z" />
                      </svg>
                    </button>
                  </td>
                  {columnNames.map((col) => (
                    <td key={col} className="px-6 py-4 text-sm text-gray-700">
                      {col === "AccountType"
                        ? user[col] === 0
                          ? "Admin"
                          : user[col] === 1
                          ? "Approver"
                          : user[col] === 2
                          ? "User"
                          : user[col]
                        : user[col]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columnNames.length}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Prompt
        message={promptMessage}
        isVisible={isPromptOpen}
        onAccept={() => setIsPromptOpen(false)}
      />
    </div>
  );
}

export default Users;
