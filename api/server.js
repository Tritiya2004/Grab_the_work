require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose"); // Import mongoose
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3001;
const MongoConnection = require("./config/database");
const userRoutes = require("./routes/UserRoutes");
const freelancerRoutes = require("./routes/FreelancerRoutes");
const clientRoutes = require("./routes/ClientRoutes");
const chatRoutes = require("./routes/ChatRoutes");
const projectRoutes = require("./routes/ProjectRoutes"); // Import project routes
const bodyParser = require("body-parser");
const bidRoutes = require("./routes/BidRoutes"); 

// Use body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

mongoose.set("strictQuery", true);

// Database connection
MongoConnection();

// Route configurations
app.use("/user", userRoutes);
app.use("/freelancer", freelancerRoutes);
app.use("/client", clientRoutes);
app.use("/chat", chatRoutes);
app.use("/project", projectRoutes); // Add project routes// Import bid routes
app.use("/bid", bidRoutes); // Add bid routes


// Static file serving
app.use("/ProfilePic", express.static(__dirname + "/uploads/Users_imgs"));
app.use("/ServicePic", express.static(__dirname + "/uploads/UsersServices"));
app.use("/ProjectAttachments", express.static(__dirname + "/uploads/UserProjects")); // Add static serving for project attachments

// Start the server
app.listen(port, (err) => {
  if (err) console.log("Server Error :" + err.message);
  else console.log("Server Running on Port: " + port);
});
