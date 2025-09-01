import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Plus, 
  Clock, 
  DollarSign, 
  Calendar,
  TrendingUp,
  Award,
  X,
  Check,
  Zap,
  Goal,
  Trash,
  Dessert
} from 'lucide-react';
import AddGoal from './AddGoal';
import { deleteGoal, getGoals } from '../routes/GoalRoutes';
import { getShifts, getShiftsByDate } from '../routes/ShiftRoutes';
import { toast } from 'sonner'
import Loader from '../loading/Loader'

const Goals = () => {
  const [goals, setGoals] = useState([])
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [goalsWithProgress, setGoalsWithProgress] = useState([]);
  const [loading, setLoading] = useState(true)

  const calculateProgress = async (goal) => {
    const shifts = await getShiftsByDate(goal?.goal_date, goal?.period);

    if (goal.goal_type === 'earnings') {
      const totalEarnings = shifts.reduce((acc, shift) => acc + parseFloat(shift.pay), 0);
      const percentage = Math.min(100, Math.round((totalEarnings / goal.target) * 100));
      return { current: totalEarnings, percentage };
    }

    if (goal.goal_type === 'hours') {
      const totalHours = shifts.reduce((acc, shift) => acc + parseFloat(shift.hours), 0);
      const percentage = Math.min(100, Math.round((totalHours / goal.target) * 100));
      return { current: totalHours, percentage };
    }

    if (goal.goal_type === 'shifts') {
      const totalShifts = shifts.length;
      const percentage = Math.min(100, Math.round((totalShifts / goal.target) * 100));
      return { current: totalShifts, percentage };
    }

    return { current: 0, percentage: 0 };
  };

  const getDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getGoalIcon = (goalType) => {
    switch (goalType) {
      case 'earnings':
        return DollarSign;
      case 'hours':
        return Clock;
      case 'shifts':
        return Target;
      default:
        return Goal;
    }
  };

  const getGoalGradient = (goalType, isCompleted) => {
    if (isCompleted) {
      return 'from-emerald-500 to-emerald-600';
    }
    
    switch (goalType) {
      case 'earnings':
        return 'from-green-500 to-emerald-600';
      case 'hours':
        return 'from-blue-500 to-indigo-600';
      case 'shifts':
        return 'from-purple-500 to-pink-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };


  const getProgressGradient = (goalType, isCompleted) => {
    if (isCompleted) {
      return 'from-emerald-400 via-emerald-500 to-emerald-600';
    }
    
    switch (goalType) {
      case 'earnings':
        return 'from-green-400 via-green-500 to-emerald-500';
      case 'hours':
        return 'from-blue-400 via-blue-500 to-indigo-500';
      case 'shifts':
        return 'from-purple-400 via-purple-500 to-pink-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };


  const fetchGoals = async () => {
    try{
    const response = await getGoals()
    setGoals(response)
    
    // Calculate progress for each goal
    const goalsWithProgressData = await Promise.all(
      response.map(async (goal) => {
        const progressData = await calculateProgress(goal);
        return { ...goal, ...progressData };
      })
    );
    console.log(goalsWithProgressData, 'prgress');
    setGoalsWithProgress(goalsWithProgressData);

    setLoading(false)
  } catch(e){
    console.log(e)
  }
  }

  useEffect(() => {
    fetchGoals()
  }, [showAddGoal])

  const removeGoal = async (id) => {
    try{
      const response = await deleteGoal(id)
      toast.success('Goal deleted successfully', {
        description: 'Your goal has been removed.',
      });
  
      setGoalsWithProgress(prevGoals => prevGoals.filter(goal => goal.id !== id));
    } catch(e){
      console.log(e)
    }
  }

  if (loading) {
    return ( <Loader />)
  }


  return (
    <div>  

    {/* Goals Grid */}
    {showAddGoal ? (
      <AddGoal isOpen={showAddGoal} onClose={() => setShowAddGoal(false)}/>
    ):(
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
          <div 
             className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/30 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[280px]"
             onClick={() => setShowAddGoal(true)} 
         >
             <div className="flex flex-col items-center justify-center text-center">
                 <div className="w-14 h-14 bg-gray-500 group-hover:bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-200">
                     <Plus className="w-7 h-7" />
                 </div>
                 <h3 className="font-semibold text-gray-500 text-lg mb-2 group-hover:text-blue-600 transition-colors">
                     Add Goal
                 </h3>
                 <p className="text-gray-500 text-sm group-hover:text-blue-500 transition-colors">
                     Click to add monthly or yearly goal to track
                 </p>
             </div>
         </div>


        {goalsWithProgress?.map((goal) => {
          const daysLeft = getDaysRemaining(goal?.finish_date);
          const isCompleted = goal.percentage >= 100;
          const IconComponent = getGoalIcon(goal.goal_type);

          return (
            <div 
              key={goal.id} 
              className="group bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-all duration-300 overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 pb-1 flex justify-between">
                <div className="flex items-center justify-between mb-4">
                  <div className={`bg-gradient-to-r ${getGoalGradient(goal.goal_type, isCompleted)} p-3 rounded-xl`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  
                </div>
              
                <p className="text-gray-500 text-sm capitalize">
                  {goal.goal_type} Goal
                </p>
              </div>
             

              {/* Stats */}
              <div className="px-6 pb-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium text-sm">Progress</span>
                  <span className="text-gray-900 font-bold text-md">
                    {(goal.current).toFixed(2)} / {goal?.target}
                    {goal?.goal_type === 'earnings' && ' £'}
                    {goal?.goal_type === 'hours' && ' hrs'}
                    {goal?.goal_type === 'shifts' && ' shifts'}
                  </span>
                </div>
                
                {/* Enhanced Progress Bar */}
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`bg-gradient-to-r ${getProgressGradient(goal.goal_type, isCompleted)} h-2 rounded-full transition-all duration-1000 ease-out relative`}
                      style={{ width: `${goal.percentage}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                </div>

                <div className='text-right mt-[-10px]'>
                  <p className='text-xs text-shadow-gray-500'>{goal.percentage}%</p>
                </div>

                {/* Bottom Stats */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="bg-gray-50 rounded-xl p-1 text-center">
                    <div className="text-xs text-gray-500 font-medium mb-1">Days Left</div>
                    <div className="text-lg font-bold text-gray-900">{daysLeft}</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-1 text-center">
                    <div className="text-xs text-gray-500 font-medium mb-1">Status</div>
                    <div className={`text-lg font-bold ${isCompleted ? 'text-emerald-600' : goal.goal_type === 'earnings' ? 'text-green-600' : goal.goal_type === 'hours' ? 'text-blue-600' : 'text-purple-600'}`}>
                      {isCompleted ? 'Done' : 'Active'}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-1 text-center">
                    <div className="text-xs text-gray-500 font-medium mb-1">Action</div>
                    <div className="flex justify-center items-center cursor-pointer text-center">
                    <Trash onClick={() => removeGoal(goal.id)} className='text-red-600' />
                  </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-1 text-center">
                    <div className="text-xs text-gray-500 font-medium mb-1">Period</div>
                    <div className="flex justify-center items-center cursor-pointer text-center font-bold">{goal.period}</div>
                  </div>
                </div>

                {/* Achievement Banner */}
                {isCompleted ? (
                  <div className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-5 h-5 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold text-sm">Goal Achieved!</span>
                    </div>
                  </div>
                ):(
                  <div className="mt-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-5 h-5 text-amber-600" />
                      <span className="text-amber-700 font-semibold text-sm">Keep Going!</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    )}
      
    </div>
  );
};

export default Goals;