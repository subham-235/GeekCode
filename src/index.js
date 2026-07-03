const express = require("express");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const main = require("./config/db");
const app = express();
const cookieParser = require("cookie-parser");
const authRouter=require("./routes/userAuth");
const problemRouter=require('./routes/problemCreator');
const submitRouter=require('./routes/submit');
const redisClient = require("./config/redis");
app.use(express.json());
app.use(cookieParser());

app.use("/user",authRouter);
app.use("/problem",problemRouter);
app.use("/submission",submitRouter);


const InitializeConnection=async ()=>{
  try{
    await Promise.all([main(),redisClient.connect()])
    console.log("DB Connected..");
    app.listen(process.env.PORT, () => {
     console.log(`Server listening on port ${process.env.PORT}`);
   });
  }catch(err){
    console.log("Error : "+err);
  }
}
InitializeConnection();