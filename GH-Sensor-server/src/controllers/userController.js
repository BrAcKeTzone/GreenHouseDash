const defineSensorDataModel = require("../models/dataModel");
const { Op } = require("sequelize");

require("dotenv").config();

let SensorData;


const initializeModels = async () => {
    SensorData = await defineSensorDataModel;
};

initializeModels();

async function getData(req, res) {
    try {
      const today = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
      await initializeModels();
  
      // Fetch data from the ThingSpeak API
      const response = await fetch(
        "https://thingspeak.mathworks.com/channels/2664461/feed.json"
      );
      const data = await response.json();
  
      // Filter feeds for today
      const todayFeeds = data.feeds.filter((feed) =>
        feed.created_at.startsWith(today)
      );
  
      // Save today's feeds to the database if they don't already exist
      for (const feed of todayFeeds) {
        const existingEntry = await SensorData.findOne({
          where: { entryId: feed.entry_id },
        });
  
        if (!existingEntry) {
          await SensorData.create({
            entryId: feed.entry_id,
            createdAt: feed.created_at,
            temperature: parseFloat(feed.field1),
            humidity: parseFloat(feed.field2),
            ph: parseFloat(feed.field3),
            distance: parseFloat(feed.field4),
            tds: parseFloat(feed.field5?.trim()), // Handle potential trailing characters
          });
        }
      }
  
      // Return the stored data for today's date
      const storedData = await SensorData.findAll({
        where: {
          createdAt: {
            [Op.gte]: `${today}T00:00:00`,
            [Op.lte]: `${today}T23:59:59`,
          },
        },
        order: [["createdAt", "ASC"]],
      });
  
      res.json(storedData);
    } catch (error) {
      console.error("Error fetching or saving sensor data:", error);
      res.status(500).send("Error processing data");
    }
  }

module.exports = {
    getData
};
