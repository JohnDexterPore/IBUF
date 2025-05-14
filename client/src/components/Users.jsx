import React, { useEffect, useState } from "react";
import axios from "axios";

function Users() {
  const [fetchUsers, setFetchUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3001/getUsers")
      .then((res) => setFetchUsers(res.data))
      .catch((err) => console.error("Users fetch error:", err));
  }, []);

  const columnNames = fetchUsers.length > 0 ? Object.keys(fetchUsers[0]) : [];

  const filteredUsers = fetchUsers.filter((user) =>
    Object.values(user)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
        <input
          type="text"
          placeholder="Search..."
          className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="min-w-full border border-gray-200 shadow-md rounded-md overflow-hidden">
        <thead className="bg-blue-600 text-white">
          <tr>
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
                {columnNames.map((col) => (
                  <td key={col} className="px-6 py-4 text-sm text-gray-700">
                    {user[col]}
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
  );
}

export default Users;
