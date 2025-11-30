import User from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";

export const register = async ({ email, name, password }) => {
    try {
        // 1. Kiểm tra xem email đã tồn tại trong DB chưa
        const userExists = await User.findOne({ email });
        console.log("1");

        if (userExists) {
            // Nếu user tồn tại → ném lỗi với mã custom
            const error = new Error();
            error.message = "User already exists";
            error.errorCode = "USER_ALREADY_EXISTS";
            throw error;
        }

        // 2. Tạo user mới
        // - Mongoose pre-save hook sẽ hash password tự động trước khi lưu
        const user = await User.create({ name, email, password });

        // 3. Tạo JWT token cho user mới
        const token = generateToken(user._id);

        // 4. Trả về thông tin user (không bao gồm password) và token
        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            accessToken: token,
        };
    } catch (error) {
        // 5. Nếu có lỗi (DB error, validation, etc) → ném ra cho caller xử lý
        throw error;
    }
};

export const login = async ({ email, password }) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            //use errorResponse to throw error
            const error = new Error();
            error.message = "Email or password is incorrect";
            error.errorCode = "INVALID_CREDENTIALS";
            throw error;
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            //use errorResponse to throw error
            const error = new Error();
            error.message = "Email or password is incorrect";
            error.errorCode = "INVALID_CREDENTIALS";
            throw error;
        }
        // if (!(email === user.email && password === user.password)) {
        //     const error = new Error();
        //     error.message = "Email or password is incorrect";
        //     error.errorCode = "INVALID_CREDENTIALS";
        //     throw error;
        // }

        const token = generateToken(user._id);
        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            accessToken: token,
        };
    } catch (error) {
        throw error;
    }
};
