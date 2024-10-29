const express = require('express');
const router = express.Router();
const UserModel = require('../models/userModel');

router.get("/getUsers", async (req, res) => {
    try {
        const users = await UserModel.find({});
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to retrieve users" });
    }
});

router.post("/addUser", async (req, res) => {
    try {
        const { name, experience, address, role, dateOfJoining, id } = req.body;
        const newUser = new UserModel({ name, experience, address, role, dateOfJoining, id });
        await newUser.save();
        res.status(201).json({ message: "User added successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to add user" });
    }
});

router.put("/editUser/:id", async (req, res) => {
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

router.delete("/deleteUser/:id", async (req, res) => {
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

module.exports = router;
