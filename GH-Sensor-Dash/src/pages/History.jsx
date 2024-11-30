import React, { useState, useEffect } from "react";
import "../assets/styles/Dashboard.css";
import api from "../api/api";
import ResponsiveLineChart from "../components/ResponsiveLineChart";

const History = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [latest, setLatest] = useState({
    temperature: 0,
    humidity: 0,
    ph: 0,
    distance: 0,
    tds: 0,
  });
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0] // Default to current date
  );

  const fetchData = async () => {
    try {
      const response = await api.get(`/user/thingspeak`, {
        params: { date: selectedDate }, // Pass selected date as a query parameter
      });
      const json = response.data;

      console.log("Number of items in fetched data:", json.length);

      const feeds = json.map((feed) => ({
        time: feed.createdAt,
        temperature: feed.temperature,
        humidity: feed.humidity,
        ph: feed.ph,
        distance: feed.distance,
        tds: feed.tds,
      }));

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

  const filterDataByDate = () => {
    if (selectedDate) {
      const selectedDateObj = new Date(selectedDate);
      const filtered = data.filter((item) => {
        const itemDate = new Date(item.time);
        return (
          itemDate.getFullYear() === selectedDateObj.getFullYear() &&
          itemDate.getMonth() === selectedDateObj.getMonth() &&
          itemDate.getDate() === selectedDateObj.getDate()
        );
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
  }, [selectedDate]);

  useEffect(() => {
    filterDataByDate();
  }, [data, selectedDate]);

  return (
    <div className="flex flex-col">
      <div className="p-2 mx-4 md:mx-16 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 border rounded bg-white bg-opacity-30 backdrop-blur-md">
        <h1 className="text-3xl font-bold text-center md:text-left w-full md:w-auto">
          History
        </h1>
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
          <div className="flex flex-col">
            <label htmlFor="selectedDate" className="text-sm">
              Select Date
            </label>
            <input
              type="date"
              id="selectedDate"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
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
            title: "Distance/Ultrasonic (cm)",
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
