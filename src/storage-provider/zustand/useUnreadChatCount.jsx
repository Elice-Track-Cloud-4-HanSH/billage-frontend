import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUnreadChatCount = create(
  persist(
    (set) => ({
      unreadChatCount: 0,
      initUnreadChatCounts: (count) => {
        set({ unreadChatCount: count });
      },
      increaseUnreadChatCounts: (count) => {
        set((state) => ({
          unreadChatCount: state.unreadChatCount + count,
        }));
      },
      decreaeUnreadChatCounts: (count) => {
        set((state) => ({
          unreadChatCount: state.unreadChatCount - count,
        }));
      },
      resetUnreadChatCounts: () => set({ unreadChatCount: 0 }),
    }),
    {
      name: 'unread-chat-count',
      getStorage: () => localStorage,
    }
  )
);
export default useUnreadChatCount;
