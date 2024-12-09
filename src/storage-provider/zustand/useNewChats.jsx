import { create } from 'zustand';

const useNewChats = create((set) => ({
  newChats: [],
  clearNewChats: () => set({ newChats: [] }),
  appendNewChats: (chat) => set((state) => ({ newChats: [...state.newChats, chat] })),
}));
export default useNewChats;
