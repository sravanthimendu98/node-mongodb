const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 

const app = express();
app.use(express.json());
app.use(cors()); 

require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Failed to connect to MongoDB", err);
});


const UserSchema = mongoose.Schema({
    name: String,
    experience: Number,
    address: String,
    role: String,
    dateOfJoining: String,
    id: String
});

const UserModel = mongoose.model("users", UserSchema);

app.get("/getUsers", async (req, res) => {
    try {
        const users = await UserModel.find({});
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to retrieve users" });
    }
});

app.post("/addUser", async (req, res) => {
    try {
        const { name, experience, address, role, dateOfJoining, id } = req.body;
        const newUser = new UserModel({ name, experience, address, role, dateOfJoining, id });
        await newUser.save();
        res.status(201).json({ message: "User added successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to add user" });
    }
});

app.put("/editUser/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, experience, address, role, dateOfJoining } = req.body;

        const updatedUser = await UserModel.findByIdAndUpdate(id, { name, experience, address, role, dateOfJoining }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User updated successfully", updatedUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update user" });
    }
});

app.delete("/deleteUser/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await UserModel.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete user" });
    }
});

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
