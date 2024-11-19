"use strict";
// const mongoose = require("mongoose");
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// const userSchema = new mongoose.Schema({
// //   Fullname: {
// //     type: String,
// //     required: true,
// //     trim: true 
// //   },
// //   Email: {
// //     type: String,
// //     required: true,
// //     unique: true, 
// //     trim: true,
// //     lowercase: true, 
// //     validate: {
// //       validator: function(value: string) {
// //         return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
// //       },
// //       message: (props: { value: any; }) => `${props.value} is not a valid email!`
// //     }
// //   },
// //   Password: {
// //     type: String,
// //     required: true,
// //     minlength: 6, 
// //     trim: true
// //   }
// walletAddress: { type: String, required: true, unique: true },
// authenticatedAt: { type: Date, required: true },
// });
// const userModel = mongoose.model("User", userSchema);
// export default userModel;
const mongoose_1 = __importStar(require("mongoose"));
const UserSchema = new mongoose_1.Schema({
    walletAddress: { type: String, required: true, unique: true },
});
exports.default = mongoose_1.default.model('User', UserSchema);
