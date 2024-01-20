import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        unique: true,
        trim: true,
        index: true
    },
    username: {
        type: String,
        required: [true, 'Please enter your name'],
        unique: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [6, 'Password must be at least 6 characters'],
    },
    bio: {
        type: String,
        default: '',
    },
    profilePicture: {
        type: String,
        default: '',
    },
    gender: {
        type: String,
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
    }],
    friendRequests: [{
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending',
        }
    }],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    savedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    likedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    notifications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notifcation',
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    }],
    blockedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        red: 'User'
    }],
    isOnline: {
        type: Boolean,
        default: false,
    },
    lastSeen: {
        type: Date,
        default: Date.now(),
    },
    isPrivate: {
        type: Boolean,
        default: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    refreshToken: {
        type: String,
    },
    forgotPasswordToken: String,
    verifyEmailToken: String,
});

// password encryption 
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next();
});

// custom methods for password decryption
userSchema.methods.isPasswordCorrect = async function (password: string) {
    return await bcrypt.compare(password, this.password)
};

// generate access token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET!,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
};

// generate refresh token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET!,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

// generate forgot password token
userSchema.methods.generateForgotPasswordToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.FORGOT_PASSWORD_SECRECT!,
        {
            expiresIn: process.env.FORGOT_PASSWORD_EXPIRY!
        }
    )
}

// generate forgot password token
userSchema.methods.generateVerifyEmailToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.VERIFY_EMAIL_SECRECT!,
        {
            expiresIn: process.env.VERIFY_EMAIL_SECRECT_EXPIRY!
        }
    )
}



export const User = mongoose.models.User || mongoose.model('User', userSchema) 