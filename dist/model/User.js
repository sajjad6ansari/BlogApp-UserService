import mongoose, { Schema } from "mongoose";
const schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    instagram: { type: String },
    facebook: { type: String },
    linkedIn: { type: String },
    bio: { type: String },
    password: { type: String, required: false },
}, { timestamps: true });
const User = mongoose.model("User", schema);
export default User;
