import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    userFrom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    notificationType: {
        type: String,
        enum: ['like', 'comment', 'follow', 'following', ]
    },
    notificationMessage: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});


export const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);