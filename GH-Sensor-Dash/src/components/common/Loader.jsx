import React from "react";
import "../../assets/styles/loader.css";

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen w-screen z-50 fixed bg-gray-500 bg-opacity-50">
      <div className="loader bg-opacity-100"></div>
    </div>
  );
};

export default Loader;
