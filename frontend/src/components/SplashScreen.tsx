import React from 'react';
import { Text } from './Text';
import { Container } from './Container';

interface SplashScreenProps {
  currentStep: number;
  progress: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ currentStep, progress }) => {
  const steps = [
    { id: 0, label: 'Authentification', icon: '🔐' },
    { id: 1, label: 'Création de session', icon: '🔄' },
    { id: 2, label: 'Initialisation du chat', icon: '💬' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {/* Floating particles with infinite animations */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-bounce opacity-30" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-purple-300 rounded-full animate-ping opacity-40" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-blue-300 rounded-full animate-pulse opacity-60" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-indigo-300 rounded-full animate-bounce opacity-50" style={{ animationDelay: '1.5s', animationDuration: '2s' }}></div>
        <div className="absolute bottom-1/4 right-1/5 w-1 h-1 bg-white rounded-full animate-ping opacity-30" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-3/4 left-1/5 w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-40" style={{ animationDelay: '2.5s' }}></div>
        
        {/* Gradient orbs with floating animation */}
        <div className="absolute top-1/6 left-1/6 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-20 animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute bottom-1/6 right-1/6 w-40 h-40 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-xl opacity-15 animate-float-reverse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur-lg opacity-25 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main content */}
      <Container maxWidth="lg" className="relative z-10">
        <div className="text-center">
          {/* Logo with enhanced animations */}
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
            <img 
              src="/fraym_demo_logo.png" 
              alt="Fraym Logo" 
              className="h-32 w-auto mx-auto relative z-10 animate-logo-entrance"
            />
          </div>

          {/* Marketing content with staggered animations */}
          <div className="space-y-6">
            <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <Text 
                size="3xl" 
                weight="bold" 
                className="text-white mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent"
              >
                Bienvenue sur Fraym
              </Text>
            </div>
            
            <div className="animate-fade-in-up" style={{ animationDelay: '1s' }}>
              <Text 
                size="xl" 
                className="text-purple-200 mb-4"
              >
                Votre boutique personnalisée
              </Text>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '1.5s' }}>
              <Text 
                size="lg" 
                className="text-blue-200 max-w-md mx-auto leading-relaxed"
              >
                Découvrez une expérience shopping unique, adaptée à vos goûts et préférences
              </Text>
            </div>

            {/* Progress Bar with Checkpoints */}
            <div className="animate-fade-in-up mt-8" style={{ animationDelay: '2s' }}>
              <div className="max-w-md mx-auto">
                {/* Progress Steps */}
                <div className="flex justify-between items-center mb-6">
                  {/* Authentication Step */}
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                      currentStep === 0 ? 'border-yellow-400 bg-yellow-400/20 animate-pulse' :
                      currentStep > 0 ? 'border-green-400 bg-green-400/20' :
                      'border-gray-400 bg-gray-400/20'
                    }`}>
                      {currentStep > 0 ? (
                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      )}
                    </div>
                    <Text size="xs" className="text-purple-200 mt-2 text-center">Authentification</Text>
                  </div>

                  {/* Connection Line 1 */}
                  <div className="flex-1 h-0.5 mx-4 bg-gray-600 relative">
                    <div 
                      className={`h-full bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-1000 ${
                        currentStep > 0 ? 'w-full' : 'w-0'
                      }`}
                    ></div>
                  </div>

                  {/* Session Creation Step */}
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                      currentStep === 1 ? 'border-yellow-400 bg-yellow-400/20 animate-pulse' :
                      currentStep > 1 ? 'border-green-400 bg-green-400/20' :
                      'border-gray-400 bg-gray-400/20'
                    }`}>
                      {currentStep > 1 ? (
                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      )}
                    </div>
                    <Text size="xs" className="text-purple-200 mt-2 text-center">Session</Text>
                  </div>

                  {/* Connection Line 2 */}
                  <div className="flex-1 h-0.5 mx-4 bg-gray-600 relative">
                    <div 
                      className={`h-full bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-1000 ${
                        currentStep > 1 ? 'w-full' : 'w-0'
                      }`}
                    ></div>
                  </div>

                  {/* Chat Initialization Step */}
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                      currentStep === 2 ? 'border-yellow-400 bg-yellow-400/20 animate-pulse' :
                      currentStep > 2 ? 'border-green-400 bg-green-400/20' :
                      'border-gray-400 bg-gray-400/20'
                    }`}>
                      {currentStep > 2 ? (
                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      )}
                    </div>
                    <Text size="xs" className="text-purple-200 mt-2 text-center">Chat</Text>
                  </div>
                </div>

                {/* Overall Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                  <div 
                    className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                {/* Status Text */}
                <Text 
                  size="sm" 
                  className="text-purple-300 text-center animate-pulse"
                >
                  {currentStep === 0 && 'Vérification de votre identité...'}
                  {currentStep === 1 && 'Création de votre session personnalisée...'}
                  {currentStep === 2 && 'Initialisation du chat intelligent...'}
                  {currentStep > 2 && 'Prêt ! Redirection en cours...'}
                </Text>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Custom CSS animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          
          @keyframes float-reverse {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(20px) rotate(-180deg); }
          }
          
          @keyframes logo-entrance {
            0% { transform: scale(0.5) rotate(-10deg); opacity: 0; }
            50% { transform: scale(1.1) rotate(5deg); }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
          }
          
          @keyframes fade-in-up {
            0% { transform: translateY(30px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          
          .animate-float-reverse {
            animation: float-reverse 8s ease-in-out infinite;
          }
          
          .animate-logo-entrance {
            animation: logo-entrance 2s ease-out forwards;
          }
          
          .animate-fade-in-up {
            animation: fade-in-up 1s ease-out forwards;
            opacity: 0;
          }
        `
      }} />
    </div>
  );
};