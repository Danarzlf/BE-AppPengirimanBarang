const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { generatedOTP } = require("../utils/otpGenerator");
const nodemailer = require("../utils/nodemailer");
const User = require("../models/user");
const UserProfile = require("../models/userprofile");

const { JWT_SECRET_KEY } = process.env;

const register = async (req, res, next) => {
  try {
    let { fullName, email, phoneNumber, password, role } = req.body;
    // const passwordValidator =
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,12}$/;
    const emailValidator = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate required fields
    if (!fullName || !email || !phoneNumber || !password) {
      return res.status(400).json({
        status: false,
        message: "All fields are required.",
        data: null,
      });
    }

    // Validate full name length
    if (fullName.length > 50) {
      return res.status(400).json({
        status: false,
        message: "Invalid full name length. It must be at most 50 characters.",
        data: null,
      });
    }

     // Check for existing user with the same email
     const existingUser = await User.findOne({ email });
     if (existingUser) {
       return res.status(409).json({
         status: false,
         message: 'Email already exists',
         data: null,
       });
     }
 
     // Check for existing user profile with the same phone number
     const existingPhoneNumber = await UserProfile.findOne({ phoneNumber });
     if (existingPhoneNumber) {
       return res.status(409).json({
         status: false,
         message: 'Phone number already exists',
         data: null,
       });
     }
     
    // Validate email format
    if (!emailValidator.test(email)) {
      return res.status(400).json({
        status: false,
        message: "Invalid email format.",
        data: null,
      });
    }

    // Validate phone number format
    if (!/^\d+$/.test(phoneNumber)) {
      return res.status(400).json({
        status: false,
        message:
          "Invalid phone number format. It must contain only numeric characters.",
        data: null,
      });
    }

    // Validate phone number length
    if (phoneNumber.length < 10 || phoneNumber.length > 12) {
      return res.status(400).json({
        status: false,
        message:
          "Invalid phone number length. It must be between 10 and 12 characters.",
        data: null,
      });
    }

    // Generate and store OTP for email verification
    const otpObject = generatedOTP();
    const otp = otpObject.code;
    const otpCreatedAt = otpObject.createdAt;

    // Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create new user record
    const newUser = await User.create({
      email,
      password: encryptedPassword,
      otp,
      otpCreatedAt,
      role,
    });

    // Create new user profile record
    const newUserProfile = await UserProfile.create({
      fullName,
      phoneNumber,
      userId: newUser._id, // Use _id for MongoDB
    });

    // Send email verification OTP
    const html = await nodemailer.getHtml("verify-otp.ejs", { email, otp });
    await nodemailer.sendEmail(email, "Email Activation", html);

    res.status(201).json({
      status: true,
      message: "Registration successful",
      data: { newUser, newUserProfile },
    });
  } catch (err) {
    next(err);
  }
};

const registerNoVerify = async (req, res, next) => {
  try {
    let { fullName, email, phoneNumber, password, role } = req.body;
    // const passwordValidator =
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,12}$/;
    const emailValidator = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate required fields
    if (!fullName || !email || !phoneNumber || !password) {
      return res.status(400).json({
        status: false,
        message: "All fields are required.",
        data: null,
      });
    }

    // Validate full name length
    if (fullName.length > 50) {
      return res.status(400).json({
        status: false,
        message: "Invalid full name length. It must be at most 50 characters.",
        data: null,
      });
    }

     // Check for existing user with the same email
     const existingUser = await User.findOne({ email });
     if (existingUser) {
       return res.status(409).json({
         status: false,
         message: 'Email already exists',
         data: null,
       });
     }
 
     // Check for existing user profile with the same phone number
     const existingPhoneNumber = await UserProfile.findOne({ phoneNumber });
     if (existingPhoneNumber) {
       return res.status(409).json({
         status: false,
         message: 'Phone number already exists',
         data: null,
       });
     }
     
    // Validate email format
    if (!emailValidator.test(email)) {
      return res.status(400).json({
        status: false,
        message: "Invalid email format.",
        data: null,
      });
    }

    // Validate phone number format
    if (!/^\d+$/.test(phoneNumber)) {
      return res.status(400).json({
        status: false,
        message:
          "Invalid phone number format. It must contain only numeric characters.",
        data: null,
      });
    }

    // Validate phone number length
    if (phoneNumber.length < 10 || phoneNumber.length > 12) {
      return res.status(400).json({
        status: false,
        message:
          "Invalid phone number length. It must be between 10 and 12 characters.",
        data: null,
      });
    }

    // Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create new user record
    const newUser = await User.create({
      email,
      password: encryptedPassword,
      role,
    });

    // Create new user profile record
    const newUserProfile = await UserProfile.create({
      fullName,
      phoneNumber,
      userId: newUser._id, // Use _id for MongoDB
    });

    res.status(201).json({
      status: true,
      message: "Registration successful",
      data: { newUser, newUserProfile },
    });
  } catch (err) {
    next(err);
  }
};

const verifyOtp = async (req, res, next) => {
    try {
      let { email, otp } = req.body;
      // Set OTP expiration time to 30 minutes
      const otpExpired = 30 * 60 * 1000;
  
      // Find the user based on the provided email
      let user = await User.findOne({ email });
  
      // Return error if user not found
      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found",
          data: null,
        });
      }
  
      // Return error if the provided OTP is incorrect
      if (user.otp !== otp) {
        return res.status(401).json({
          status: false,
          message: "Invalid OTP",
          data: null,
        });
      }
  
      const currentTime = new Date();
      const isExpired = currentTime - user.otpCreatedAt > otpExpired;
  
      if (isExpired) {
        return res.status(400).json({
          status: false,
          message: "OTP has expired. Please request a new one.",
          data: null,
        });
      }
  
      // Update user's verification status
      let updateUser = await User.updateOne(
        { email },
        { $set: { isVerified: true } }
      );
  
      // Fetch the updated user after the update operation
      const updatedUser = await User.findOne({ email });
  
      res.status(200).json({
        status: true,
        message: "Activation successful",
        data: updateUser,
      });
    } catch (err) {
      next(err);
    }
  };


  const login = async (req, res, next) => {
    try {
      let { emailOrPhoneNumber, password } = req.body;
  
      // Validate required fields
      if (!emailOrPhoneNumber || !password) {
        return res.status(400).json({
          status: false,
          message: "All fields are required.",
          data: null,
        });
      }
  
      // Find user record based on email or phone number
    let user = await User.findOne({ email: emailOrPhoneNumber });
    if (!user) {
      // If user not found by email, try finding by phone number in UserProfile
      const userProfile = await UserProfile.findOne({ phoneNumber: emailOrPhoneNumber });
      if (userProfile) {
        user = await User.findOne({ _id: userProfile.userId });
      }
    }

      // Return error if user not found
      if (!user) {
        return res.status(401).json({
          status: false,
          message: "Invalid Email or Password!",
          data: null,
        });
      }
  
      if (!user.password && user.googleId) {
        return res.status(401).json({
          status: false,
          message: "Authentication failed. Please use Google OAuth to log in.",
          data: null,
        });
      }
  
      // Check if the provided password is correct
      let isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(401).json({
          status: false,
          message: "Invalid Email or Password!",
          data: null,
        });
      }
  
      // // Return error if the user account is not verified
      // if (!user.isVerified) {
      //   return res.status(403).json({
      //     status: false,
      //     message: "Account not verified. Please check your email!",
      //     data: null,
      //   });
      // }
  
      // Generate JWT token for authentication
      let token = jwt.sign({ id: user._id }, JWT_SECRET_KEY);
  
      return res.status(200).json({
        status: true,
        message: "Login successful",
        data: {
          user: {
            email: user.email, /* tambahkan properti lain jika diperlukan */
            role: user.role
          },
          token,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  // const authenticateUser = async (req, res, next) => {
  //   try {
  //     // Find the user based on their ID and populate their profile information
  //     const user = await User.findById(req.user.id).populate('userProfile'); // Assuming 'profile' is the path to the user's profile
  
  //     // Return error if user not found
  //     if (!user) {
  //       return res.status(404).json({
  //         status: false,
  //         message: "User not found",
  //         data: null,
  //       });
  //     }
  
  //     return res.status(200).json({
  //       status: true,
  //       message: "Authentication successful",
  //       data: { user },
  //     });
  //   } catch (err) {
  //     next(err);
  //   }
  // };

  const authenticateUser = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const userWithProfileAndShipments = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "userprofiles",
          localField: "_id",
          foreignField: "userId",
          as: "userProfile"
        }
      },
      { $unwind: { path: "$userProfile", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "shipments", // Ganti dengan nama koleksi yang sesuai
          localField: "_id",
          foreignField: "userId",
          as: "shipments"
        }
      },
    ]);

    if (userWithProfileAndShipments.length === 0) {
      return res.status(404).json({
        status: false,
        message: "User not found",
        data: null,
      });
    }

    const user = userWithProfileAndShipments[0];

    return res.status(200).json({
      status: true,
      message: "Authentication successful",
      data: { user },
    });
  } catch (err) {
    next(err);
  }
};
  
  const getAllUsers = async (req, res, next) => {
    try {
      const usersWithProfiles = await User.aggregate([
        {
          $lookup: {
            from: "userprofiles",
            localField: "_id",
            foreignField: "userId",
            as: "userProfile"
          }
        },
        { $unwind: { path: "$userProfile", preserveNullAndEmptyArrays: true } },
      ]);
  
      res.status(200).json({
        status: true,
        message: 'All users retrieved successfully',
        data: { users: usersWithProfiles },
      });
    } catch (err) {
      next(err);
    }
  };
  
  const getUserById = async (req, res, next) => {
    try {
      const userId = req.params.id;
      
      const userWithProfile = await User.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(userId) } },
        {
          $lookup: {
            from: "userprofiles",
            localField: "_id",
            foreignField: "userId",
            as: "userProfile"
          }
        },
        { $unwind: { path: "$userProfile", preserveNullAndEmptyArrays: true } },
        { 
          $lookup: {
              from: "shipments", // Ganti dengan nama koleksi yang sesuai
              localField: "_id",
              foreignField: "userId",
              as: "shipments"
          }
      },
      ]);
  
      if (userWithProfile.length === 0) {
        return res.status(404).json({
          status: false,
          message: "User not found",
          data: null,
        });
      }
  
      const user = userWithProfile[0];
      
      res.json({
        status: true,
        message: "User details retrieved successfully",
        data: { user },
      });
    } catch (err) {
      next(err);
    }
  };
  
  
  // const getUserById = async (req, res, next) => {
  //   try {
  //   const userId = req.params.id;
    
  //   const user = await User.findById(userId).populate("userProfile").exec();
     
  //   if (!user) {
  //     return res.status(404).json({
  //       status: false,
  //       message: "User not found",
  //       data: null,
  //     });
  //   }

  //   console.log("User:", user); // Log the user object to the console
  //   if (!user.userProfile) {
  //     console.log("UserProfile not found for this user");
  //   }
    
  //   res.json({
  //     status: true,
  //     message: "User details retrieved successfully",
  //     data: { user },
  //   });
  //   } catch (err) {
  //     next(err);
  //   }
  // };

  const deleteUserById = async (req, res, next) => {
    try {
      const userId = req.params.id;
  
      // Check if the user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found",
          data: null,
        });
      }
  
      // Delete user profile
      await UserProfile.findOneAndDelete({ userId });
  
      // Delete user
      await User.findByIdAndDelete(userId);
  
      res.status(200).json({
        status: true,
        message: "User deleted successfully",
        data: null,
      });
    } catch (err) {
      next(err);
    }
  };

module.exports = {
    register,
    registerNoVerify,
    verifyOtp,
    login,
    authenticateUser,
    getAllUsers,
    getUserById,
    deleteUserById
  };
