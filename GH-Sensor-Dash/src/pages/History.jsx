import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "../assets/styles/Dashboard.css"; // Assuming Dashboard.css has common styles
import api from "../api/api";
import ResponsiveLineChart from "../components/ResponsiveLineChart";

const History = () => {
  // const Id = Cookies.get("SESSION_ID"); // Fetch session ID from cookies
  // const Navigate = useNavigate();

  // useEffect(() => {
  //   if (!Id) {
  //     alert("Session Expired!");
  //     Navigate("/");
  //   }
  // }, []);

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [latest, setLatest] = useState({
    temperature: 0,
    humidity: 0,
    ph: 0,
    distance: 0,
    tds: 0,
  });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchData = async () => {
    try {
      const response = await api.get("/user/thingspeak");
      const json = response.data;

      const feeds = json.feeds
        ? json.feeds.map((feed) => ({
            time: feed.created_at,
            temperature: parseFloat(feed.field1) || 0,
            humidity: parseFloat(feed.field2) || 0,
            ph: parseFloat(feed.field3) || 0,
            distance: parseFloat(feed.field4) || 0,
            tds: parseFloat(feed.field5?.trim()) || 0,
          }))
        : [];

      setData(feeds);

      if (feeds.length > 0) {
        const lastFeed = feeds[feeds.length - 1];
        setLatest({
          temperature: lastFeed.temperature,
          humidity: lastFeed.humidity,
          ph: lastFeed.ph,
          distance: lastFeed.distance,
          tds: lastFeed.tds,
        });
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const filterData = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      // Adjust end date to include the entire day
      end.setHours(23, 59, 59, 999);

      if (start > end) {
        alert("Invalid date range: Start date must be before end date.");
        setStartDate("");
        setEndDate("");
        return;
      }

      const filtered = data.filter((item) => {
        const itemDate = new Date(item.time);
        return itemDate >= start && itemDate <= end;
      });

      setFilteredData(filtered);
    } else {
      setFilteredData(data); // Show all data when no date is selected
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterData();
  }, [data, startDate, endDate]);

  return (
    <div className="flex flex-col">
      <div className="p-2 mx-4 md:mx-16 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 border rounded bg-white bg-opacity-30 backdrop-blur-md">
        <h1 className="text-3xl font-bold text-center md:text-left w-full md:w-auto">
          History
        </h1>
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
          <div className="flex flex-col">
            <label htmlFor="startDate" className="text-sm">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded p-1 h-4"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="endDate" className="text-sm">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded p-1 h-4"
            />
          </div>
        </div>
      </div>
      {/* Charts Section */}
      <div className="dashboard-container space-y-6 overflow-x-auto">
        {[
          {
            title: "Temperature (°C)",
            dataKey: "temperature",
            domain: [-5, 40],
            unit: "°C",
          },
          {
            title: "Humidity (%)",
            dataKey: "humidity",
            domain: [0, 100],
            unit: "%",
          },
          { title: "pH Level (pH)", dataKey: "ph", domain: [-5, 20] },
          {
            title: "Distance/Ultrasonic (m)",
            dataKey: "distance",
            domain: [15, 20],
          },
          { title: "TDS (ppm)", dataKey: "tds", domain: [0, 600], unit: "ppm" },
        ].map((chart, index) => (
          <div
            key={index}
            className="overflow-x-auto whitespace-nowrap p-4 border rounded-lg bg-white shadow"
          >
            <h3 className="frame-title font-bold text-lg mb-2">
              {chart.title}
            </h3>
            <ResponsiveLineChart
              data={filteredData}
              dataKey={chart.dataKey}
              domain={chart.domain}
              title={chart.title}
              unit={chart.unit}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
