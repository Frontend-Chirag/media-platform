import { Schema, model, models } from 'mongoose';

const conversationSchema = new Schema({

    lastMessageAt: {
        type: Date,
        default: Date.now()
    },
    name: String,
    isGroup: Boolean,
    messageIds: [{
        type: Schema.Types.ObjectId,
        ref: 'Message'
    }],
    userIds: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]

}, {
    timestamps: true
});

// virtual for messages relationship
conversationSchema.virtual('message', {
    ref: 'Message',
    localField: 'messageIds',
    foreignField: '_id',
    justOne: false
});

// virtual for users relationship
conversationSchema.virtual('users', {
    ref: 'User',
    localField: 'userIds',
    foreignField: '_id',
    justOne: false
})


conversationSchema.set('toObject', { virtuals: true });
conversationSchema.set('toJSON', { virtuals: true });

export const Conversation = models.Conversation || model('Conversation', conversationSchema)