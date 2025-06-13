import React, { useState } from 'react';
import { Container } from './Container';
import { Button } from './Button';

interface ZaraMessageInputProps {
  className?: string;
  onSend?: (message: string) => void;
  onVoiceInput?: () => void;
  placeholder?: string;
  [key: string]: any;
}

export const ZaraMessageInput: React.FC<ZaraMessageInputProps> = ({
  className = '',
  onSend,
  onVoiceInput,
  placeholder = "Tapez votre message...",
  ...rest
}) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend?.(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`bg-white border-t border-gray-200 ${className}`} {...rest}>
      <Container maxWidth="4xl" className="py-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              rows={1}
              style={{
                minHeight: '44px',
                maxHeight: '120px',
                resize: 'none'
              }}
            />
          </div>
          <Button
            onClick={onVoiceInput}
            variant="outline"
            color="gray"
            size="md"
            className="p-3 h-11 w-11 flex items-center justify-center"
            title="Enregistrement vocal"
          >
            🎤
          </Button>
          <Button
            onClick={handleSend}
            color="black"
            size="md"
            className="px-6 h-11"
            disabled={!message.trim()}
          >
            Envoyer
          </Button>
        </div>
      </Container>
    </div>
  );
};