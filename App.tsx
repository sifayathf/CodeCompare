
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { HomeView } from './components/HomeView';
import { FolderCompareView } from './components/FolderCompareView';
import { TextCompareView } from './components/TextCompareView';
import { MenuBar } from './components/MenuBar';
import { SessionType } from './types';

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const [activeSession, setActiveSession] = useState<string | null>(null);

  const handleSessionSelect = (type: SessionType) => {
    setActiveSession(type);
    if (type === SessionType.TEXT_COMPARE) {
      navigate('/text');
    } else {
      navigate('/folder');
    }
  };

  const handleHome = () => {
    setActiveSession(null);
    navigate('/');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-sm overflow-hidden border-2 border-gray-300">
      {/* Title Bar Simulation */}
      <div className="bg-[#f0f0f0] border-b border-gray-300 px-3 py-1 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-500 rounded-sm"></div>
          <span className="text-gray-700 font-medium">
            {activeSession ? `${activeSession} - Web Compare` : 'Web Compare'}
          </span>
        </div>
        <div className="flex gap-4">
          <button className="text-gray-500 hover:text-gray-800">_</button>
          <button className="text-gray-500 hover:text-gray-800">▢</button>
          <button className="text-gray-500 hover:text-red-600">✕</button>
        </div>
      </div>

      <MenuBar onHome={handleHome} />

      <main className="flex-1 relative overflow-hidden">
        <Routes>
          <Route path="/" element={<HomeView onSelectSession={handleSessionSelect} />} />
          <Route path="/folder" element={<FolderCompareView />} />
          <Route path="/text" element={<TextCompareView />} />
        </Routes>
      </main>

      {/* Status Bar */}
      <footer className="bg-[#f0f0f0] border-t border-gray-300 px-3 py-1 flex items-center justify-between text-[11px] text-gray-600 select-none">
        <div className="flex gap-4">
          <span>0 differences</span>
          <span>Filtered: *.*</span>
        </div>
        <div>
          <span>Editing disabled</span>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
