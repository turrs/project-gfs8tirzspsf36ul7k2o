import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0D0E14] flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-white">404</h1>
          <h2 className="text-2xl font-semibold text-gray-300">Page Not Found</h2>
          <p className="text-gray-400">
            The page you're looking for doesn't exist.
          </p>
        </div>
        
        <Button
          onClick={() => navigate('/')}
          className="bg-[#9AE462] hover:bg-[#8AD452] text-[#1A1A25] font-bold rounded-xl px-6 py-3"
        >
          <Home className="w-4 h-4 mr-2" />
          Go Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;