import User from "../models/user.model.js";
import { success, error } from "../utils/response.js";

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
        const userFind = await User.findById(req.params.id);
        userFind.password = req.body.password;
        userFind.email = req.body.email;
        userFind.name = req.body.name;
        userFind.role = req.body.role;
        const user = await userFind.save();
        success(res, "Update user complete", user);
    } catch (err) {
        error(res, err.message);
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id, req.body);
        success(res, "Delete user complete", user);
    } catch (err) {
        error(res, err.message);
    }
};
