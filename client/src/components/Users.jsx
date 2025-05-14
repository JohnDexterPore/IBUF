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
    <table className="table-auto w-full border-collapse border border-gray-300">
      <thead>
        <tr>
          {columnNames.map((col) => (
            <th key={col} className="border px-4 py-2 bg-gray-100 text-left">
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {fetchUsers.map((user, index) => (
          <tr key={index}>
            {columnNames.map((col) => (
              <td key={col} className="border px-4 py-2">
                {user[col]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Users;
