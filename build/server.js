"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const cron_1 = require("cron");
const dotenv_1 = __importDefault(require("dotenv"));
const notificationRouter_1 = require("./Routers/notificationRouter");
const authRouter_1 = require("./Routers/authRouter");
const body_parser_1 = __importDefault(require("body-parser"));
const willRouter_1 = require("./Routers/willRouter");
const notificationService_1 = require("./Services/notificationService");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 9090;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use('/api/notification', notificationRouter_1.notificationRouter);
app.use('/api/', willRouter_1.willRouter);
app.use('/api/', authRouter_1.authRouter);
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
const job = new cron_1.CronJob('*/5 * * * *', async () => {
    console.log('Running cron job to send notifications every 5 minutes');
    await (0, notificationService_1.sendWillNotifications)();
}, null, true, 'Africa/Lagos');
job.start();
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'An unexpected error occurred', error: err.message });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
exports.default = app;
