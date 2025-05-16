import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "./Modal";
import Prompt from "./Prompt";
import Alert from "./Alert";

function Users({
  searchTerm,
  setSearchTerm,
  openModal,
  runEmailUpdate,
  updateTrigger,
  setUpdateTrigger,
  setPromptMessage,
  setIsPromptOpen,
  handleDelete,
  showAlert,
  alertMessage,
  onConfirm,
  onCancel,
  isModalOpen,
  setIsModalOpen,
  selectedUser,
  onAddEditSuccess,
  isPromptOpen,
  promptMessage,
}) {
  const [fetchUsers, setFetchUsers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/getUsers")
      .then((res) => setFetchUsers(res.data))
      .catch((err) => console.error("Users fetch error:", err));
  }, [updateTrigger]); // Add updateTrigger as a dependency

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

  const formatDateTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const formattedDate = date.toISOString().split("T")[0];
    const formattedTime = date.toTimeString().split(" ")[0]; // HH:MM:SS
    return `${formattedDate}\n${formattedTime}`;
  };

  return (
    <div className="w-full h-full flex gap-5 flex-col">
      <div className="rounded-2xl overflow-auto shadow-md border border-gray-200 h-full">
        <table className="min-w-full">
          <thead className="bg-gray-800 text-white sticky top-0 rounded-2xl">
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
                    <button
                      id={"delete " + index}
                      onClick={() => handleDelete(user.employee_id)}
                      className="text-white font-bold px-2 py-2 rounded-4xl bg-red-500"
                    >
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
                    <button
                      id={"edit " + index}
                      onClick={() => openModal(user)}
                      className="text-white font-bold px-2 py-2 rounded-4xl bg-green-500"
                    >
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
                        : col.toLowerCase().includes("date") ||
                          col.toLowerCase().includes("time")
                        ? formatDateTime(user[col])
                        : user[col]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columnNames.length + 1}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        setUpdateTrigger={setUpdateTrigger}
        setPromptMessage={setPromptMessage}
        setIsPromptOpen={setIsPromptOpen}
        mode={selectedUser ? "edit" : "new"}
        user={selectedUser}
        onAddEditSuccess={onAddEditSuccess}
      />

      <Prompt
        message={promptMessage}
        isVisible={isPromptOpen}
        onAccept={() => setIsPromptOpen(false)}
      />

      <Alert
        message={alertMessage}
        onConfirm={onConfirm}
        onCancel={onCancel}
        showAlert={showAlert}
      />
    </div>
  );
}

export default Users;
