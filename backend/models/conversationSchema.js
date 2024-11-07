import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
        ],
        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
        },
        unreadByUser: {
            type: Boolean,
            default: true,
        },
        unreadByAdmin: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const Conversation = mongoose.model('Conversation', conversationSchema);
export { Conversation };
