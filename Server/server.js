require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { CommandSucceededEvent } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ["Content-type", "Authorization"],
};

app.use(express.json());
app.use(cors(corsOptions));

app.use((err, req, res, next)=>{
    console.log(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong'
    })
})


mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("mongodb is connected"))
    .catch((e) => console.log(e));
    
app.listen(PORT, () => {
  console.log(`The server is running on port: ${PORT}`);
  
});
