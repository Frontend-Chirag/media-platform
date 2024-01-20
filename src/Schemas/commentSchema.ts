import mongoose from 'mongoose';


const commentSchema = new mongoose.Schema({
    content: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment',
    }],
    isDeleted:{
        type: Boolean,
        default: false,
    },
    

}, { timestamps: true });

export const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema)