const UserModel = require("../models/userModel");
const express = require('express');
const app = express(); 

const getUsers = async (req, res) => {
    try {
        const users = await UserModel.find({});
        res.render('userData', {tableData: users})
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to retrieve users" });
    }
}

const addUser = async (req, res) => {
    try {
        const { name, experience, address, role, dateOfJoining, id } = req.body;
        const newUser = new UserModel({ name, experience, address, role, dateOfJoining, id });
        await newUser.save();
        res.status(201).json({ message: "User added successfully" });
    } catch (err) {
        console.error(err); 
        res.status(500).json({ message: "Failed to add user" });
    }
}

const editUser =  async (req, res) => {
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
}

const deleteUser = async (req, res) => {
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
}
const addUsers=(req, res)=>{
    res.render('addUser')
}

const getUserById = async (req, res) => {
    try {
        const { id } = req.params; 
        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to retrieve user" });
    }
}

module.exports= {getUsers, addUser, editUser, deleteUser, addUsers, getUserById}