import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    media: [{
        url: String,
        mediaType: String,
        tags: [{
            taggedUserId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            username: String,
            positionX: Number,
            positionY: Number,
        }]
    }],
    audio: {
        url: String,
        title: String,
        artist: String,
        startTime: Number,
        endTime: Number
    },
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
        ref: 'Post'
    }],
    parentPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    commenting: {
        type: Boolean,
        default: false
    },
    HideViewAndLike: {
        type: Boolean,
        default: false
    },
    isPinned: {
        type: Boolean,
        default: false
    },

}, { timestamps: true });


export const Post = mongoose.models.Post || mongoose.model('Post', postSchema);