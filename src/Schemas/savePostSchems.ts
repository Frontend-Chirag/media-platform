import mongoose from 'mongoose';

const savedPostsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    savedpostsId:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }]
}, { timestamps: true });

export const SavePosts = mongoose.models.SavedPosts || mongoose.model('SavedPosts', savedPostsSchema);