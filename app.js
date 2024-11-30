const express = require("express");
const path = require('path');
const cors = require('cors');

const firebaseRoutes = require("./routes/firebaseRoutes");

const app = express();
const PORT = 3000;


app.use(cors());
// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the "public" folder
// Routes
app.use("/firebase", firebaseRoutes); // Include Firebase authentication routes

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
