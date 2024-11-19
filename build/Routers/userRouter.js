"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express = require("express");
exports.router = express.Router();
const { createUser, Login } = require('../Controllers/userController');
exports.router.post('/createUser', createUser);
exports.router.post('/login', Login);
