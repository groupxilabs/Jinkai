"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("./server"));
const mongoose_1 = __importDefault(require("mongoose"));
const willModel_1 = __importDefault(require("./Models/willModel"));
const globals_1 = require("@jest/globals");
const node_test_1 = require("node:test");
(0, node_test_1.describe)('Will Activity Confirmation', () => {
    (0, globals_1.beforeAll)(async () => {
        const mongodb = process.env.MONGO_URI || 'mongodb+srv://agbakwuruoluchi:SF4nv3OCBQmexwO9@cluster0.rt46t.mongodb.net';
        await mongoose_1.default.connect(mongodb);
        console.log('Connected to MongoDB');
    });
    (0, globals_1.afterAll)(async () => {
        await mongoose_1.default.connection.close();
    });
    (0, globals_1.test)('should confirm user activity successfully', async () => {
        const will = new willModel_1.default({
            userId: '673956f7b47f844fe2213414',
            email: 'oluchicharity10@gmail.com',
            status: 'active',
            creationDate: new Date(),
            lastConfirmed: null,
        });
        await will.save();
        const response = await (0, supertest_1.default)(server_1.default).post(`/will/confirm/${will.userId}`);
        (0, globals_1.expect)(response.status).toBe(200);
        (0, globals_1.expect)(response.body.message).toBe('Your activity has been confirmed.');
        const updatedWill = await willModel_1.default.findOne({ userId: '673956f7b47f844fe2213414' });
        (0, globals_1.expect)(updatedWill).not.toBeNull();
        if (updatedWill) {
            (0, globals_1.expect)(updatedWill.lastConfirmed).not.toBeNull();
        }
    });
    (0, globals_1.test)('should return 404 if will not found', async () => {
        const response = await (0, supertest_1.default)(server_1.default).post('/will/confirm/invalidUserId');
        (0, globals_1.expect)(response.status).toBe(404);
        (0, globals_1.expect)(response.body.message).toBe('Will not found for this user');
    });
    (0, globals_1.test)('should handle errors gracefully', async () => {
        const response = await (0, supertest_1.default)(server_1.default).post('/will/confirm/');
        (0, globals_1.expect)(response.status).toBe(500);
        (0, globals_1.expect)(response.body.message).toBe('An error occurred while confirming your activity.');
    });
});
