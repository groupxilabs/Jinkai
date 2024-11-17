"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 9090;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// app.use('/api/');
app.get('/', (req, res) => {
    res.send('Welcome to Crypto-Will');
});
const mongodb = process.env.MONGO_URI || 'mongodb+srv://agbakwuruoluchi:SF4nv3OCBQmexwO9@cluster0.rt46t.mongodb.net';
mongoose_1.default.connect(mongodb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//SF4nv3OCBQmexwO9
