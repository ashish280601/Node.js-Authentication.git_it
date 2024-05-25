import mongoose from "mongoose";
import userSchema from "./user.schema.js";

export const UserModel = mongoose.model("Users", userSchema);

export default class UserRepository {
  async signUp(userData) {
    // write your code here
    try {
      const newUser = new UserModel(userData);
      await newUser.save();
      return newUser;
    } catch (error) {
      throw new Error("Something went wrong with database", 500);
    }
  }

  async findByEmail(email) {
    // write your code here
    try {
      const user = await UserModel.findOne({ email });
      return user;
    } catch (error) {
      throw new Error("Something went wrong with database", 500);
    }
  }

  async resetPassword(userID, newPassword) {
    // write your code here
    try {
      const resetUser = await UserModel.findByIdAndUpdate(userID);
      if (!resetUser) {
        throw new Error("User not found", 404);
      }
      resetUser.password = newPassword;
      await resetUser.save();
      return resetUser;
    } catch (error) {
      throw new Error("Something went wrong with database", 500);
    }
  }

  async requestResetPassword(userID, otp, currentTime) {
    try {
      const requestUserPassword = await UserModel.findByIdAndUpdate(
        userID,
        {
          otp,
        },
        {
          isExpireOtp: currentTime,
        }
      );
      if (!requestUserPassword) {
        throw new Error("User not found", 404);
      }
      return requestUserPassword;
    } catch (error) {
      throw new Error("Something went wrong with database", 500);
    }
  }

  async verfityOTP(userID) {
    try {
      const otpVerify = await UserModel.findById(userID);
      return otpVerify;
    } catch (error) {
      throw new Error("Something went wrong with database", 500);
    }
  }
}
