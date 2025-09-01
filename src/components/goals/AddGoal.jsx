import React, { useState } from 'react';
import { 
  X, 
  Target, 
  Calendar, 
  DollarSign, 
  Clock, 
  Users, 
  TrendingUp,
  Award,
  Plus,
  Sparkles,
  Save
} from 'lucide-react';
import { createGoal } from '../routes/GoalRoutes';
import { toast } from 'sonner'

const AddGoal = ({ isOpen, onClose }) => {
  const [goalData, setGoalData] = useState({
    title: '',
    goal_type: 'earnings',
    period: 'month',
    target: '',
    start_date: '',
    finish_date: '',
  });

  const goalTypes = [
    {
      id: 'earnings',
      name: 'Total Earnings',
      icon: DollarSign,
      color: 'from-emerald-500 to-emerald-600',
      accent: 'emerald',
      unit: '£',
      description: 'Track your total income'
    },
    {
      id: 'hours',
      name: 'Hours Worked',
      icon: Clock,
      color: 'from-blue-500 to-blue-600',
      accent: 'blue',
      unit: 'hrs',
      description: 'Monitor your working hours'
    },
    {
      id: 'shifts',
      name: 'Number of Shifts',
      icon: Calendar,
      color: 'from-violet-500 to-violet-600',
      accent: 'violet',
      unit: 'shifts',
      description: 'Count completed shifts'
    },
  ];

  const periods = [
    { id: 'month', name: 'Monthly Goal', emoji: '📅' },
    { id: 'year', name: 'Yearly Goal', emoji: '🗓️' }
  ];

  const getDefaultTitle = () => {
    const selectedType = goalTypes.find(t => t.id === goalData.goal_type);
    const selectedPeriod = periods.find(p => p.id === goalData.period);
    
    if (selectedType && selectedPeriod && goalData.target) {
      return `${selectedType.name}: ${goalData.target} (${selectedType.unit}) this ${goalData.period}`;
    }
    return '';
  };

  const getDateRange = () => {
    const now = new Date();
    let start, end;
  
    if (goalData.period === 'month') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    } else {
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    }
  
    return {
      start: start.toLocaleDateString('en-CA'), // YYYY-MM-DD format
      end: end.toLocaleDateString('en-CA')
    };
  };
  

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGoalData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const formatDate = (date) => {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

  const handleSubmit = async () => {
    if (!goalData.target) return;

    try{
      const selectedType = goalTypes.find(t => t.id === goalData.goal_type);
      const dateRange = getDateRange();
    
    const goal = {
      title: getDefaultTitle(),
      type: selectedType.id,
      period: goalData.period,
      goal_type: goalData.goal_type,
      target: parseInt(goalData.target),
      start_date: dateRange.start,
      finish_date: dateRange.end,
      goal_date: new Date().toISOString()
    };

    const response = await createGoal(goal)
    toast.success('Goal created successfully!', {
      description: `Your goal has been created and can now be tracked.`,
    });

    resetForm();
    onClose();

    }catch(e){
      console.log(e)
    }

  };

  const resetForm = () => {
    setGoalData({
      title: '',
      goal_type: 'earnings',
      period: 'month',
      target: '',
      start_date: '',
      finish_date: '',
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const selectedType = goalTypes.find(t => t.id === goalData.type);
  const dateRange = getDateRange();

  return (
    <div>
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 p-8 rounded-xl">             

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Goal Period Selection */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    Goal Period
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {periods?.map((period) => (
                      <button
                        key={period.id}
                        onClick={() => setGoalData({ ...goalData, period: period.id })}
                        className={`p-4 rounded-xl border transition-all text-left ${
                          goalData.period === period.id
                            ? 'border-blue-400 bg-blue-50/30'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{period.emoji}</div>
                          <div className="font-semibold text-sm text-gray-900">{period.name}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Goal Type Selection */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Target className="w-4 h-4 text-purple-500" />
                    What would you like to track?
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {goalTypes?.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setGoalData({ ...goalData, goal_type: type.id })}
                          className={`p-4 rounded-xl border transition-all text-left ${
                            goalData.goal_type === type.id
                              ? 'border-blue-400 bg-blue-50/30'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`bg-gradient-to-r ${type.color} p-2 rounded-xl`}>
                              <Target className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 text-sm">{type.name}</div>
                              <div className="text-xs text-gray-500">{type.description}</div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Target Amount */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    Target Amount
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="target"
                      value={goalData.target}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-400 focus:bg-blue-50/30 focus:outline-none transition-all pr-16"
                      placeholder="1000"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                      {selectedType?.unit}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSubmit}
                  disabled={!goalData.target}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  Create Goal
                </button>
                <button
                  onClick={handleClose}
                  className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-600 font-semibold rounded-xl border border-gray-200 transition-all"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          </div>

          {/* Preview Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Goal Preview</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {goalData.title ? goalData.title : (getDefaultTitle() || 'Goal Title')}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">
                      {goalData.period === 'month' ? 'Monthly Goal' : 'Yearly Goal'}
                    </span>
                  </div>


                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">
                      Target: {goalData.target}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50/30 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Date Range</p>
                  <p className="font-bold text-gray-900 text-sm">
                    {formatDate(dateRange.start)} to {formatDate(dateRange.end)}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
              <h4 className="font-semibold text-gray-900 mb-3">Quick Tips</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Set realistic and achievable targets</li>
                <li>• Track progress regularly for motivation</li>
                <li>• Break large goals into smaller milestones</li>
                <li>• Review and adjust goals as needed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddGoal;