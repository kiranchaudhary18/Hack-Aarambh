import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'sonner';

function App() {
  return (
    <BrowserRouter>
      {/* Dynamic Toast Alerts Provider */}
      <Toaster 
        position="top-right" 
        theme="dark" 
        richColors 
        toastOptions={{
          style: {
            background: 'rgba(13, 18, 30, 0.95)',
            border: '1px solid rgba(0, 242, 254, 0.2)',
            color: '#fff',
            backdropFilter: 'blur(12px)',
          }
        }}
      />
      
      {/* Global Application Router */}
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
