import { create } from 'zustand';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import useUnreadChatCount from './useUnreadChatCount';
import useNewChats from './useNewChats';

const useStompClient = create((set, get) => ({
  stompClient: null,
  isConnected: false,
  subscriptions: {},

  connectClient: (userId) => {
    const { increaseUnreadChatCounts, decreaeUnreadChatCounts, resetUnreadChatCounts } =
      useUnreadChatCount.getState();
    const { appendNewChats } = useNewChats.getState();
    if (!get().isConnected) {
      const client = new Client({
        webSocketFactory: () =>
          new SockJS(`${import.meta.env.VITE_AXIOS_BASE_URL}/connect`, null, {
            withCredentials: true,
          }),
        // debug: (str) => console.log(str),
        onConnect: () => {
          const destination = `/sub/chat/unread/${userId}`;
          client.subscribe(destination, (message) => {
            const msg = JSON.parse(message.body);
            if (msg.operation === '+') {
              increaseUnreadChatCounts(msg.value);
            } else if (msg.operation === '-') {
              decreaeUnreadChatCounts(msg.value);
            }
          });
          set({
            isConnected: true,
          });
        },
        onDisconnect: () => {
          resetUnreadChatCounts();
          set({ isConnected: false });
        },
        onStompError: (err) => console.log('STOMP Error:', err),
        onWebSocketError: (err) => console.log('WebSocket Error:', err),
      });

      set({ stompClient: client });
      client.activate();
    }
  },
  disconnectClient: () => {
    const { resetUnreadChatCounts } = useUnreadChatCount.getState();
    const client = get().stompClient;
    if (client) {
      resetUnreadChatCounts();
      Object.values(get().subscriptions).forEach((subscription) => subscription.unsubscribe());
      client.deactivate();
      set({ subscriptions: {}, isConnected: false, stompClient: null });
    }
  },
  subscribeChannel: (destination, callback) => {
    const client = get().stompClient;
    if (!client || !get().isConnected) {
      console.error('WebSocket client is not connected.');
      return;
    }

    const subscription = client.subscribe(destination, (message) => {
      const parsedMessage = JSON.parse(message.body);
      callback(parsedMessage);
    });

    set((state) => ({
      subscriptions: { ...state.subscriptions, [destination]: subscription },
    }));

    return subscription;
  },
  unsubscribeChannel: (destination) => {
    const subscriptions = get().subscriptions;
    const subscription = subscriptions[destination];
    if (subscription) {
      subscription.unsubscribe();
      // 구조분해
      const { [destination]: _, ...remainingSubscriptions } = subscriptions;
      set({ subscriptions: remainingSubscriptions });
    } else {
      console.error(`No subscription found for destination: ${destination}`);
    }
  },
  publishToChannel: (destination, body) => {
    const client = get().stompClient;
    if (!client || !get().isConnected) {
      console.error('WebSocket client is not connected.');
      return;
    }

    client.publish({
      destination,
      body: JSON.stringify(body),
    });
  },
}));

export default useStompClient;
