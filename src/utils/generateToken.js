import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateTokens = (userId) => {
    // Tạo access token
    const accessToken = jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRE,
    });

    // Tạo refresh token
    const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRE,
    });

    return { accessToken, refreshToken };
};

export default generateTokens;
