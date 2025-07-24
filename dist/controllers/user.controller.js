"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const lodash_1 = __importDefault(require("lodash"));
const middleware_1 = require("../middleware");
const models_1 = require("../models");
const utils_1 = require("../utils");
const nodemailer_1 = __importDefault(require("nodemailer"));
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, birthday, password } = req.body;
        const existingUser = yield models_1.UserModel.findOne({
            where: { email: email },
        });
        if (existingUser) {
            return (0, utils_1.sendResponse)(res, {
                code: 400,
                status: "Error",
                message: "Email đã được đăng ký",
            });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        models_1.UserModel.sync({ alter: true }).then(() => {
            return models_1.UserModel.create({
                name: name,
                email: email,
                birthday: birthday,
                password: hashedPassword,
            });
        });
        return (0, utils_1.sendResponse)(res, {
            code: 200,
            status: "Success",
            message: "Tạo tài khoản thành công.",
        });
    }
    catch (error) {
        next(error);
    }
});
const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        // Check if the email exists
        const user = yield models_1.UserModel.findOne({ where: { email } });
        if (!user) {
            return (0, utils_1.sendResponse)(res, {
                code: 400,
                status: "Error",
                message: "Email không tồn tại.",
            });
        }
        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry
        // Save the OTP and expiry to the user record
        yield user.update({
            otp,
            otpExpiry,
        });
        // Send the OTP via email
        yield sendEmail(email, "Real Film - OTP for Password Reset", `Your OTP code is: ${otp}. It will expire in 5 minutes.`);
        return (0, utils_1.sendResponse)(res, {
            code: 200,
            status: "Success",
            message: "OTP đã được gửi đến email của bạn.",
        });
    }
    catch (error) {
        next(error);
    }
});
const sendEmail = (to, subject, text) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create a transporter using the SMTP configuration
        const transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "gamergaming20192019@gmail.com",
                pass: "whme wzrh sxxs chob", // MAIL_PASSWORD
            },
        });
        // Email options
        const mailOptions = {
            from: '"Real Film" <gamergaming20192019@gmail.com>',
            to,
            subject,
            text, // Email body
        };
        // Send the email
        const info = yield transporter.sendMail(mailOptions);
        console.log("Email sent: %s", info.messageId);
    }
    catch (error) {
        console.error("Error sending email:", error);
    }
});
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield models_1.UserModel.findOne({ where: { email: email } });
        if (!user) {
            return (0, utils_1.sendResponse)(res, {
                code: 400,
                status: "Error",
                message: "Email hoặc mật khẩu không đúng, vui lòng thử lại.",
            });
        }
        const isPasswordMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordMatch) {
            return (0, utils_1.sendResponse)(res, {
                code: 400,
                status: "Error",
                message: "Email hoặc mật khẩu không đúng, vui lòng thử lại.",
            });
        }
        const userObj = lodash_1.default.omit(user.toJSON(), ["password"]);
        const accessToken = (0, middleware_1.generateToken)(user);
        console.log(accessToken);
        return (0, utils_1.sendResponse)(res, {
            code: 200,
            status: "Success",
            message: "Đăng nhập thành công.",
            data: userObj,
            accessToken: accessToken,
        });
    }
    catch (error) { }
});
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, birthday, photoURL } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(200).json({
                code: 400,
                status: "Error",
                message: "Vui lòng kiểm tra lại.",
            });
        }
        const user = yield models_1.UserModel.findByPk(userId);
        if (!user) {
            return res.status(200).json({
                code: 400,
                status: "Error",
                message: "Người dùng không tồn tại.",
            });
        }
        yield user.update({
            name,
            birthday,
            photoURL,
        });
        return res.status(200).json({
            code: 200,
            status: "Success",
            message: "Cập nhật thông tin thành công.",
        });
    }
    catch (error) {
        return res.status(500).json({
            code: 500,
            status: "Error",
            message: "Đã có lỗi xảy ra.",
        });
    }
});
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        const user = yield models_1.UserModel.findByPk(userId, {
            attributes: { exclude: ["password"] },
        });
        if (!user) {
            return (0, utils_1.sendResponse)(res, {
                code: 400,
                status: "Error",
                message: "Người dùng không tồn tại.",
            });
        }
        return (0, utils_1.sendResponse)(res, {
            code: 200,
            status: "Success",
            data: user,
        });
    }
    catch (error) { }
});
const verifyOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        // Check if the user exists
        const user = yield models_1.UserModel.findOne({ where: { email } });
        if (!user) {
            return (0, utils_1.sendResponse)(res, {
                code: 400,
                status: "Error",
                message: "Email không tồn tại.",
            });
        }
        // Validate OTP
        if (user.otp !== otp) {
            return (0, utils_1.sendResponse)(res, {
                code: 400,
                status: "Error",
                message: "OTP không chính xác.",
            });
        }
        // Check if OTP has expired
        if (!user.otpExpiry || new Date() > new Date(user.otpExpiry)) {
            return (0, utils_1.sendResponse)(res, {
                code: 400,
                status: "Error",
                message: "OTP đã hết hạn.",
            });
        }
        // Generate JWT token
        const accessToken = (0, middleware_1.generateToken)(user);
        // Clear OTP and expiry after successful verification
        yield user.update({
            otp: null,
            otpExpiry: null,
        });
        return (0, utils_1.sendResponse)(res, {
            code: 200,
            status: "Success",
            message: "Xác thực OTP thành công.",
            accessToken: accessToken,
        });
    }
    catch (error) {
        next(error);
    }
});
const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.id; // Extract user ID from the JWT token
        const { newPassword } = req.body;
        if (!userId) {
            return (0, utils_1.sendResponse)(res, {
                code: 401,
                status: "Error",
                message: "Unauthorized.",
            });
        }
        // Find the user by ID
        const user = yield models_1.UserModel.findByPk(userId);
        if (!user) {
            return (0, utils_1.sendResponse)(res, {
                code: 404,
                status: "Error",
                message: "User not found.",
            });
        }
        // Hash the new password
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        // Update the password in the database
        yield user.update({ password: hashedPassword });
        return (0, utils_1.sendResponse)(res, {
            code: 200,
            status: "Success",
            message: "Password changed successfully.",
        });
    }
    catch (error) {
        next(error);
    }
});
const UserController = {
    signUp,
    login,
    updateProfile,
    getProfile,
    forgotPassword,
    verifyOtp,
    changePassword,
};
exports.default = UserController;
