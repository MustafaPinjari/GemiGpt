import React, { useState, KeyboardEvent } from 'react';
import { Send, MessageSquare, Image as ImageIcon } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
  mode: 'chat' | 'image';
  onModeChange: (mode: 'chat' | 'image') => void;
}

export function ChatInput({ onSend, disabled, mode, onModeChange }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t bg-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => onModeChange('chat')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm ${
              mode === 'chat'
                ? 'bg-blue-100 text-blue-700'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Chat
          </button>
          <button
            onClick={() => onModeChange('image')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm ${
              mode === 'image'
                ? 'bg-blue-100 text-blue-700'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Image
          </button>
        </div>
        <div className="flex gap-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={mode === 'chat' ? "Send a message..." : "Describe the image you want to generate..."}
            className="flex-1 resize-none rounded-lg border border-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={1}
            disabled={disabled}
          />
          <button
            onClick={handleSubmit}
            disabled={disabled || !input.trim()}
            className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}