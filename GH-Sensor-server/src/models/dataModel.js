const { DataTypes } = require("sequelize");
const sequelizePromise = require("../configs/sequelizeConfig");

const defineSensorDataModel = async () => {
  const sequelize = await sequelizePromise;

  const SensorData = sequelize.define("SensorData", {
    entryId: {
      type: DataTypes.INTEGER,
      unique: true, 
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    temperature: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    humidity: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    ph: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    distance: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    tds: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  });

  return SensorData;
};

module.exports = defineSensorDataModel();
