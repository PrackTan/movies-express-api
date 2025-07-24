import bcrypt from "bcryptjs";
import { RequestHandler } from "express";
import _ from "lodash";
import { ResponseResult, User } from "../interfaces";
import { generateToken } from "../middleware";
import { UserModel } from "../models";
import { LoginBody, SignupBody, UpdateUserBody } from "../schema";
import { sendResponse } from "../utils";
import crypto from "crypto";
import nodemailer from "nodemailer";

const signUp: RequestHandler<
  unknown,
  ResponseResult<User | undefined>,
  SignupBody,
  unknown
> = async (req, res, next) => {
  try {
    const { name, email, birthday, password } = req.body;

    const existingUser = await UserModel.findOne({
      where: { email: email },
    });

    if (existingUser) {
      return sendResponse(res, {
        code: 400,
        status: "Error",
        message: "Email đã được đăng ký",
      });
    }

    const hashedPassword = await bcrypt.hash(password as string, 10);

    UserModel.sync({ alter: true }).then(() => {
      return UserModel.create({
        name: name,
        email: email,
        birthday: birthday,
        password: hashedPassword,
      });
    });

    return sendResponse(res, {
      code: 200,
      status: "Success",
      message: "Tạo tài khoản thành công.",
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword: RequestHandler<
    unknown,
    ResponseResult<undefined>,
    { email: string },
    unknown
> = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Check if the email exists
    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
      return sendResponse(res, {
        code: 400,
        status: "Error",
        message: "Email không tồn tại.",
      });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    // Save the OTP and expiry to the user record
    await user.update({
      otp,
      otpExpiry,
    });

    // Send the OTP via email
    await sendEmail(
        email,
        "Real Film - OTP for Password Reset",
        `Your OTP code is: ${otp}. It will expire in 5 minutes.`
    );

    return sendResponse(res, {
      code: 200,
      status: "Success",
      message: "OTP đã được gửi đến email của bạn.",
    });
  } catch (error) {
    next(error);
  }
};

const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    // Create a transporter using the SMTP configuration
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: "gamergaming20192019@gmail.com", // MAIL_USERNAME
        pass: "whme wzrh sxxs chob", // MAIL_PASSWORD
      },
    });

    // Email options
    const mailOptions = {
      from: '"Real Film" <gamergaming20192019@gmail.com>', // MAIL_FROM_ADDRESS and MAIL_FROM_NAME
      to, // Recipient email
      subject, // Email subject
      text, // Email body
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const login: RequestHandler<
  unknown,
  ResponseResult<User | undefined>,
  LoginBody,
  unknown
> = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ where: { email: email } });

    if (!user) {
      return sendResponse(res, {
        code: 400,
        status: "Error",
        message: "Email hoặc mật khẩu không đúng, vui lòng thử lại.",
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      password as string,
      user.password as string
    );

    if (!isPasswordMatch) {
      return sendResponse(res, {
        code: 400,
        status: "Error",
        message: "Email hoặc mật khẩu không đúng, vui lòng thử lại.",
      });
    }

    const userObj = _.omit(user.toJSON() as User, ["password"]);

    const accessToken = generateToken(user);

    console.log(accessToken);

    return sendResponse(res, {
      code: 200,
      status: "Success",
      message: "Đăng nhập thành công.",
      data: userObj as User,
      accessToken: accessToken,
    });
  } catch (error) {}
};

const updateProfile: RequestHandler<
  unknown,
  ResponseResult<User | undefined>,
  UpdateUserBody,
  unknown
> = async (req, res) => {
  try {
    const { name, birthday, photoURL } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(200).json({
        code: 400,
        status: "Error",
        message: "Vui lòng kiểm tra lại.",
      });
    }

    const user = await UserModel.findByPk(userId);

    if (!user) {
      return res.status(200).json({
        code: 400,
        status: "Error",
        message: "Người dùng không tồn tại.",
      });
    }

    await user.update({
      name,
      birthday,
      photoURL,
    });

    return res.status(200).json({
      code: 200,
      status: "Success",
      message: "Cập nhật thông tin thành công.",
    });
  } catch (error) {
      return res.status(500).json({
      code: 500,
      status: "Error",
      message: "Đã có lỗi xảy ra.",
  });
}

};

const getProfile: RequestHandler<
  unknown,
  ResponseResult<User | undefined>,
  unknown,
  unknown
> = async (req, res) => {
  try {
    const userId = req.user?.id;
    const user = await UserModel.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return sendResponse(res, {
        code: 400,
        status: "Error",
        message: "Người dùng không tồn tại.",
      });
    }
    return sendResponse(res, {
      code: 200,
      status: "Success",
      data: user,
    });
  } catch (error) {}
};

const verifyOtp: RequestHandler<
    unknown,
    ResponseResult<{ accessToken?: string }>,
    { email: string; otp: string },
    unknown
> = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    // Check if the user exists
    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
      return sendResponse(res, {
        code: 400,
        status: "Error",
        message: "Email không tồn tại.",
      });
    }

    // Validate OTP
    if (user.otp !== otp) {
      return sendResponse(res, {
        code: 400,
        status: "Error",
        message: "OTP không chính xác.",
      });
    }

    // Check if OTP has expired
    if (!user.otpExpiry || new Date() > new Date(user.otpExpiry)) {
      return sendResponse(res, {
        code: 400,
        status: "Error",
        message: "OTP đã hết hạn.",
      });
    }

    // Generate JWT token
    const accessToken = generateToken(user);

    // Clear OTP and expiry after successful verification
    await user.update({
      otp: null,
      otpExpiry: null,
    });

    return sendResponse(res, {
      code: 200,
      status: "Success",
      message: "Xác thực OTP thành công.",
      accessToken: accessToken,
    });
  } catch (error) {
    next(error);
  }
};

const changePassword: RequestHandler<
    unknown,
    ResponseResult<undefined>,
    { newPassword: string },
    unknown
> = async (req, res, next) => {
  try {
    const userId = req.user?.id; // Extract user ID from the JWT token
    const { newPassword } = req.body;

    if (!userId) {
      return sendResponse(res, {
        code: 401,
        status: "Error",
        message: "Unauthorized.",
      });
    }

    // Find the user by ID
    const user = await UserModel.findByPk(userId);
    if (!user) {
      return sendResponse(res, {
        code: 404,
        status: "Error",
        message: "User not found.",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    await user.update({ password: hashedPassword });

    return sendResponse(res, {
      code: 200,
      status: "Success",
      message: "Password changed successfully.",
    });
  } catch (error) {
    next(error);
  }
};

const UserController = {
  signUp,
  login,
  updateProfile,
  getProfile,
  forgotPassword,
  verifyOtp,
  changePassword,
};

export default UserController;
