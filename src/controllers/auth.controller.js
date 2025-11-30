import User from "../models/user.model.js";
import { success, error } from "../utils/response.js";
import { register, login, refreshTokenProcess, logoutUser } from "../services/auth.service.js";
import dotenv from "dotenv";
import { validationResult } from "express-validator";
dotenv.config();

const COOKIE_OPTIONS = {
    httpOnly: true, // Cookie chỉ đọc từ server, client không truy cập được → tăng bảo mật
    secure: false, // Để false khi chạy local. Lên production (HTTPS) thì set thành true
    sameSite: "strict", // Giảm nguy cơ tấn công CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // Thời gian sống của cookie: 7 ngày
};

export const registerController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const formattedErrors = errors.array().map((error) => ({
                field: error.param,
                message: error.msg,
            }));
            return error(res, "Validation errors", 400, formattedErrors);
        }
        const { email, password, name } = req.body;
        const user = await register({ email, password, name });
        success(res, "User registered successfully", user);
    } catch (err) {
        error(res, err.message);
    }
};
export const loginController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const formattedErrors = errors.array().map((error) => ({
                field: error.param,
                message: error.msg,
            }));
            return error(res, "Validation errors", 400, formattedErrors);
        }
        const { email, password } = req.body;
        const token = await login({ email, password });
        res.cookie("refreshToken", token.refreshToken, COOKIE_OPTIONS);
        return success(res, "User login successfully", { accessToken: token.accessToken });
    } catch (err) {
        error(res, err.message);
    }
};
export const refresh = async (req, res) => {
    try {
        // Lấy refresh token từ cookie
        const refreshTokenFromCookie = req.cookies.refreshToken;

        // Gọi service để tạo access token mới
        const tokens = await refreshTokenProcess(refreshTokenFromCookie);

        res.status(200).json({
            message: "Lấy token mới thành công",
            accessToken: tokens.accessToken,
        });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};
export const logout = async (req, res) => {
    try {
        // Xóa refresh token trong DB để vô hiệu hóa đăng nhập
        if (req.user) await logoutUser(req.user.id);

        // Xóa cookie refreshToken
        res.clearCookie("refreshToken");
        success(res, "Complete");
    } catch (err) {
        error(res, err.message);
    }
};
export const getProfileController = async (req, res) => {
    try {
        const user = req.user;
        return success(res, "User profile retrieved successfully", { user });
    } catch (err) {
        return error(res, err.message, 500);
    }
};
export const getAllUsers = async (req, res) => {
    try {
        const user = await User.find();
        success(res, "Create user complite", user);
    } catch (err) {
        error(res, err.message);
    }
};
