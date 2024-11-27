const { DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");


const sequelizePromise = require("../configs/sequelizeConfig");

const defineUserModel = async () => {
    const sequelize = await sequelizePromise;

    const User = sequelize.define("User", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            unique: true,
            defaultValue: uuidv4()
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isApproved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });
    return User;
};

module.exports = defineUserModel();
