import bcrypt from 'bcrypt';
import NodeMailer from 'nodemailer';
import jwt from "jsonwebtoken";
import twilio from 'twilio';
import otpModel from '../models/otpModel';

// Configure nodemailer for sending emails
const transporter = NodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'milan.75way@gmail.com',
    pass: 'gjygvjgshfeclqlx',
  },
});

const hashPassword = async (password: string): Promise<string> => {
  try {
    const saltRounds = 10;
    const hashedPassword: string = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.log(error);
    throw error; // Optionally rethrow the error or handle it as needed
  }
};

const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

const isValidEmail = async (email: string): Promise<boolean> => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

const verifyPhoneNumberAndMail = async (name: string, email: string, phone: string) => {

  const emailBody = `<div class="container">
  <p>Hello ${name},</p>
  <p>Thank you for signing up. To complete your registration, please verify your email and phone number by clicking the following link</p>
  <a href= "http://localhost:8080/api/v1/auth/sendotp"}">click here</a>
  <p>If you didn't sign up for an account, please ignore this email.</p>
  <div class="footer">
    <p>This email was sent by authentication team</p>
  </div>
</div>`

  // Simulate sending an email
  const mailOptions = {
    from: 'milan.75way@gmail.com',
    to: email,
    subject: 'Email and Phone Verification',
    text: `Verifying mail sent successfully`,
    html: emailBody,
  };

  //sending mail
  const info = await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      throw error;
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

const sendVerificationMail = async (user: any) => {

  const jwt_secret_key: string = process.env.JWT_OTP_SECRET || "";
  const token = await jwt.sign({_id: user._id }, jwt_secret_key, {
    expiresIn: 300,
  });
  // Replace the template placeholder with the actual OTP
  const emailBody = `
<div class="container">
  <p>Hello ${user.name},</p>
  <p>Thank you for signing up. To complete your registration, please verify your email by clicking the following link</p>
  <a href = http://localhost:8080/api/v1/auth/verifyemail/${token}>click here</a>
  <p >This link is valid for 5 minutes only</p>
  <p>If you didn't sign up for an account, please ignore this email.</p>
  <div class="footer">
    <p>This email was sent by the authentication team</p>
  </div>
</div>
`;

  // Simulate sending an email
  const mailOptions = {
    from: 'milan.75way@gmail.com',
    to: user.email,
    subject: 'Email Verification',
    text: `Verifying mail sent successfully`,
    html: emailBody,
  };

  //sending mail
  if(!user.isMailVerified){
    const info = await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        throw error;
      } else {
        console.log('Email sent:', info.response);
      }
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  //credentials
  const sid: string = process.env.TWILIIO_ACCOUNT_SID || "";
  const authToken: string = process.env.TWILIIO_AUTH_TOKEN || "";
  const twilioPhone: string = process.env.TWILIIO_PHONE_NO || "";
  
  const client = twilio(sid, authToken);

  if(!user.isPhoneVerified){
    try {
      // Send SMS using Twilio API
      const result = await client.messages.create({
        body: `Here is your OTP ${otp} for verify your phone number. This is valid for 5minutes only.`,
        to: `+91 ${user.phone}`,
        from: twilioPhone,
      });
      
      const existingOTP = await otpModel.findById(user._id);

      //save to db
      if(existingOTP){
        existingOTP.otp = otp;
        existingOTP.save();
      }else{
        
        await new otpModel({
          _id: user._id,
          otp
        }).save();
      }
      
      const hashedotp = await hashPassword(otp); //will be used in restapi of verifying otp
      const updated = hashedotp.replace(/\//g, '@#$%^&*');
      console.log("Use this hashed OTP, send it via params in REST API and Verify", updated);

      
  
      console.log(`SMS sent successfully. SID: ${result.sid}`);
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw error;
    }
  }



}

export { hashPassword, comparePassword, isValidEmail, verifyPhoneNumberAndMail, sendVerificationMail };
