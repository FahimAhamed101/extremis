import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppDispatch, useAppSelector } from './hooks';
import { chatApi, Message } from '@/redux/features/chat/chatApi';
import { getLocalStorageItem } from '@/lib/browserStorage';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth?.user);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = getLocalStorageItem('accessToken');

    if (!token) {
      setIsConnected(false);
      return;
    }

    if (socketRef.current?.connected) {
      setIsConnected(true);
      return;
    }

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
    const socketInstance = io(socketUrl, {
      auth: { token },
      query: { token },
      transportOptions: {
        polling: {
          extraHeaders: {
            token,
            authorization: `Bearer ${token}`,
          },
        },
      },
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionDelay: 2000,
      reconnectionAttempts: maxReconnectAttempts,
      timeout: 10000,
      upgrade: true,
    });

    socketRef.current = socketInstance;

    socketInstance.on('connect', () => {
      reconnectAttemptsRef.current = 0;
      setIsConnected(true);
    });

    socketInstance.on('disconnect', (reason) => {
      setIsConnected(false);

      if (reason === 'io server disconnect') {
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          setTimeout(() => {
            socketInstance.connect();
          }, 3000);
        }
      }
    });

    socketInstance.on('connect_error', () => {
      setIsConnected(false);
    });

    socketInstance.on('error', () => {
      setIsConnected(false);
    });

    socketInstance.on(
      'chat:message',
      (data: { conversationId: string; message: Message }) => {
        dispatch(
          chatApi.util.invalidateTags([{ type: 'Messages', id: data.conversationId }]),
        );

        setTimeout(() => {
          try {
            dispatch(
              chatApi.util.updateQueryData(
                'listMessages',
                { conversationId: data.conversationId, limit: 200 },
                (draft) => {
                  const exists = draft.data.some((msg) => msg._id === data.message._id);
                  if (!exists) {
                    draft.data = [...draft.data, data.message];
                  }
                },
              ),
            );
          } catch {
            // Ignore cache-update misses when the query data is not in memory yet.
          }
        }, 100);

        try {
          dispatch(
            chatApi.util.updateQueryData(
              'listConversations',
              { page: 1, limit: 20 },
              (draft) => {
                const conversation = draft.data.find(
                  (conv) => conv.conversationId === data.conversationId,
                );
                if (conversation) {
                  conversation.lastMessageText = data.message.content;
                  conversation.lastMessageSenderRole = data.message.senderRole;
                  conversation.lastMessageAt = data.message.createdAt;

                  if (data.message.senderId !== user?.id) {
                    conversation.unreadCount = (conversation.unreadCount || 0) + 1;
                  }

                  const index = draft.data.indexOf(conversation);
                  if (index > 0) {
                    draft.data.splice(index, 1);
                    draft.data.unshift(conversation);
                  }
                }
              },
            ),
          );
        } catch {
          // Ignore cache-update misses when the conversation list is not in memory yet.
        }
      },
    );

    socketInstance.on(
      'chat:read',
      (data: { conversationId: string; readerRole: 'user' | 'sender' }) => {
        dispatch(
          chatApi.util.invalidateTags([{ type: 'Messages', id: data.conversationId }]),
        );

        if (data.readerRole === user?.role) {
          try {
            dispatch(
              chatApi.util.updateQueryData(
                'listConversations',
                { page: 1, limit: 20 },
                (draft) => {
                  const conversation = draft.data.find(
                    (conv) => conv.conversationId === data.conversationId,
                  );
                  if (conversation) {
                    conversation.unreadCount = 0;
                  }
                },
              ),
            );
          } catch {
            // Ignore cache-update misses when the conversation list is not in memory yet.
          }
        }
      },
    );

    return () => {
      socketInstance.off('connect');
      socketInstance.off('disconnect');
      socketInstance.off('connect_error');
      socketInstance.off('error');
      socketInstance.off('chat:message');
      socketInstance.off('chat:read');
      socketInstance.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [dispatch, user?.id, user?.role]);

  return {
    socket: socketRef.current,
    isConnected,
  };
};
