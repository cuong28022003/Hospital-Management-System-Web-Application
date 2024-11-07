import express from 'express';
import {
    sendMessage,
    getUserConversation,
    getAdminConversations,
    getAdminConversationMessages,
    sendAdminMessage,
} from '../controller/chatController.js';
import { isPatientAuthenticated, isAdminAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

// User routes
router.post('/user/messages', isPatientAuthenticated, sendMessage); // User sends a message
router.get('/user/conversation', isPatientAuthenticated, getUserConversation); // User fetches their conversation

// Admin routes
router.get('/admin/conversations', isAdminAuthenticated, getAdminConversations); // Admin fetches all conversations
router.get('/admin/conversations/:conversationId/messages', isAdminAuthenticated, getAdminConversationMessages); // Admin fetches messages from a specific conversation
router.post('/admin/conversations/:conversationId/messages', isAdminAuthenticated, sendAdminMessage); // Admin sends a message to a specific conversation

export default router;
