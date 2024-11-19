import React from 'react';
import { Bot, User, Volume2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatStore } from '@/lib/store';
import { textToSpeech } from '@/lib/utils';
import { Message } from '@/types';
import { CodeBlock } from './code-block';

interface ChatMessageProps {
  message: Message;
  isTyping?: boolean;
}

export function ChatMessage({ message, isTyping }: ChatMessageProps) {
  const speaking = useChatStore((state) => state.speaking);
  const setSpeaking = useChatStore((state) => state.setSpeaking);

  const handleSpeak = async () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    setSpeaking(true);
    await textToSpeech(message.content);
    setSpeaking(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  return (
    <div
      className={`flex gap-4 p-6 ${
        message.role === 'assistant' ? 'bg-gray-50' : ''
      }`}
    >
      <div className="w-8 h-8 flex-shrink-0">
        {message.role === 'assistant' ? (
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="prose prose-slate max-w-none">
          <CodeBlock content={message.content} />
        </div>
        {isTyping && (
          <span className="inline-block w-2 h-4 bg-blue-500 animate-pulse rounded-sm ml-1" />
        )}
        {message.role === 'assistant' && (
          <div className="flex gap-2 mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSpeak}
              className="text-gray-500 hover:text-gray-700"
            >
              <Volume2 className="w-4 h-4 mr-2" />
              {speaking ? 'Stop' : 'Speak'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="text-gray-500 hover:text-gray-700"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}