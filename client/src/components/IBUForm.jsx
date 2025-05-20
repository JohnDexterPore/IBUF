import React, { useEffect, useState } from "react";
import axios from "axios";

const IBUForm = ({ showForm, setShowForm }) => {
  if (!showForm) return null;

  const [dropdowns, setDropdowns] = useState({
    priceTier: [],
    category: [],
    subCategory: [],
    coverage: [],
  });

  useEffect(() => {
    axios
      .get("http://localhost:3001/getDropdown")
      .then((res) => {
        const data = res.data;
        setDropdowns({
          priceTier: data.filter((item) => item.dropdown_name === "Price Tier"),
          category: data.filter((item) => item.dropdown_name === "Category"),
          subCategory: data.filter(
            (item) => item.dropdown_name === "Sub Category"
          ),
          coverage: data.filter(
            (item) => item.dropdown_name === "Coverage (Location)"
          ),
        });
      })
      .catch((err) => console.error("Dropdown fetch error:", err));
  }, []);

  const renderSelect = (id, label, options) => (
    <div>
      <label className="block text-sm font-semibold">{label}</label>
      <select
        id={id}
        className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        defaultValue=""
      >
        <option value="" disabled>
          Select {label}
        </option>
        {options.map((item, index) => (
          <option key={index} value={item.dropdown_select}>
            {item.dropdown_select}
          </option>
        ))}
      </select>
    </div>
  );

  const renderInput = (
    label,
    type = "text",
    readOnly = false,
    defaultValue = "",
    onChange = () => {}
  ) => (
    <div>
      <label className="block text-sm font-semibold">{label}</label>
      <input
        type={type}
        className="border-gray-300 w-full border rounded px-3 py-2 uppercase"
        readOnly={readOnly}
        defaultValue={defaultValue.toUpperCase()}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
      />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 h-screen w-screen">
      <div className="bg-white rounded-2xl px-12 pt-12 pb-12 w-11/12 lg:h-fit h-11/12 overflow-auto md:w-2/3 lg:w-2/3 shadow-2xl gap-10 border border-gray-200">
        <div className="flex flex-col gap-6 w-full">
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            ITEM BUILD-UP FORM
          </h1>

          {renderInput("Parent Item Description")}
          {renderInput("POS Txt")}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderInput(
              "Date Prepared",
              "date",
              true,
              new Date().toISOString().split("T")[0]
            )}
            {renderInput("Start Date", "date")}
            {renderInput("End Date", "date")}
            {renderSelect("priceTier", "Price Tier", dropdowns.priceTier)}
            {renderInput("Gross Price P", "number")}
            {renderInput("Delivery Price P", "number")}
            {renderSelect("category", "Category", dropdowns.category)}
            {renderSelect("subcategory", "Sub-Category", dropdowns.subCategory)}
            {renderSelect("coverage", "Coverage", dropdowns.coverage)}
          </div>

          <div>
            <label className="block text-sm font-semibold">Components</label>
            <textarea
              rows="3"
              className="border-gray-300 w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                "Dine-in",
                "Take out",
                "Delivery",
                "Bulk Order",
                "Events",
                "Corp Tie-ups",
              ].map((type) => (
                <label key={type} className="inline-flex items-center">
                  <input type="checkbox" className="mr-2" />
                  {type}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-5 w-full mt-8">
          <button
            onClick={() => {}}
            className="w-full text-xl font-medium text-white rounded-lg px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
          >
            Save
          </button>
          <button
            onClick={() => setShowForm(false)}
            className="w-full text-xl font-medium text-black rounded-lg px-6 py-3 bg-gray-300 hover:bg-gray-400 active:bg-gray-500 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default IBUForm;
