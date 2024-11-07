import { Conversation } from '../models/conversationSchema.js';
import { Message } from '../models/messageSchema.js';

// User sends a message (creates or appends to the conversation)
export const sendMessage = async (req, res, next) => {
  const { content } = req.body;
  const userId = req.user._id;

  try {
    // Check if conversation with user already exists
    let conversation = await Conversation.findOne({ participants: userId });

    // If no conversation, create a new one
    if (!conversation) {
      conversation = new Conversation({
        participants: [userId],  // Replace 'adminId' dynamically or fetch it
      });
      await conversation.save();
    }

    // Create the new message
    const message = new Message({
      sender: userId,
      conversationId: conversation._id,
      content,
    });
    await message.save();

    // Update conversation's last message
    conversation.lastMessage = message._id;
    conversation.unreadByUser = false;
    conversation.unreadByAdmin = true;  // Admin will see the unread message

    await conversation.save();

    res.status(200).json({
      success: true,
      message: 'Message sent successfully!',
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserConversation = async (req, res, next) => {
  const userId = req.user._id;

  try {
    // Find the conversation where the user is a participant
    const conversation = await Conversation.findOne({ participants: userId })
      .populate('participants', 'firstName lastName role')
      .populate('lastMessage', 'content sender')
      .sort({ updatedAt: -1 }); // Sort by last updated time

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'No conversation found for this user.',
      });
    }

    // Fetch all messages for the conversation
    const messages = await Message.find({ conversationId: conversation._id })
      .populate('sender', 'firstName lastName')
      .sort({ createdAt: 1 }); // Sort messages by creation date in ascending order

    res.status(200).json({
      success: true,
      conversation,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find()
      .populate('participants', 'firstName lastName role')
      .populate('lastMessage', 'content sender')
      .sort({ unreadByAdmin: -1, updatedAt: -1 }); // Sort by unread first, then by last updated

    res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminConversationMessages = async (req, res, next) => {
  const { conversationId } = req.params;

  try {
    // Fetch the messages for the specific conversation
    const messages = await Message.find({ conversationId })
      .populate('sender', 'firstName lastName')
      .sort({ createdAt: 1 }); // Sort by creation date in ascending order

    if (!messages.length) {
      return res.status(404).json({
        success: false,
        message: 'No messages found for this conversation.',
      });
    }

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

export const sendAdminMessage = async (req, res, next) => {
  const { conversationId } = req.params;
  const { content } = req.body;

  try {
    // Find the conversation by ID
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found.',
      });
    }

    // Create the admin's message
    const message = new Message({
      sender: req.user._id,  // Admin's ID
      conversationId,
      content,
    });
    await message.save();

    // Update the conversation with the new message
    conversation.lastMessage = message._id;
    conversation.unreadByAdmin = false;
    conversation.unreadByUser = true; // The user will see the unread message

    await conversation.save();

    res.status(200).json({
      success: true,
      message: 'Message sent successfully!',
      data: message,
    });
  } catch (error) {
    next(error);
  }
};
