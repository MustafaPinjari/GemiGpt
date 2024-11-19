import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useChatStore } from '@/lib/store';
import { Message } from '@/types';
import { config } from '@/config';

export function useChat() {
  const [state, setState] = useState({
    isLoading: false,
    isTyping: false,
    mode: 'chat' as const,
  });

  const messages = useChatStore((state) => state.messages);
  const addMessage = useChatStore((state) => state.addMessage);
  const clearMessages = useChatStore((state) => state.clearMessages);

  const handleSend = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      type: state.mode === 'image' ? 'image' : 'text',
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const genAI = new GoogleGenerativeAI(config.apiKey);

      if (state.mode === 'image') {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
        const result = await model.generateImages({
          prompt: content,
          n: 1,
        });

        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content,
          type: 'image',
          imageUrl: result.images[0].url,
          timestamp: new Date(),
        };

        addMessage(assistantMessage);
      } else {
        const model = genAI.getGenerativeModel({ model: config.model });
        const chat = model.startChat({
          history: messages
            .filter((msg) => msg.type !== 'image')
            .map((msg) => ({
              role: msg.role,
              parts: msg.content,
            })),
          generationConfig: config.generationConfig,
        });

        setState((prev) => ({ ...prev, isTyping: true }));
        const result = await chat.sendMessage(content);
        const response = await result.response;
        const text = response.text();

        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: text,
          type: 'text',
          timestamp: new Date(),
        };

        addMessage(assistantMessage);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false, isTyping: false }));
    }
  };

  const handleModeChange = (mode: 'chat' | 'image') => {
    setState((prev) => ({ ...prev, mode }));
  };

  const clearChat = () => {
    clearMessages();
  };

  return {
    ...state,
    messages,
    handleSend,
    handleModeChange,
    clearChat,
  };
}