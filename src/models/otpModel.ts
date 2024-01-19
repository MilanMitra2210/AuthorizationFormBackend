import mongoose, { Schema } from 'mongoose';

const otpSchema = new Schema(
  {
    _id:{
        type: String,
        required: true,
    },
    otp: {
      type: String,
      required: true,
      trim: true,
    }
  },
  { timestamps: true }
);

const otpModel = mongoose.model('otp', otpSchema);

export default otpModel;
