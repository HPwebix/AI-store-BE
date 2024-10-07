const dotenv = require("dotenv");
const express = require("express");
const app = express();
const cors = require('cors');
const cookieParser = require("cookie-parser");


dotenv.config({path:"./config.env"}); 
const PORT = process.env.PORT || 5000 ;

require('./db/conn');

// to read json file we use this middle ware
app.use(express.json());


const corsOptions = {
        origin: "*",
        // origin: "https://www.friendsledger.com",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        credentials: true
  };
  
app.use(cors(corsOptions)); 

app.use(cookieParser()); 

//linking the router files to make our route easily 
app.use("/api/publisher",require('./Routes/PublisherRoutes'));

app.get('/', (req, res) =>{
    res.send("hello server");
});

app.listen(PORT, ()=>{
    console.log(`Server is running at port ${PORT}`)
})