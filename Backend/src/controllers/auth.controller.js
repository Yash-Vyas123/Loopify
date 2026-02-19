import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
export async function signup(req, res) {

    const { email, password, fullName, gender } = req.body

    try {

        if (!email || !password || !fullName || !gender) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exist, please use different one" });
        }

        const idx = Math.floor(Math.random() * 50) + 1; // 1-50 for male/female
        const avatarType = gender === "male" ? "boy" : gender === "female" ? "girl" : "public";

        // If "public", we use the generic endpoint, else we use gender specific ones if available or just stick to index
        // The API https://avatar.iran.liara.run/public/boy?username=Scott for example
        const randomAvatar = gender === "male"
            ? `https://avatar.iran.liara.run/public/boy?username=${fullName.split(" ")[0]}${idx}`
            : gender === "female"
                ? `https://avatar.iran.liara.run/public/girl?username=${fullName.split(" ")[0]}${idx}`
                : `https://avatar.iran.liara.run/public/${idx}`;

        const newUser = await User.create({
            email,
            fullName,
            password,
            gender,
            profilePic: randomAvatar,
        });



        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic || "",
            });
            console.log(`Stream user created for ${newUser.fullName}`);
        } catch (error) {
            console.log("Error creating Stream user:", error);
        }


        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
        });

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });

        res.status(201).json({ success: true, user: newUser });


    } catch (error) {
        console.log("Error in signup controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid email or password" });

        const isPasswordCorrect = await user.matchPassword(password)
        if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid email or password" });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d",
        });

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });

        // Safety sync with Stream
        try {
            await upsertStreamUser({
                id: user._id.toString(),
                name: user.fullName,
                image: user.profilePic || "",
            });
        } catch (streamError) {
            console.log("Error syncing with Stream on login:", streamError.message);
        }

        res.status(200).json({ success: true, user });

    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });

    }

}

export function logout(req, res) {
    res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ success: true, message: "Logout Successful" });
}

export async function onboard(req, res) {
    try {
        const userID = req.user._id;
        const { fullName, bio, nativeLanguage, learningLanguage, location, gender } = req.body;

        if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location || !gender) {
            return res.status(400).json({
                message: "All fields are required",
                missingFields: [
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location",
                    !gender && "gender",
                ].filter(Boolean),

            });
        }


        const updatedUser = await User.findByIdAndUpdate(userID, {
            ...req.body,
            isOnboarded: true,
        }, { new: true });

        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: updatedUser.profilePic || "",
            });
            console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`);
        } catch (streamError) {
            console.log("Enter updating Stream user during onboarding:", streamError.message);

        }

        res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        console.error("Onboarding error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}