import React, { useState, useEffect } from "react";
import axios from "axios";

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const [employeeId, setEmployeeId] = useState("");
  const [fetchEmployees, setFetchEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [updateTrigger, setUpdateTrigger] = useState(false); // State to trigger useEffect

  useEffect(() => {
    axios
      .get("http://localhost:3001/getUsers")
      .then((res) => setFetchUsers(res.data))
      .catch((err) => console.error("Users fetch error:", err));
  }, [updateTrigger]); // Add updateTrigger as a dependency

  const fetchEmployeeData = async (employeeId) => {
    axios
      .get("http://localhost:3001/getExternalUsers/" + employeeId)
      .then((res) => setFetchEmployees(res.data))
      .catch((err) => console.error("Companies fetch error:", err));
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setEmployeeId(value);

    const selected = fetchEmployees.find((emp) => emp.EmployeeID === value);
    if (selected) {
      setSelectedEmployee(selected);
      // Populate the form fields with the selected employee's data
      document.getElementById("firstName").value = selected.FirstName;
      document.getElementById("lastName").value = selected.LastName;
      document.getElementById("jobTitle").value = selected.JobTitle;
      document.getElementById("department").value = selected.Department;
      document.getElementById("email").value = selected.EmailAddress;
    }
  };

  const handleSubmit = () => {
    axios.post("http://localhost:3001/addUser", {
      EmployeeID: document.getElementById("employeeId").value,
      AccountType: document.getElementById("accountType").value,
      FirstName: document.getElementById("firstName").value,
      LastName: document.getElementById("lastName").value,
      JobTitle: document.getElementById("jobTitle").value,
      Department: document.getElementById("department").value,
      Email: document.getElementById("email").value,
      Password: document.getElementById("password").value,
    });
    setUpdateTrigger((prev) => !prev);
  };

  useEffect(() => {
    if (employeeId) {
      fetchEmployeeData(employeeId);
    }
  }, [employeeId]);

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl px-12 pt-12 pb-24 w-full md:w-1/2 lg:w-1/3 shadow-2xl gap-10 flex flex-col justify-center items-center border border-gray-200">
        <div className="flex flex-col gap-5 w-full">
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            Add User
          </h1>

          {/* Form Inputs Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col">
              <label
                htmlFor="employeeId"
                className="mb-1 text-sm font-medium text-gray-700"
              >
                Employee ID
              </label>
              <input
                id="employeeId"
                type="number"
                name="dummy-employee-field"
                placeholder="Enter Employee ID"
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ height: "38px" }} // Ensure the height is consistent with the button
                onChange={handleChange}
                list="accountTypeList"
              />
              <datalist id="accountTypeList">
                {fetchEmployees.slice(0, 10).map((employee, index) => (
                  <option key={index} value={employee.EmployeeID}>
                    {employee.EmployeeID}
                  </option>
                ))}
              </datalist>
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="accountType"
                className="mb-1 text-sm font-medium text-gray-700"
              >
                Account Type
              </label>
              <select
                id="accountType"
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue=""
              >
                <option value="" disabled>
                  Select Account Type
                </option>
                <option value="0">Admin</option>
                <option value="1">Approver</option>
                <option value="2">User</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="firstName"
                className="mb-1 text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                placeholder="Enter first name"
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="lastName"
                className="mb-1 text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                placeholder="Enter last name"
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="jobTitle"
                className="mb-1 text-sm font-medium text-gray-700"
              >
                Job Title
              </label>
              <input
                id="jobTitle"
                type="text"
                placeholder="Enter job title"
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="department"
                className="mb-1 text-sm font-medium text-gray-700"
              >
                Department
              </label>
              <input
                id="department"
                type="text"
                placeholder="Enter department"
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="mb-1 text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter email"
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="password"
                className="mb-1 text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter password"
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row gap-5 w-full mt-8">
          <button
            onClick={() => {
              handleSubmit();
              onClose();
            }}
            className="w-full text-xl font-medium text-white rounded-lg px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
          >
            Save
          </button>
          <button
            onClick={() => onClose()}
            className="w-full text-xl font-medium text-black rounded-lg px-6 py-3 bg-gray-300 hover:bg-gray-400 active:bg-gray-500 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
export default Modal;
