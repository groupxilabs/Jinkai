// const mongoose = require("mongoose");

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


import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  walletAddress: string;
}

const UserSchema: Schema = new Schema({
  walletAddress: { type: String, required: true, unique: true },
});

export default mongoose.model<IUser>('User', UserSchema);
