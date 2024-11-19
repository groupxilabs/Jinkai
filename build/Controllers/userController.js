"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const userModel_1 = __importDefault(require("../Models/userModel"));
const email_1 = require("../Emails/email");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createUser = async (req, res) => {
    try {
        const { Fullname, Email, Password } = req.body;
        if (!Fullname || !Email || !Password) {
            return res.status(400).json({ error: 'Fullname, Email, and Password are required for registration' });
        }
        const existingUser = await userModel_1.default.findOne({ Email });
        if (existingUser) {
            return res.status(400).json({ error: 'This email already exists' });
        }
        const salt = await bcrypt_1.default.genSalt(12);
        const hashedPassword = await bcrypt_1.default.hash(Password, salt);
        const newUser = new userModel_1.default({
            Fullname,
            Email,
            Password: hashedPassword
        });
        const savedUser = await newUser.save();
        return res.status(201).json(savedUser);
    }
    catch (error) {
        console.error('Error creating user:', error.message);
        return res.status(500).json({ error: error.message });
    }
};
exports.createUser = createUser;
const Login = async (req, res) => {
    try {
        const { Email, Password } = req.body;
        if (!Email || !Password) {
            return res.status(400).json({ error: 'Email and Password are required' });
        }
        const user = await userModel_1.default.findOne({ Email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const passwordMatch = await bcrypt_1.default.compare(Password, user.Password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id, Email: user.Email }, process.env.SECRET, { expiresIn: '5d' });
        await (0, email_1.sendEmail)({
            email: user.Email,
            subject: 'Successful Login',
            html: '<p>hello, welcome back </p>',
        });
        console.log(email_1.sendEmail);
        return res.json({
            message: 'Welcome',
            user: { Email: user.Email, Fullname: user.Fullname },
            token
        });
    }
    catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ error: error.message });
    }
};
exports.Login = Login;
