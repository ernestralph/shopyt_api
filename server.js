const dotenv = require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookiePaser = require('cookie-parser');
const userRoutes = require("./routes/userRoute");
const errorHandler = require("./middleware/errorMiddleware")

const app = express();

app.use(express.json());
app.use(cookiePaser());
app.use(express.urlencoded({extended: false}))
app.use(cors({
  origin:["http://localhost:3000", "https://shopty.vercel.app"],
  credentials: true
 })); 

app.use("/api/users", userRoutes)
app.get("/", (req, res)=>{
 res.send({message: "hello world"});
});

// Error Handling middleware
app.use(errorHandler);
const PORT = process.env.PORT || 5000;

// mongo connection with mongoose
mongoose
   .connect(process.env.MONGO_URI)
   .then(()=>{
    console.log(`Connected to mongo service...`);
    app.listen(PORT, ()=>{
     console.log(`Server is running on port ${PORT}`);
    })
   })
   .catch((err)=>console.error(err));

