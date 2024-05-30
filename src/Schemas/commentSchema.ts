import mongoose from 'mongoose';


const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    media: [{
        url: String,
        mediaType: String,
    }],
    caption: {
        type: String,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    savePosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    reposts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    commenting: {
        type: Boolean,
        default: false
    },
    HideViewAndLike: {
        type: Boolean,
        default: false
    },

}, { timestamps: true });

export const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema)