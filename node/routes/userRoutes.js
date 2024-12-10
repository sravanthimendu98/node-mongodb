const express = require('express');
const router = express.Router();
const { getUsers, addUser, editUser, deleteUser, addUsers } = require('../controller/userController');

router.get("/addUsers", addUsers);
router.get("/getUsers", getUsers);
router.post("/addUser",addUser );
router.put("/editUser/:id", editUser);
router.delete("/deleteUser/:id", deleteUser);

module.exports = router;
