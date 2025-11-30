import User from "../models/user.model.js";
import { success, error } from "../utils/response.js";
import { register, login } from "../services/auth.service.js";
import dotenv from "dotenv";
import { validationResult } from "express-validator";
dotenv.config();
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
        const user = await login({ email, password });
        return success(res, "User login successfully", user);
    } catch (err) {
        error(res, err.message);
    }
};
export const getProfileController = async (req, res) => {
    try {
        const user = req.user;
        return success(res, "User profile retrieved successfully", user);
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

export const getUser = async (req, res) => {
    try {
        const user = await User.find(req.params.id);
        success(res, "Create user complite", user);
    } catch (err) {
        error(res, err.message);
    }
};

export const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body);
        success(res, "Create user complite", user);
    } catch (err) {
        error(res, err.message);
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id, req.body);
        success(res, "Create user complite", user);
    } catch (err) {
        error(res, err.message);
    }
};
