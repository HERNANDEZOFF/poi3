const express = require("express");
const dotenv = require("dotenv");
const {chats} = require("./data/data");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes=require("./routes/userRoutes");
const {notFound, errorHandler}=require('./middlewares/errorMiddleware')
const cors = require("cors");

dotenv.config();

connectDB();
const app = express();

app.use(express.json());

app.get('/',(req,res)=>{
    res.send("API is Running");
});

app.use("/api/user/",userRoutes)

app.use(cors({ credentials: true }));

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000;

app.listen(5000, console.log(`Server Started on PORT ${PORT}`.yellow.bold));
