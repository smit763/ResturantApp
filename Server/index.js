require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./connections/db");

const tableRoutes = require("./routes/TableRoutes");
const menuRoutes = require("./routes/MenuRoutes");
const orderRoutes = require("./routes/OrderRoutes");
const reservationRoutes = require("./routes/ReservationRoutes");

const app = express();

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/v1", tableRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", menuRoutes);
app.use("/api/v1", reservationRoutes);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
