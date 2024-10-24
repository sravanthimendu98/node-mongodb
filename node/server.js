const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(express.json());
app.use(cors());

connectDB();

app.use("/users", userRoutes);

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
