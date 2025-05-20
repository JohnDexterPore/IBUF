import React, { useState, useEffect } from "react";
import axios from "axios";
import Prompt from "./Prompt";
import { useCookies } from "react-cookie";

const Modal = ({
  isOpen,
  onClose,
  setUpdateTrigger,
  setPromptMessage,
  setIsPromptOpen,
  mode = "new",
  user = null,
}) => {
  if (!isOpen) return null;
  const [employeeId, setEmployeeId] = useState("");
  const [fetchEmployees, setFetchEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [cookies] = useCookies(["user"]);

  const fetchEmployeeData = async (employeeId) => {
    axios
      .get("http://localhost:3001/getExternalUsers/" + employeeId)
      .then((res) => setFetchEmployees(res.data))
      .catch((err) => console.error("Companies fetch error:", err));
  };

  useEffect(() => {
    if (employeeId) {
      fetchEmployeeData(employeeId);
    }
  }, [employeeId]);

  useEffect(() => {
    if (mode === "edit" && user) {
      setEmployeeId(user.employee_id);
      setSelectedEmployee({
        EmployeeID: user.employee_id,
        FirstName: user.first_name,
        LastName: user.last_name,
        JobTitle: user.job_title,
        Department: user.department,
        EmailAddress: user.email,
      });
      // Populate the form fields with the user data
      document.getElementById("employeeId").value = user.employee_id || "";
      document.getElementById("firstName").value = user.first_name || "";
      document.getElementById("lastName").value = user.last_name || "";
      document.getElementById("jobTitle").value = user.job_title || "";
      document.getElementById("department").value = user.department || "";
      document.getElementById("email").value = user.email || "";
      document.getElementById("accountType").value =
        user.account_type !== undefined ? user.account_type.toString() : "";
      document.getElementById("password").value = "";
    } else if (mode === "new") {
      setEmployeeId("");
      setSelectedEmployee(null);
      // Clear form fields
      document.getElementById("firstName").value = "";
      document.getElementById("lastName").value = "";
      document.getElementById("jobTitle").value = "";
      document.getElementById("department").value = "";
      document.getElementById("email").value = "";
      document.getElementById("accountType").value = "";
      document.getElementById("password").value = "";
    }
  }, [mode, user]);

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
    setUpdateTrigger((prev) => !prev);
  };

  const handleSubmit = () => {
    if (mode === "edit") {
      axios
        .put("http://localhost:3001/updateUser", {
          employee_id: employeeId,
          account_type: document.getElementById("accountType").value,
          first_name: document.getElementById("firstName").value,
          last_name: document.getElementById("lastName").value,
          job_title: document.getElementById("jobTitle").value,
          department: document.getElementById("department").value,
          email: document.getElementById("email").value,
          password: document.getElementById("password").value,
          user_id: cookies.user.EmployeeID,
        })
        .then(() => {
          setPromptMessage("User updated successfully!");
          setIsPromptOpen(true);
          setUpdateTrigger((prev) => !prev);
          onClose();
        })
        .catch((err) => console.error("Update-user error:", err));
    } else {
      axios
        .post("http://localhost:3001/addUser", {
          employee_id: employeeId,
          account_type: document.getElementById("accountType").value,
          first_name: document.getElementById("firstName").value,
          last_name: document.getElementById("lastName").value,
          job_title: document.getElementById("jobTitle").value,
          department: document.getElementById("department").value,
          email: document.getElementById("email").value,
          password: document.getElementById("password").value,
          user_id: cookies.user.EmployeeID,
        })
        .then(() => {
          /* ▲ POST was successful ― now tell <Users> to refetch */
          setPromptMessage("User added successfully!");
          setIsPromptOpen(true);
          setUpdateTrigger((prev) => !prev);
          onClose();
        })
        .catch((err) => console.error("Add-user error:", err));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overflow-auto h-screen w-screen">
      <div className="bg-white rounded-2xl px-12 pt-12 pb-12 w-11/12 h-10/12 lg:h-fit md:h-fit overflow-auto md:w-2/3 lg:w-1/3 shadow-2xl gap-10 border border-gray-200">
        <div className="flex flex-col gap-5 w-full">
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            {mode === "edit" ? "Edit User" : "Add User"}
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
                disabled={mode === "edit"}
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
              >
                <option value="" disabled>
                  Select Account Type
                </option>
                <option value={0}>Admin</option>
                <option value={1}>Approver</option>
                <option value={2}>User</option>
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
