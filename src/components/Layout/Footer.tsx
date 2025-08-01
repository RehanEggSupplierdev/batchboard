import React from 'react';
import { Heart, Code } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 text-gray-600 mb-4">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>for SOSE Lajpat Nagar Class of 2025</span>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Code className="w-4 h-4" />
            <span>BatchBoard Portal - Connecting Classmates</span>
          </div>
          
          <div className="mt-4 text-xs text-gray-400">
            <p>© 2025 BatchBoard. Created by Aftab Alam for the amazing Class of 2025.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;