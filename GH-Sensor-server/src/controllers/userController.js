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
    const requestedDate = req.query.date || new Date().toISOString().split("T")[0]; // Get the requested date or default to today's date
    await initializeModels();

    // Fetch data from the ThingSpeak API
    const response = await fetch(
      "https://thingspeak.mathworks.com/channels/2664461/feed.json"
    );
    const data = await response.json();

    // Convert requestedDate to start and end times in UTC
    const startOfDay = new Date(`${requestedDate}T00:00:00Z`).toISOString();
    const endOfDay = new Date(`${requestedDate}T23:59:59Z`).toISOString();

    // Filter feeds for the requested date
    const dateFeeds = data.feeds.filter((feed) =>
      new Date(feed.created_at) >= new Date(startOfDay) &&
      new Date(feed.created_at) <= new Date(endOfDay)
    );

    // Save the requested date's feeds to the database if they don't already exist
    for (const feed of dateFeeds) {
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

    // Return the stored data for the requested date
    const storedData = await SensorData.findAll({
      where: {
        createdAt: {
          [Op.gte]: startOfDay,
          [Op.lte]: endOfDay,
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
