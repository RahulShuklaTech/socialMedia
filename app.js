require('dotenv').config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan")
const mongoose = require("mongoose");


mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("Mongo is ON");
}).catch((e) => console.log("error while connecting to mongo:", e.message));

const app = express();
app.use(morgan('dev'));
app.use( cors({origin: "*"}));
app.use(express.json());

const userRouter = require("./Routes/userRouter");
const postRouter = require("./Routes/postRouter");

app.use("/users/",userRouter);
app.use("/posts/",postRouter);



const PORT = 3300

app.listen(PORT, () => {
    console.log("server is listening on PORT: " +PORT)
})