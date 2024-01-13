import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  
  try {
    const url: string = process.env.MONGO_URL || "";
    
    const con = await mongoose.connect(url);

    console.log(`Connected to MongoDB Database ${con.connection.host}`);
  } catch (error) {
    console.log(`Error in MongoDB ${error}`);
  }
};

export default connectDB;
