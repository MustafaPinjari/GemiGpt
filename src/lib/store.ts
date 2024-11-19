import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Message } from '@/types';

interface ChatStore {
  messages: Message[];
  theme: 'light' | 'dark';
  speaking: boolean;
  listening: boolean;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  toggleTheme: () => void;
  setSpeaking: (speaking: boolean) => void;
  setListening: (listening: boolean) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      messages: [],
      theme: 'light',
      speaking: false,
      listening: false,
      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      clearMessages: () => set({ messages: [] }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setSpeaking: (speaking) => set({ speaking }),
      setListening: (listening) => set({ listening }),
    }),
    {
      name: 'chat-store',
    }
  )
);