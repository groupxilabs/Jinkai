const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  Fullname: {
    type: String,
    required: true,
    trim: true 
  },
  Email: {
    type: String,
    required: true,
    unique: true, 
    trim: true,
    lowercase: true, 
    validate: {
      validator: function(value: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: (props: { value: any; }) => `${props.value} is not a valid email!`
    }
  },
  Password: {
    type: String,
    required: true,
    minlength: 6, 
    trim: true
  }
});

const userModel = mongoose.model("Users", userSchema);
export default userModel;
