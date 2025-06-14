import React from 'react';
import type { Cart as CartType } from '../types';
import { Card } from './Card';
import { Text } from './Text';
import { Heading } from './Heading';
import { Button } from './Button';
import { Flex } from './Flex';

interface CartProps {
  cart: CartType;
  onClose?: () => void;
  className?: string;
}

export const Cart: React.FC<CartProps> = ({ cart, onClose, className = '' }) => {
  return (
    <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 ${className}`}>
      <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <Flex justify="between" align="center" className="mb-6">
            <Heading size="lg" className="text-gray-800">
              Mon Panier
            </Heading>
            {onClose && (
              <Button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            )}
          </Flex>

          {/* Cart Items */}
          {cart.items.length === 0 ? (
            <div className="text-center py-8">
              <Text color="gray-500" className="mb-4">
                Votre panier est vide
              </Text>
              <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v5a2 2 0 01-2 2H9a2 2 0 01-2-2v-5m6-5V7a2 2 0 00-2-2H9a2 2 0 00-2 2v1" />
              </svg>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                  <Flex justify="between" align="start" className="mb-2">
                    <div className="flex-1">
                      <Text weight="medium" className="text-gray-800 mb-1">
                        {item.productName}
                      </Text>
                      <Text size="sm" color="gray-600">
                        {(item.unitPrice || 0).toFixed(2)}€ × {item.quantity || 0}
                      </Text>
                    </div>
                    <Text weight="medium" className="text-gray-800">
                      {(item.totalPrice || 0).toFixed(2)}€
                    </Text>
                  </Flex>
                </div>
              ))}

              {/* Total */}
              <div className="border-t border-gray-200 pt-4 mt-6">
                <Flex justify="between" align="center" className="mb-2">
                  <Text color="gray-600">
                    Total articles: {cart.totalItems || 0}
                  </Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Heading size="md" className="text-gray-800">
                    Total:
                  </Heading>
                  <Heading size="md" className="text-blue-600">
                    {(cart.totalPrice || 0).toFixed(2)}€
                  </Heading>
                </Flex>
              </div>

              {/* Actions */}
              <div className="mt-6 space-y-3">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition-colors">
                  Procéder au paiement
                </Button>
                {onClose && (
                  <Button 
                    onClick={onClose}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl transition-colors"
                  >
                    Continuer mes achats
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};