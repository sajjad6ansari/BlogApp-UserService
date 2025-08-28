import User from "../model/User.js";
import jwt from "jsonwebtoken";
import TryCatchHandler from "../utils/TryCatchHandler.js";
import getBuffer from "../utils/dataUri.js";
import { v2 as cloudinary } from "cloudinary";
//login
export const loginUser = TryCatchHandler(async (req, res) => {
    const { email, name, image } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
        user = new User({ email, name, image });
        await user.save();
    }
    const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: "5d" });
    res.status(200).json({ message: "Login successful", user, token });
});
//Get My Profile
export const myProfile = TryCatchHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "Unauthorized: User not found" });
    }
    res.status(200).json(user);
});
//Get User Profile
export const getUserProfile = TryCatchHandler(async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        res.status(400).json({ message: "Bad Request: User ID is required" });
        return;
    }
    const user = await User.findById(userId);
    if (!user) {
        res.status(401).json({ message: "Unauthorized: User not found from given ID" });
        return;
    }
    res.status(200).json(user);
});
//Update User Profile
export const UpdateUserProfile = TryCatchHandler(async (req, res) => {
    if (!req.body) {
        res.status(400).json({ message: "Bad Request: Body is required" });
        return;
    }
    const { name, instagram, image, facebook, bio } = req.body;
    const user = await User.findByIdAndUpdate(req.user?._id, { name, instagram, image, facebook, bio }, { new: true });
    const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: "5d" });
    res.status(200).json({ user, token, message: "Profile updated successfully" });
});
export const updateProfilePicture = TryCatchHandler(async (req, res) => {
    const file = req.file;
    if (!file) {
        res.status(400).json({ message: "Bad Request: File is required" });
        return;
    }
    const fileBuffer = getBuffer(file);
    if (!fileBuffer || !fileBuffer.content) {
        res.status(400).json({ message: "Bad Request: Failed to generate buffer" });
        return;
    }
    const cloud = await cloudinary.uploader.upload(fileBuffer.content, {
        folder: "blogs"
    });
    if (!cloud) {
        res.status(500).json({ message: "Internal Server Error: Failed to upload image" });
        return;
    }
    const user = await User.findByIdAndUpdate(req?.user?._id, { image: cloud.secure_url }, { new: true });
    if (!user) {
        res.status(404).json({ message: "Not Found: User not found" });
        return;
    }
    const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: "5d" });
    res.status(200).json({ message: "Profile picture updated successfully", user, x: 123 });
});
