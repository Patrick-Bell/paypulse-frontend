import React from 'react';
import { Wrench, Target, CheckCircle, BarChart3, Calendar } from 'lucide-react';

const UnderConstructionPage = () => {
  return (
    <div className="flex items-center justify-center border border-gray-200 rounded-xl p-3">
      <div className="text-center">
        {/* Construction Icon */}
        <div className="mb-8">
          <Wrench className="w-24 h-24 text-gray-400 mx-auto animate-pulse" />
        </div>

        {/* Main Text */}
        <h1 className="text-4xl font-bold text-gray-600 mb-4">
          Page Under Construction
        </h1>
        
        <p className="text-gray-500 text-lg mb-12">
          We're building your personal goal tracking experience!
        </p>

        {/* Coming Features */}
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-gray-600 mb-6">Coming Soon:</h2>
          
          <div className="space-y-4 text-center flex flex-col items-center justify-start">
            <div className="flex items-center space-x-3">
              <Target className="w-5 h-5 text-gray-400" />
              <span className="text-gray-500">Set and track personal goals</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-gray-400" />
              <span className="text-gray-500">Mark milestones as complete</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-5 h-5 text-gray-400" />
              <span className="text-gray-500">View progress analytics</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-gray-500">Set deadlines and reminders</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnderConstructionPage;