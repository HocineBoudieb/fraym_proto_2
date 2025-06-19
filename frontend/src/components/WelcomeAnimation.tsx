import React, { useEffect, useState } from 'react';
import { Text } from './Text';

interface WelcomeAnimationProps {
  onFinish?: () => void;
}

export const WelcomeAnimation: React.FC<WelcomeAnimationProps> = ({ onFinish }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 1500),
      setTimeout(() => setStep(2), 3000),
      setTimeout(() => {
        setStep(3);
        onFinish && onFinish();
      }, 5000)
    ];
    return () => {
      timers.forEach(clearTimeout);
    };
  }, [onFinish]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center space-y-8">
      <div className={`transition-opacity duration-700 ${step >= 0 ? 'opacity-100' : 'opacity-0'}`}> 
        <Text size="3xl" weight="bold">Bienvenue sur Fraym</Text>
      </div>
      <div className={`transition-opacity duration-700 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}> 
        <Text size="xl">Every user a tailored frame</Text>
      </div>
      <div className={`transition-opacity duration-700 flex space-x-4 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}> 
        <img src="/fraym_demo_logo.png" alt="Fraym" className="w-24 h-24 object-contain" />
        <img src="/logo-boutique.svg" alt="Boutique" className="w-24 h-24 object-contain" />
      </div>
    </div>
  );
};
