import React from "react";
import { Link } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { RiDashboard2Line } from "react-icons/ri";
import Logo from "../../assets/images/greenhouse.png";

const TopNavbar = () => {
  return (
    <div
      className="w-full flex items-center justify-between px-6 py-3 shadow-md"
      style={{ backgroundColor: "#00b7ff" }}
    >
      {/* Logo and Name */}
      <div className="flex items-center space-x-3">
        <Link to="/" className="flex flex-rowv items-center">
          <img
            src={Logo}
            alt="Greenhouse Logo"
            className="w-8 h-8 object-contain"
          />
          <span className="text-white text-sm md:text-lg font-semibold">
            Greenhouse Sensor
          </span>
        </Link>
      </div>

      {/* Profile Menu and Signout Button */}
      <div className="flex items-center space-x-4">
        <Link
          to={location.pathname === "/htr" ? "/" : "/htr"} // Change link dynamically
          className="text-white hover:bg-blue-600 px-4 py-2 rounded-md text-sm font-medium flex items-center"
        >
          {location.pathname === "/htr" ? (
            <RiDashboard2Line className="text-sm md:text-2xl" />
          ) : (
            <RxDashboard className="text-sm md:text-2xl" />
          )}
          <span className="hidden md:inline ml-2">
            {location.pathname === "/htr" ? "Dashboard" : "History"}
          </span>
        </Link>

        {/* <button className="text-white bg-blue-900 px-4 py-2 rounded-md text-sm font-medium flex items-center">
          <IoPersonCircleOutline className="text-sm md:text-2xl" />
          <span className="hidden md:inline ml-2">Authorized</span>
        </button>

        <button
          className="text-white hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium flex items-center"
          onClick={handleSignOut}
        >
          <AiOutlineLogout className="text-sm md:text-2xl" />
          <span className="hidden md:inline ml-2">Sign Out</span>
        </button> */}
      </div>
    </div>
  );
};

export default TopNavbar;
