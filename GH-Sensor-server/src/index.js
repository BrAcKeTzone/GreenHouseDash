const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelizePromise = require("./configs/sequelizeConfig");

const userRouter = require("./routes/userRoutes");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001 ;

app.use(cors());

app.options("*", cors());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use(bodyParser.json());

app.use("/user", userRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

const startServer = async () => {
    try {
        const sequelize = await sequelizePromise;
        await sequelize.sync({ force: false }); // Use { force: true } or { alter: true } during development to drop and recreate tables
        console.log("Connected to the database");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

startServer();
