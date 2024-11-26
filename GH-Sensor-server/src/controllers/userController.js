const defineUserModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
require("dotenv").config();

let User;

const initializeModels = async () => {
    User = await defineUserModel;
};

initializeModels();

async function getUserInfo(req, res) {
    try {
        const { id } = req.params;
        await initializeModels();

        const profile = await User.findByPk(id);
        if (!profile) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(201).json({ profile });
    } catch (error) {
        console.error("Error during getting user by ID:", error);
    }
}

async function editUserInfo(req, res) {
    try {
        const { id } = req.body;
        await initializeModels();
        
        const { currentPassword, ...updatedData } = req.body;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (currentPassword) {
            const passwordMatch = await bcrypt.compare(
                currentPassword,
                user.password
            );
            if (!passwordMatch) {
                return res
                    .status(401)
                    .json({ error: "Incorrect current password" });
            }
        }
        if (updatedData.password) {
            updatedData.password = await bcrypt.hash(updatedData.password, 10);
        }
        await user.update(updatedData);
        res.status(201).json({ user });
    } catch (error) {
        console.error("Error during editing user information:", error);
        res.status(500).json({ error: "Editing user information failed" });
    }
}

async function getData(req, res){
    try {
        const response = await fetch(
          "https://thingspeak.mathworks.com/channels/2664461/feed.json"
        );
        const data = await response.json();
        res.json(data);
      } catch (error) {
        res.status(500).send("Error fetching data from ThingSpeak");
      }
}

module.exports = {
    getUserInfo,
    editUserInfo,
    getData
};
