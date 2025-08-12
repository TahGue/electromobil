'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X, Phone, Clock } from 'lucide-react';
import { 
  openWhatsAppChat, 
  getDefaultRepairShopMessage, 
  getBusinessHoursMessage,
  isWhatsAppAvailable 
} from '@/lib/whatsapp-service';

interface WhatsAppChatProps {
  phoneNumber?: string;
  businessName?: string;
  position?: 'bottom-right' | 'bottom-left';
  className?: string;
}

export default function WhatsAppChat({ 
  phoneNumber = "0701234567", // Default Swedish mobile number format
  businessName = "Electromobil",
  position = 'bottom-right',
  className = ''
}: WhatsAppChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [businessHours, setBusinessHours] = useState('');

  useEffect(() => {
    setMessage(getDefaultRepairShopMessage());
    setBusinessHours(getBusinessHoursMessage());
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      openWhatsAppChat(phoneNumber, message);
      setIsOpen(false);
    }
  };

  const handleQuickMessage = (quickMsg: string) => {
    const fullMessage = getDefaultRepairShopMessage(quickMsg);
    openWhatsAppChat(phoneNumber, fullMessage);
    setIsOpen(false);
  };

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6'
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 ${className}`}>
      {/* Chat Widget */}
      {isOpen && (
        <div className="mb-4 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border dark:border-gray-700 overflow-hidden animate-in slide-in-from-bottom-2">
          {/* Header */}
          <div className="bg-green-500 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">{businessName}</h3>
                <p className="text-xs opacity-90">Vanligtvis svarar inom några minuter</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Business Hours Info */}
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border-b dark:border-gray-700 flex items-center space-x-2 text-sm text-green-700 dark:text-green-300">
            <Clock className="w-4 h-4" />
            <span>{businessHours}</span>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="mb-4">
              <p className="text-gray-800 dark:text-gray-200 text-sm mb-3">
                Hej! 👋 Hur kan vi hjälpa dig idag?
              </p>

              {/* Quick Action Buttons */}
              <div className="space-y-2 mb-4">
                <button
                  onClick={() => handleQuickMessage('skärmreparation')}
                  className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg text-sm transition-colors text-gray-800 dark:text-gray-200"
                >
                  📱 Skärmreparation
                </button>
                <button
                  onClick={() => handleQuickMessage('batteribyte')}
                  className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg text-sm transition-colors text-gray-800 dark:text-gray-200"
                >
                  🔋 Batteribyte
                </button>
                <button
                  onClick={() => handleQuickMessage('vattenskada')}
                  className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg text-sm transition-colors text-gray-800 dark:text-gray-200"
                >
                  💧 Vattenskada
                </button>
                <button
                  onClick={() => handleQuickMessage('prisförfrågan')}
                  className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg text-sm transition-colors text-gray-800 dark:text-gray-200"
                >
                  💰 Prisförfrågan
                </button>
              </div>

              {/* Custom Message */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                  Eller skriv ditt eget meddelande:
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Skriv ditt meddelande här..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                />
                <button
                  onClick={handleSendMessage}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Skicka meddelande</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t dark:border-gray-600">
            <div className="flex items-center space-x-2 text-xs text-gray-700 dark:text-gray-300">
              <Phone className="w-3 h-3" />
              <span>Powered by WhatsApp</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-500/30"
        aria-label="Öppna WhatsApp chat"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Notification Badge (optional) */}
      {!isOpen && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
      )}
    </div>
  );
}

// Simple WhatsApp Button (alternative minimal version)
export function WhatsAppButton({ 
  phoneNumber = "0701234567",
  message,
  className = '',
  children 
}: {
  phoneNumber?: string;
  message?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const handleClick = () => {
    const defaultMsg = message || getDefaultRepairShopMessage();
    openWhatsAppChat(phoneNumber, defaultMsg);
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-lg transition-colors ${className}`}
    >
      <MessageCircle className="w-4 h-4" />
      <span>{children || 'Chatta med oss'}</span>
    </button>
  );
}
