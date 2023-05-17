const express = require("express");
const app = express();
const ProductRoute = require("./Routes/Product.Route");
const UserRoute = require("./Routes/User.Route");
const OrderRoute = require("./Routes/Order.Route");
const PaymentRoute = require("./Routes/Payment.Route");
const colors = require("colors");
const path = require("path");
const cors = require("cors");
const cloudinary = require("cloudinary");
const bodyParser = require("body-parser");
const conectDataBase = require("./DataBase/Connection.DB");
const ErrorMiddleware = require("./Middleware/Error");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
process.on("uncaughtException", (err) => {
  console.log(`Error : ${err.message}`.red);
  console.log(`Shutting down the server due to Unhandled Promise Exeption`.red);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: "*", credentials: true }));
app.use(cookieParser());
app.use(fileUpload());

conectDataBase();
cloudinary.config({
  cloud_name: "dtxdnaq1z",
  api_key: "598955315229467",
  api_secret: "jiHGbTIC9b8yApmA3Fl-wofEQaE",
});

app.use("/api/v1", ProductRoute);
app.use("/api/v1", UserRoute);  
app.use("/api/v1", OrderRoute);
app.use("/api/v1", PaymentRoute);

app.use(ErrorMiddleware);

app.use(express.static(path.join(__dirname, "../frontend/build")))
app.get("*" , (req,res) =>{
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
})
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is Listing on Port 4000`.yellow);
});

process.on("unhandledRejection", (err) => {
  console.log(`Error : ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);
  server.close(() => {
    process.exit(1);
  });
});
