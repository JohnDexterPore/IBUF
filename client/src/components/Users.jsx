import React, { useEffect, useState } from "react";
import axios from "axios";

function Users() {
  const [fetchUsers, setFetchUsers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/getUsers")
      .then((res) => setFetchUsers(res.data))
      .catch((err) => console.error("Users fetch error:", err));
  }, []);

  const columnNames = fetchUsers.length > 0 ? Object.keys(fetchUsers[0]) : [];

  return (
    <div className="overflow-x-auto">
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
          {fetchUsers.map((user, index) => (
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
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Users;
