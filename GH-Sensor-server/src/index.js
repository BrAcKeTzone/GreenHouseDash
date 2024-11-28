const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelizePromise = require("./configs/sequelizeConfig");

const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const adminRouter = require("./routes/adminRoutes");


require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001 ;

const corsOptions = {
    origin: [
        "https://green.ghsensordash.online",
        "http://localhost:4173",
        "https://ghsensordash.online"
    ],
    methods: ["GET", "PUT", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // This allows cookies and other credentials to be sent
};
app.use(cors(corsOptions));


// Handle preflight requests
app.options("*", cors(corsOptions));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use(bodyParser.json());

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

const startServer = async () => {
    try {
        const sequelize = await sequelizePromise;
        await sequelize.sync({ alter: false }); // Use { force: true } or { alter: true } during development to drop and recreate tables
        console.log("Connected to the database");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

startServer();