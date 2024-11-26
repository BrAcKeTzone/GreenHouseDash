import React from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "../assets/styles/Dashboard.css";
import { baseUrl, frames } from "../Data/frames";
import { useEffect } from "react";

const Dashboard = () => {
  const Id = Cookies.get("SESSION_ID");
  const Navigate = useNavigate();

  useEffect(() => {
    if (!Id) {
      alert("Session Expired!");
      Navigate("/");
    }
  }, []);

  const handleExport = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col">
      <div className="p-2 mx-4 md:mx-16 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 border rounded bg-white bg-opacity-30 backdrop-blur-md">
        <h1 className="text-3xl font-bold text-center md:text-left w-full md:w-auto">
          Dashboard
        </h1>
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
          <h3 className="text-center md:text-left">Export dataset:</h3>
          <div className="flex flex-row justify-center space-x-2 text-green-800 font-bold">
            <button
              className="hover:text-green-500"
              onClick={() => handleExport(`${baseUrl}/feeds.json`)}
            >
              JSON
            </button>
            <button
              className="hover:text-green-500"
              onClick={() => handleExport(`${baseUrl}/feeds.xml`)}
            >
              XML
            </button>
            <button
              className="hover:text-green-500"
              onClick={() => handleExport(`${baseUrl}/feeds.csv`)}
            >
              CSV
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-container">
        {frames.map((frame, index) => (
          <div key={index} className="frame-container">
            <h3 className="frame-title">{frame.title}</h3>
            <iframe
              className="frame"
              src={frame.src}
              title={frame.title}
            ></iframe>
            <div className="flex justify-evenly space-x-2 text-green-700 font-bold mt-2">
              <button
                className="hover:text-white"
                onClick={() => handleExport(frame.exportUrls.json)}
              >
                JSON
              </button>
              <button
                className="hover:text-white"
                onClick={() => handleExport(frame.exportUrls.xml)}
              >
                XML
              </button>
              <button
                className="hover:text-white"
                onClick={() => handleExport(frame.exportUrls.csv)}
              >
                CSV
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
