import { useState, useCallback, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePolling } from '../hooks/usePolling';
import { sendMessage } from '../api/greenApi';
import { formatPhoneToChatId, formatChatIdToPhone } from '../utils/phoneFormatter';
import type { Chat as ChatType, ChatMessage, GreenApiNotification } from '../types';
import { LogOut, Send, Phone, MessageSquare } from 'lucide-react';

export const Chat = () => {
  const { credentials, logout } = useAuth();
  const [chats, setChats] = useState<Record<string, ChatType>>({});
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, activeChatId]);

  const handleNewMessage = useCallback((notification: GreenApiNotification) => {
    const { body } = notification;

    if (
      body.typeWebhook !== 'incomingMessageReceived' ||
      body.messageData?.typeMessage !== 'textMessage'
    ) {
      return;
    }

    const chatId = body.senderData.chatId;
    const text = body.messageData.textMessageData?.textMessage || '';

    const newMessage: ChatMessage = {
      id: `in-${notification.receiptId}`,
      chatId,
      text,
      timestamp: body.timestamp * 1000,
      direction: 'incoming',
    };

    setChats((prev) => {
      const existing = prev[chatId] || { chatId, messages: [] };
      return {
        ...prev,
        [chatId]: { ...existing, messages: [...existing.messages, newMessage] },
      };
    });
  }, []);

  usePolling({ credentials: credentials!, onNewMessage: handleNewMessage });

  const handleCreateChat = () => {
    if (!newPhone.trim()) return;
    const chatId = formatPhoneToChatId(newPhone);
    setChats((prev) => ({
      ...prev,
      [chatId]: prev[chatId] || { chatId, messages: [] },
    }));
    setActiveChatId(chatId);
    setNewPhone('');
  };

  const handleSend = async () => {
    if (!inputText.trim() || !activeChatId || !credentials) return;

    const text = inputText.trim();
    const messageId = `out-${Date.now()}`;
    setInputText('');

    const optimisticMessage: ChatMessage = {
      id: messageId,
      chatId: activeChatId,
      text,
      timestamp: Date.now(),
      direction: 'outgoing',
    };

    setChats((prev) => ({
      ...prev,
      [activeChatId]: {
        ...prev[activeChatId],
        messages: [...prev[activeChatId].messages, optimisticMessage],
      },
    }));

    try {
      await sendMessage(credentials, activeChatId, text);
    } catch (err: any) {
      console.error('Send error:', err);

      setChats((prev) => ({
        ...prev,
        [activeChatId]: {
          ...prev[activeChatId],
          messages: prev[activeChatId].messages.filter((m) => m.id !== messageId),
        },
      }));

      setInputText(text);

      setError(
        err.response?.status === 400
          ? 'Number is not registered in WhatsApp.'
          : 'Failed to send message.'
      );
    }
  };

  if (!credentials) return null;

  const activeChat = activeChatId ? chats[activeChatId] : null;

  return (
    <div className="flex h-full bg-gray-50 relative">
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-bold text-gray-800">Chats</h2>
          <button
            onClick={logout}
            className="text-gray-400 hover:text-red-500 transition"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>

        <div className="p-3 border-b border-gray-100 flex gap-2">
          <input
            type="tel"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            placeholder="79991234567"
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 outline-none"
          />
          <button
            onClick={handleCreateChat}
            className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            title="Start chat"
          >
            <Phone size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {Object.values(chats).length === 0 ? (
            <p className="text-sm text-gray-400 text-center mt-8 px-4">
              No active chats. Enter a phone number to start.
            </p>
          ) : (
            Object.values(chats).map((chat) => (
              <button
                key={chat.chatId}
                onClick={() => setActiveChatId(chat.chatId)}
                className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition flex items-center gap-3 ${
                  activeChatId === chat.chatId ? 'bg-green-50' : ''
                }`}
              >
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                  <MessageSquare size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-800 truncate">
                    {formatChatIdToPhone(chat.chatId)}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {chat.messages[chat.messages.length - 1]?.text || 'No messages'}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            <div className="px-6 py-4 bg-white border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">
                {formatChatIdToPhone(activeChat.chatId)}
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-gray-50">
              {activeChat.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                    msg.direction === 'outgoing'
                      ? 'ml-auto bg-green-500 text-white rounded-br-sm'
                      : 'mr-auto bg-white text-gray-800 rounded-bl-sm shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                  <span
                    className={`block text-[10px] mt-1 text-right ${
                      msg.direction === 'outgoing' ? 'text-green-100' : 'text-gray-400'
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-gray-200 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
              <button
                onClick={handleSend}
                className="px-5 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2"
              >
                <Send size={18} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <MessageSquare size={48} className="mb-3 opacity-30" />
            <p>Select a chat or start a new one</p>
          </div>
        )}
      </div>

      {error && (
        <div
          className="absolute bottom-6 right-6 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg cursor-pointer"
          onClick={() => setError(null)}
          title="Click to dismiss"
        >
          {error}
        </div>
      )}
    </div>
  );
};