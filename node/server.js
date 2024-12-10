const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const axios = require('axios');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// database connection
connectDB();

// Set pug/ejs as the view engine
// app.set('view engine', 'pug');
app.set('view engine', 'ejs');
app.set('views', './views');

// Routes
app.use("/", userRoutes);

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
