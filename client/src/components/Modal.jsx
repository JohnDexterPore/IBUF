import React from "react";

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl px-12 pt-12 pb-24 w-full md:w-1/2 lg:w-1/3 shadow-2xl gap-10 flex flex-col justify-center items-center border border-gray-200">
        <div className="flex flex-col gap-5 w-full">
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            Add User
          </h1>

          {/* Employee ID Section */}
          <div className="flex flex-col">
            <label
              htmlFor="employeeId"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Employee ID
            </label>
            <div className="flex justify-between items-center">
              <input
                id="employeeId"
                type="text"
                placeholder="Enter Employee ID"
                className="w-full border border-gray-300 rounded-l-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ height: "38px" }} // Ensure the height is consistent with the button
              />
              <button
                className="w-12 h-full px-4 py-2 bg-green-600 hover:bg-green-700 active:bg-green-800 transition-colors duration-200 rounded-r-md flex justify-center items-center focus:outline-none focus:ring-2 focus:ring-green-400"
                aria-label="Search"
                title="Search"
                style={{ height: "38px" }} // Match the button height to the input height
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="white"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 11.2489C2 6.14126 6.14154 2.00098 11.25 2.00098C16.3585 2.00098 20.5 6.14126 20.5 11.2489C20.5 13.5337 19.6713 15.6248 18.2981 17.2385L21.7791 20.7194C22.072 21.0123 22.072 21.4872 21.7791 21.7801C21.4862 22.073 21.0113 22.073 20.7184 21.7801L17.2371 18.2987C15.6235 19.6697 13.5334 20.4969 11.25 20.4969C6.14154 20.4969 2 16.3566 2 11.2489ZM11.25 4.99894C10.8358 4.99894 10.5 5.33473 10.5 5.74894C10.5 6.16316 10.8358 6.49894 11.25 6.49894C13.8742 6.49894 16.0013 8.62576 16.0013 11.2489C16.0013 11.6632 16.3371 11.9989 16.7513 11.9989C17.1655 11.9989 17.5013 11.6632 17.5013 11.2489C17.5013 7.79699 14.7023 4.99894 11.25 4.99894Z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Form Inputs Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col">
              <label
                htmlFor="fullName"
                className="mb-1 text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="Enter full name"
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
                htmlFor="phone"
                className="mb-1 text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                id="phone"
                type="text"
                placeholder="Enter phone number"
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row gap-5 w-full mt-8">
          <button className="w-full text-xl font-medium text-white rounded-lg px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md">
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
