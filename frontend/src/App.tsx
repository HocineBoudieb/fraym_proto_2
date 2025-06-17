import { ChatApp } from './components/ChatApp';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Arrière-plan animé avec bulles flottantes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-purple-500/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-pink-400/30 to-orange-500/30 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-2xl animate-float-delayed-2"></div>
        <div className="absolute top-20 left-1/4 w-48 h-48 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-20 right-1/4 w-56 h-56 bg-gradient-to-tr from-violet-400/25 to-indigo-500/25 rounded-full blur-3xl animate-float-delayed"></div>
      </div>
      
      {/* Contenu principal */}
      <div className="relative z-10 mb-50">
        <ChatApp />
      </div>
    </div>
  );
}

export default App
