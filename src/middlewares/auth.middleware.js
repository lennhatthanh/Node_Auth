import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { error } from "../utils/response.js";

export const protect = async (req, res, next) => {
    try {
        // Lấy token từ header Authorization (format: "Bearer <token>")
        const token = req.header("Authorization").replace("Bearer ", "");

        // Không có token → chặn ngay
        if (!token) {
            return error(res, "No token, authorization denied", 401);
        }

        // Giải mã token bằng JWT_SECRET để lấy payload (id user)
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        // Gắn thông tin user vào req.user (bỏ password để tránh lộ)
        req.user = await User.findById(decoded.id).select("-password");

        // Cho request đi tiếp vào controller
        next();
    } catch (err) {
        // Token hết hạn / sai signature / corrupt
        return error(res, "Token is not valid", 401);
    }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    // req.user đã có được từ middleware 'protect' chạy trước đó
    if (!roles.includes(req.user.role)) {
      return error(
        res, 
        'Bạn không có quyền thực hiện hành động này', 
        403, 
        'FORBIDDEN'
      );
    }
    next();
  };
};