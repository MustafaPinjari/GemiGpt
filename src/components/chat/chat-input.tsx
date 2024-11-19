import React, { useState, useEffect } from 'react';
import { Send, Mic, MicOff, MessageSquare, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatStore } from '@/lib/store';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
  mode: 'chat' | 'image';
  onModeChange: (mode: 'chat' | 'image') => void;
}

export function ChatInput({ onSend, disabled, mode, onModeChange }: ChatInputProps) {
  const [input, setInput] = useState('');
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const setListening = useChatStore((state) => state.setListening);

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    setListening(listening);
  }, [listening, setListening]);

  const handleSubmit = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
      resetTranscript();
    }
  };

  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  return (
    <div className="border-t bg-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-2 mb-2">
          <Button
            variant={mode === 'chat' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onModeChange('chat')}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Chat
          </Button>
          <Button
            variant={mode === 'image' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onModeChange('image')}
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Image
          </Button>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder={
                mode === 'chat'
                  ? 'Send a message...'
                  : 'Describe the image you want to generate...'
              }
              className="w-full resize-none rounded-lg border border-gray-200 p-3 pr-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={1}
              disabled={disabled}
            />
            <div className="absolute right-2 top-2 flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleListening}
                className={listening ? 'text-red-500' : 'text-gray-500'}
                disabled={disabled}
              >
                {listening ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={disabled || !input.trim()}
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}