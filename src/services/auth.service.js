import User from "../models/user.model.js";
import generateTokens from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

export const register = async ({ email, name, password }) => {
    try {
        // 1. Kiểm tra xem email đã tồn tại trong DB chưa
        const userExists = await User.findOne({ email });

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
        const token = generateTokens(user._id);

        // 4. Trả về thông tin user (không bao gồm password) và token
        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
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
        
        const token = generateTokens(user._id);
        await User.findByIdAndUpdate(user._id, {
            refreshToken: token.refreshToken,
        });
        return token;
    } catch (error) {
        throw error;
    }
};

export const refreshTokenProcess = async (refreshTokenFromCookie) => {
    if (!refreshTokenProcess) {
        throw new Error("Refresh token không tồn tại");
    }
    let decoded;
    try {
        decoded = jwt.verify(refreshTokenFromCookie, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
        throw new Error("Refresh token không hợp lệ");
    }
    const user = await User.findById(decoded.id).select("+refreshToken");
    console.log(user);

    if (!user || user.refreshToken !== refreshTokenFromCookie) {
        throw new Error("Refresh token không hợp lệ");
    }

    const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRE,
    });

    return {
        accessToken: newAccessToken,
    };
};

export const logoutUser = async (userId) => {
    // Xóa refresh token trong DB để đăng xuất
    await User.findByIdAndUpdate(userId, { refreshToken: null });
};
