const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    experience: Number,
    address: String,
    role: String,
    dateOfJoining: String,
    id: String
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
