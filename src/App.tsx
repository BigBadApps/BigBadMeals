import React, { useState } from 'react';
import { AuthProvider, AuthGuard, AuthContext } from './components/AuthContext';
import { Navigation, Tab } from './components/Navigation';
import { Dashboard } from './pages/Dashboard';
import { Recipes } from './pages/Recipes';
import { Planner } from './pages/Planner';
import { Shopping } from './pages/Shopping';
import { Profile } from './pages/Profile';
import { Toaster } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard navigate={setActiveTab} />;
      case 'recipes': return <Recipes />;
      case 'planner': return <Planner />;
      case 'shopping': return <Shopping />;
      case 'profile': return <Profile />;
      default: return <Dashboard navigate={setActiveTab} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#fdfaf6] pb-24 font-sans text-[#451a03]">
        <AuthGuard>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {renderTab()}
            </motion.div>
          </AnimatePresence>
          <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        </AuthGuard>
        <Toaster position="top-center" richColors />
      </div>
    </AuthProvider>
  );
}
