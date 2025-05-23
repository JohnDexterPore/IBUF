import React from "react";
import IBUForm from "./IBUForm";

function Ongoing({ showForm, setShowForm }) {
  return (
    <div className="w-full h-full flex gap-5 flex-col">
      <div className="rounded-2xl overflow-auto shadow-md border border-gray-200 h-full">
        
      </div>
      <IBUForm showForm={showForm} setShowForm={setShowForm} />
    </div>
  );
}

export default Ongoing;
