import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        refreshToken: {
            type: String,
            select: false, // Mặc định không trả về khi query
        },
    },
    { timestamps: true }
);
userSchema.pre("save", async function (next) {
    // 1. Kiểm tra xem field 'password' có bị thay đổi không
    //    Nếu không thay đổi → không cần hash lại, gọi next()
    console.log(3);
    
    if (!this.isModified("password")) return next();
    console.log(4);
    
    // 2. Hash password mới trước khi lưu vào database
    //    10 là số salt rounds, càng cao càng bảo mật nhưng tốn thời gian
    this.password = await bcrypt.hash(this.password, 10);

    // next(); // tiếp tục save document
});

// Method để so sánh password nhập vào với password đã hash
userSchema.methods.comparePassword = async function (password) {
    // bcrypt.compare trả về true nếu password khớp, false nếu không
    return await bcrypt.compare(password, this.password);
};
const User = mongoose.model("User", userSchema);
export default User;
