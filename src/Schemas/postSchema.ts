import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    content: {
        type: String,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            red: 'User'
        },
        commentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    }],
    isDeteted: {
        type: Boolean,
        default: false,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    images: [{
        url: {
            type: String
        }
    }]
}, { timestamps: true });


export const Post = mongoose.models.Post || mongoose.model('Post', postSchema);