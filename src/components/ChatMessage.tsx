import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Bot, User, Image as ImageIcon } from 'lucide-react';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
  isTyping?: boolean;
}

export function ChatMessage({ message, isTyping }: ChatMessageProps) {
  return (
    <div className={`flex gap-4 p-6 ${message.role === 'assistant' ? 'bg-gray-50' : ''}`}>
      <div className="w-8 h-8 flex-shrink-0">
        {message.role === 'assistant' ? (
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            {message.type === 'image' ? (
              <ImageIcon className="w-5 h-5 text-white" />
            ) : (
              <Bot className="w-5 h-5 text-white" />
            )}
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        )}
      </div>
      <div className="prose prose-slate max-w-none flex-1">
        {message.type === 'image' && message.imageUrl ? (
          <div>
            <img 
              src={message.imageUrl} 
              alt={message.content}
              className="rounded-lg max-w-lg w-full object-cover"
              loading="lazy"
            />
            <p className="text-sm text-gray-500 mt-2">{message.content}</p>
          </div>
        ) : (
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
        {isTyping && (
          <span className="inline-block w-2 h-4 bg-blue-500 animate-pulse rounded-sm ml-1" />
        )}
      </div>
    </div>
  );
}