const dotenv = require('dotenv')
const path = require("path")
const mongoSanitize = require("express-mongo-sanitize")
const hpp = require('hpp')
const express = require("express")
const mongoose = require("mongoose")
const postRoutes = require("./routes/postRoutes")
const globalErrorHandler = require("./controllers/errorController")

//setting up dotenv to be able to easily use env vars from .env file
const result = dotenv.config({ path: path.join(__dirname, `/../.env`) })
if (result.error) {
    console.log(result.error)
}

const app = express();

//connecting to the DB
mongoose.connect("mongodb://localhost/testDB", { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true, 
})
const db = mongoose.connection;
db.on("error", console.error)
db.once("open", () => console.log("connected to mongoDB"))

app.use(express.json())

//to prevent no-sql injections
app.use(mongoSanitize())

//to prevent parameter polution
app.use(hpp({
    whitelist: ["difficulty", "postType"]
}))

app.use("/posts", postRoutes)

app.use(globalErrorHandler)

app.listen("3000", () => console.log("listening on port 3000"))
