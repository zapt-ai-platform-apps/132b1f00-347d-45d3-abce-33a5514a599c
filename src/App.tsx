import React from 'react';
import './index.css';
import TranslationManager from './components/TranslationManager';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="container mx-auto px-4 py-8">
        <TranslationManager />
        
        <footer className="mt-12 text-center text-sm text-gray-600">
          <div className="mb-2">
            <a 
              href="https://www.zapt.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Made on ZAPT
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;