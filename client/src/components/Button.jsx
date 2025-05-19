import React from "react";

function Button({ clicked, path, text, color }) {
  return (
    <button
      onClick={clicked}
      className={`${color} text-white font-bold h-12 px-4 rounded-md flex items-center justify-center gap-2`}
    >
      <svg
        width="25"
        height="25"
        viewBox="0 0 25 24"
        fill="white"
        xmlns="http://www.w3.org/2000/svg"
      >
        {path}
      </svg>
      <p className="hidden sm:block">{text}</p>
    </button>
  );
}

export default Button;
