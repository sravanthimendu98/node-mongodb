const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const userRoutes = require('./userRoutes');
const UserModel = require('../models/userModel');

const app = express();
app.use(express.json());
app.use('/users', userRoutes);

beforeAll(async () => {
    const mongoURI = "mongodb://localhost:27017/curd"; 
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

const mockUser = {
    name: "Sravanthi",
    experience: 3,
    address: "Hyderabad",
    role: "Developer",
    dateOfJoining: "2023-05-11",
    id: "241"
};

describe("User Routes", () => {
    let userId;

    test("GET /users/getUsers - should return a list of users", async () => {
        const response = await request(app).get('/users/getUsers');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test("POST /users/addUser - should create a new user", async () => {
        const response = await request(app)
            .post('/users/addUser')
            .send(mockUser);
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe("User added successfully");

        // Store user ID for further tests
        const createdUser = await UserModel.findOne({ id: mockUser.id });
        userId = createdUser._id.toString();
        expect(createdUser.name).toBe(mockUser.name);
    });

    test("PUT /users/editUser/:id - should update a user by ID", async () => {
        const updatedData = { name: "Jane Doe", experience: 10 };
        const response = await request(app)
            .put(`/users/editUser/${userId}`)
            .send(updatedData);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("User updated successfully");
        expect(response.body.updatedUser.name).toBe(updatedData.name);

        const updatedUser = await UserModel.findById(userId);
        expect(updatedUser.experience).toBe(updatedData.experience);
    });

    test("DELETE /users/deleteUser/:id - should delete a user by ID", async () => {
        const response = await request(app).delete(`/users/deleteUser/${userId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("User deleted successfully");

        const deletedUser = await UserModel.findById(userId);
        expect(deletedUser).toBeNull();
    });

    test("PUT /users/editUser/:id - should return 404 if user not found", async () => {
        const invalidId = new mongoose.Types.ObjectId();
        const response = await request(app)
            .put(`/users/editUser/${invalidId}`)
            .send({ name: "Does Not Exist" });
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("User not found");
    });

    test("DELETE /users/deleteUser/:id - should return 404 if user not found", async () => {
        const invalidId = new mongoose.Types.ObjectId();
        const response = await request(app).delete(`/users/deleteUser/${invalidId}`);
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("User not found");
    });
});
