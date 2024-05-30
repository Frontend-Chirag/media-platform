import { Schema, model, models } from 'mongoose';

const messageSchema = new Schema({
    body: String,
    image: String,
    seenIds: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    conversationId: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// virtual for seen relationship
messageSchema.virtual('seen', {
    ref: 'User',
    localField: 'seenIds',
    foreignField: '_id',
    justOne: false
});

// virtual for conversation relationship
messageSchema.virtual('conversation', {
    ref: 'Conversation',
    localField: 'conversationId',
    foreignField: '_id',
    justOne: true
});

// virtual for sender relationship
messageSchema.virtual('sender', {
    ref: 'User',
    localField: 'senderId',
    foreignField: '_id',
    justOne: true
});

messageSchema.set('toObject', { virtuals: true });
messageSchema.set('toJSON', { virtuals: true });

export const Message = models.Message || model('Message', messageSchema)
