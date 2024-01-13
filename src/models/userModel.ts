import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Others'],
    },
    hobbies: [{
        type: String,
        required:true,
        enum: ['Reading', 'Travelling', 'Coding'],
    }],
  },
  { timestamps: true }
);

const UserModel = mongoose.model('users', userSchema);

export default UserModel;
