const express = require("express");
const mongoose = require ("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(bodyParser.json());


mongoose.connect(process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/bus-reservation" ,{
    useNewUrlParser: true,
  useUnifiedTopology: true
})

.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

app.get("/", (req,res)=>{
    res.send("Welcome to the Mini-Bus Ticket Reservation system")
})

const routes = require('./routes');
app.use('/api', routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`
})

