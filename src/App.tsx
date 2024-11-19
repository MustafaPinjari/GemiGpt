import React from 'react';
import { ChatMessage } from './components/chat/chat-message';
import { ChatInput } from './components/chat/chat-input';
import { useChatStore } from './lib/store';
import { BrainCircuit, Moon, Sun, Trash2 } from 'lucide-react';
import { Button } from './components/ui/button';
import { useChat } from './hooks/use-chat';

export default function App() {
  const {
    messages,
    isLoading,
    isTyping,
    mode,
    handleSend,
    handleModeChange,
    clearChat,
  } = useChat();

  const theme = useChatStore((state) => state.theme);
  const toggleTheme = useChatStore((state) => state.toggleTheme);

  return (
    <div className={`flex flex-col h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <header className="bg-white dark:bg-gray-800 border-b shadow-sm">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-8 h-8 text-blue-500" />
              <h1 className="text-xl font-semibold dark:text-white">
                Enhanced Chat
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearChat}
                  title="Clear chat"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                title="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400 p-8">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">
                  Welcome to Enhanced Chat!
                </h2>
                <p className="text-sm">
                  Ask me anything, generate images, or use voice commands - I'm here
                  to help!
                </p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                isTyping={isTyping && index === messages.length - 1}
              />
            ))
          )}
        </div>
      </div>

      <ChatInput
        onSend={handleSend}
        disabled={isLoading || isTyping}
        mode={mode}
        onModeChange={handleModeChange}
      />
    </div>
  );
}