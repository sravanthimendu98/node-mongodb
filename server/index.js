const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 

const app = express();
app.use(express.json());
app.use(cors()); 

mongoose.connect('mongodb://localhost:27017/curd');

const UserSchema = mongoose.Schema({
    name: String,
    age: Number,
    fullName: String,
    role: String,
    dateOfJoining: String,
    id: String
});

const UserModel = mongoose.model("users", UserSchema);

app.get("/getUsers", (req, res) => {
    UserModel.find({})
        .then(users => res.json(users))
        .catch(err => console.log(err));
});

app.post("/addUser", (req, res) => {
    const { name, age, fullName, role, dateOfJoining, id } = req.body;
    const newUser = new UserModel({ name, age, fullName, role, dateOfJoining, id });

    newUser.save()
        .then(() => res.status(201).json({ message: "User added successfully!" }))
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Failed to add user" });
        });
});

app.put("/editUser/:id", (req, res) => {
    const { id } = req.params;
    const { name, age, fullName, role, dateOfJoining } = req.body;

    UserModel.findByIdAndUpdate(id, { name, age, fullName, role, dateOfJoining }, { new: true })
        .then((updatedUser) => {
            if (!updatedUser) {
                return res.status(404).json({ message: "User not found" });
            }
            res.json({ message: "User updated successfully", updatedUser });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Failed to update user" });
        });
});

app.delete("/deleteUser/:id", (req, res) => {
    const { id } = req.params;

    UserModel.findByIdAndDelete(id)
        .then((deletedUser) => {
            if (!deletedUser) {
                return res.status(404).json({ message: "User not found" });
            }
            res.json({ message: "User deleted successfully" });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Failed to delete user" });
        });
});


app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
