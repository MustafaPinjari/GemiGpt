import React from 'react';
import { Key } from 'lucide-react';

interface ApiKeyInputProps {
  apiKey: string;
  onChange: (key: string) => void;
}

export function ApiKeyInput({ apiKey, onChange }: ApiKeyInputProps) {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex gap-4 items-center bg-white rounded-lg border p-4">
        <Key className="w-6 h-6 text-gray-400" />
        <input
          type="password"
          value={apiKey}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your Gemini API key to override default..."
          className="flex-1 focus:outline-none"
        />
      </div>
    </div>
  );
}