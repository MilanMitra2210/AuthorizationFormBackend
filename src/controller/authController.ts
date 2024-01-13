import { Request, Response } from "express";
import {hashPassword, comparePassword, isValidEmail,} from "../helpers/authHelper";
import userModel from "../models/userModel";
import JWT from "jsonwebtoken";

const registerController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { name, email, password, phone, address, gender, hobbies } = req.body;

    // validation
    if (!name) {
      return res.status(400).send({ message: "Name is Required" });
    }
    if (!email) {
      return res.status(400).send({ message: "Email is Required" });
    }
    if (!password) {
      return res.status(400).send({ message: "Password is Required" });
    }
    if (!phone) {
      return res.status(400).send({ message: "Phone Number is Required" });
    }
    if (!address) {
      return res.status(400).send({ message: "Address is Required" });
    }
    if (!gender) {
      return res.status(400).send({ message: "Gender is Required" });
    }
    if (!hobbies) {
      return res.status(400).send({ message: "Hobbies Required" });
    }
    const isEmail = await isValidEmail(email);
    if (!isEmail) {
      return res.status(400).send({ message: "Please Enter Correct Email" });
    }

    // check user
    const existingUser = await userModel.findOne({ email });

    // existing user
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Registered please login",
      });
    }

    // register user
    const hashedPassword = await hashPassword(password);

    // save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      gender,
      hobbies,
    }).save();

    res.status(200).send({
      success: true,
      message: "User Successfully Registered",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};

// Post Login
const loginController = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //email validation
    const isEmail = await isValidEmail(email);
    if (!isEmail) {
      return res.status(400).send({ success: false, message: "Please Enter Correct Email" });
    }

    // check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(403).send({
        success: false,
        message: "Invalid Password",
      });
    }

    // token
    const jwt_secret_key: string = process.env.JWT_SECRET || "";
    const token = await JWT.sign({ _id: user._id }, jwt_secret_key, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Login successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};

const listDataController = async (req: Request, res: Response): Promise<any> => {
  try {
    // Fetch all documents from the collection
    const users: any[] = await userModel.find({}, { name: 1 }).exec();

    // Extract names from the retrieved documents
    const names: string[] = users.map((user) => user.name);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).send({
        success: false,
        message: "Error in Fetching data",
        error,
    });
  }
};

const updateDataController= async (req: Request, res: Response): Promise<any> =>{
    const userId = req.params.id;
    const updatedUserData = req.body;
    



    //email validation
    if(updatedUserData.email){
        const isEmail = await isValidEmail(updatedUserData.email);
        if (!isEmail) {
            return res.status(400).send({ success: false, message: "Please Enter Correct Email" });
          }
    }
    
    
    if(userId.length != 24){
        return res.status(400).json({ message: 'ID is not of specified length' });
    }

    try {
        const existingUser = await userModel.findById(userId);
        

        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        

        // Update user fields
        if(existingUser.password){
          const hashedPassword = await hashPassword(updatedUserData.password);
          existingUser.password = hashedPassword;
        }
        existingUser.name = updatedUserData.name || existingUser.name;
        existingUser.email = updatedUserData.email || existingUser.email;
        existingUser.phone = updatedUserData.phone || existingUser.phone;
        existingUser.address = updatedUserData.address || existingUser.address;
        existingUser.gender = updatedUserData.gender || existingUser.gender;
        existingUser.hobbies = updatedUserData.hobbies || existingUser.hobbies;

        // Save updated user data
        await existingUser.save();

        return res.status(200).json({ message: 'User updated successfully', user: existingUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deleteDataController = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.params.id;

    // Validate the user ID format
    if (userId.length !== 24) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    // Check if the user exists
    const existingUser = await userModel.findById(userId);

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the user
    const deletedUser = await userModel.findByIdAndDelete(userId);

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export { registerController, loginController , listDataController, updateDataController, deleteDataController};
