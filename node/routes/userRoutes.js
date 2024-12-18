const express = require('express');
const router = express.Router();
const { getUsers, addUser, editUser, deleteUser, addUsers, getUserById } = require('../controller/userController');

router.get("/addUsers", addUsers);
router.get("/getUsers", getUsers);
router.post("/addUser",addUser );
router.put("/editUser/:id", editUser);
router.delete("/deleteUser/:id", deleteUser);
router.get('/getUserById/:id', getUserById);


module.exports = router;
