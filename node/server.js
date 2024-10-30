const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

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
app.use("/users", userRoutes);

// Route to render the Pug template
app.get("/", (req, res) => {
    res.render("index", { title: "Welcome to My App", message: "Hello, EJS!" });
});

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
