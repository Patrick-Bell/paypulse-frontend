import React, { useEffect, useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Target, 
  DollarSign, 
  TrendingUp,
  CheckCircle,
  Clock4,
  Mail,
  Phone,
  CircleX,
  Crown,
  Zap,
  Shield,
  BarChart3,
  ArrowRight,
  Briefcase,
  User,
} from 'lucide-react';
import { getShifts, getShiftsByDate, getWeeklyShifts } from '../routes/ShiftRoutes';
import { getContacts } from '../routes/ContactRoutes';
import Loader from '../loading/Loader';
import { getGoals } from '../routes/GoalRoutes';
import { formatCurrency } from '../functions/Format' 
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import SixMonthChart from './BarChart';
import PayPulsePro from './PayPulsePro';
import CountUp from 'react-countup'
import StaggerAppear from '../animations/StaggerAppear';
import { useAuth } from '../context/AuthContext'
import Expenses from './Expenses'


const Overview = () => {

  const [upcomingShifts, setUpcomingShifts] = useState([])
  const [contacts, setContacts] = useState([])
  const [weekShifts, setWeekShifts] = useState([])
  const [loading, setLoading] = useState(true)
  const [goals, setGoals] = useState([])
  const [goalsWithProgress, setGoalsWithProgress] = useState([])
  const [shifts, setShifts] = useState([])
  const { user } = useAuth()

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


  const fetchShifts = async () => {
    try {
    const response = await getShifts()
    setShifts(response)
    const upcomingShifts = response.filter(shift => new Date(shift.date) >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 3);
    setUpcomingShifts(upcomingShifts);

    const weekShifts = await getWeeklyShifts()
    setWeekShifts(weekShifts)

    let contacts = await getContacts()
    contacts.slice(0, 3)
    setContacts(contacts)

    const goals = (await getGoals()).slice(0, 4)
    setGoals(goals)

    const goalsWithProgressData = await Promise.all(
      goals.map(async (goal) => {
        const progressData = await calculateProgress(goal);
        console.log(progressData)
        return { ...goal, ...progressData };
      })
    );
    setGoalsWithProgress(goalsWithProgressData);


    setLoading(false)

    }catch(e){
      console.log(e)
    }
  }

  useEffect(() => {
    fetchShifts()
  }, [])


  if (loading) {
    return (
      <Loader />
    )
  }

    return (
        <>
        <div className="space-y-2">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Pay</p>
                    <p className="text-2xl font-bold text-gray-900">
                      <CountUp 
                        end={shifts?.filter(shift => shift.status !== 'cancelled').reduce((sum, shift) => sum + parseFloat(shift.pay), 0)} 
                        decimals={2}
                        prefix="£"
                      />
                    </p>
                    <p className="text-xs text-gray-600 mt-2 flex items-center">All time</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Hours</p>
                    <p className="text-2xl font-bold text-gray-900">
                      <CountUp 
                      end={shifts?.filter(shift => shift.status !== 'cancelled').reduce((sum, shift) => sum + parseFloat(shift.hours), 0).toFixed(2)}
                      decimals={2}
                      />
                      </p>
                    <p className="text-xs text-gray-600 mt-2 flex items-center">All time</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Confirmed Shifts</p>
                    <p className="text-2xl font-bold text-gray-900">
                      <CountUp
                      end={parseFloat(shifts?.filter(s => s.status !== 'pending').length)}
                      />
                      </p>
                    <p className="text-xs text-gray-600 mt-1 flex items-center">All time</p>                  
                    </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Pending Shifts</p>
                    <p className="text-2xl font-bold text-gray-900">
                      <CountUp
                      end={parseFloat(shifts?.filter(s => s.status === 'pending').length)}
                      />
                      </p>
                    <p className="text-xs text-gray-600 mt-1 flex items-center">All time</p>                  
                    </div>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Target className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-2'>
            {!user?.member ? (
              <>
              <Expenses />
              </>
            ):(
              <>
              <PayPulsePro />
              </>
            )}

            <div className='border border-gray-200 rounded-xl p-6'>
              <SixMonthChart />
            </div>

            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
              {/* Upcoming Shifts */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-indigo-600" />
                Upcoming Shifts
              </h3>
                <div className="space-y-4">
                  {upcomingShifts.length === 0 ? (
                    <div className='flex flex-col h-70 w-full items-center justify-center'>
                    <CircleX className='text-gray-500'/>
                    <p className='text-sm text-gray-500 mt-2'>No Upcoming Shifts. Click <span>here</span> to add a shift</p>
                    </div>
                  ):(
                    <div>
                       {upcomingShifts.map((shift, index) => (
                        <StaggerAppear index={index}>
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 mb-2">
                      <div className="flex items-center space-x-4">
                        <div className="bg-indigo-100 p-2 rounded-lg">
                          <Calendar className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{new Date(shift.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}</p>
                          <p className="text-sm text-gray-600">{new Date(shift.start_time).toLocaleTimeString().slice(0, 5)} - {new Date(shift.finish_time).toLocaleTimeString().slice(0, 5)}</p>
                          <p className="text-xs text-gray-500">{shift.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {shift.status === 'confirmed' ? (
                          <span className="flex items-center text-green-600 text-sm">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Confirmed
                          </span>
                        ) : (
                          <span className="flex items-center text-orange-600 text-sm">
                            <Clock4 className="w-4 h-4 mr-1" />
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                    </StaggerAppear>
                  ))}
                    </div>
                  )}
                 
                </div>
              </div>

              {/* Goals Progress */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-indigo-600" />
                Goal Progress
                </h3>
                <div className="space-y-4">
                  {goalsWithProgress.length === 0 ? (
                    <div className='flex flex-col h-70 w-full items-center justify-center'>
                    <CircleX className='text-gray-500'/>
                    <p className='text-sm text-gray-500 mt-2'>No Goals. Click <span>here</span> to add a goal</p>
                  </div>
                  ):(
                    <div>
                      {goalsWithProgress.map((goal, index) => (
                    <div key={index} className="space-y-2 mt-4">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-gray-900">{goal.title}</p>
                        <p className="text-xs text-gray-600">{(goal.current).toFixed(2)}</p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${goal.percentage}%` }}
                        ></div>
                      </div>
                      <div className='flex items-center justify-between'> 
                      <p className="text-xs text-gray-500">Target: {goal.target}</p>
                      <p className='text-xs text-gray-500'>Percentage: {goal.percentage}%</p>
                      </div>
                    </div>
                  ))}
                    </div>
                  )}
                </div>
              </div>

           {/* Contacts */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-indigo-600" />
              Contacts
            </h3>
              <div className="space-y-4">
                {contacts.length === 0 ? (
                  <div className='flex flex-col h-70 w-full items-center justify-center'>
                    <CircleX className='text-gray-500'/>
                    <p className='text-sm text-gray-500 mt-2'>No Contacts. Click <span>here</span> to add a contact</p>
                  </div>
                ):(
                  <div>
                  {contacts.map((contact, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-b-0 last:pb-0 p-2"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{contact.first_name} {contact.last_name}</span>
                        <span className="text-xs text-gray-500">{contact.role} | {contact.company}</span>
                      </div>
                      <div className="flex gap-2">
                        <a href={`mailto:${contact.email}`}><Mail className="w-4 h-4 text-gray-500 hover:text-gray-800 cursor-pointer" /></a>
                        <a href={`tel:${contact.phone}`}><Phone className="w-4 h-4 text-gray-500 hover:text-gray-800 cursor-pointer" /></a>
                      </div>
                    </div>
                  ))}
                  </div>
                )}
              </div>
            </div>

              </div>
              

              <div className='border p-6 border-gray-200 rounded-xl'>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Pay</p>
                    <p className="text-2xl font-bold text-gray-900">£{weekShifts?.shifts?.filter(shift => shift.status !== 'cancelled').reduce((sum, shift) => sum + parseFloat(shift.pay), 0).toFixed(2)}</p>
                    <p className="text-xs text-gray-600 mt-2 flex items-center">
                      {new Date(weekShifts?.start).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })} - {new Date(weekShifts?.finish).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Hours</p>
                    <p className="text-2xl font-bold text-gray-900">{weekShifts?.shifts?.filter(shift => shift.status !== 'cancelled').reduce((sum, shift) => sum + parseFloat(shift.hours), 0).toFixed(2)}</p>
                    <p className="text-xs text-gray-600 mt-2 flex items-center">
                      {new Date(weekShifts?.start).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })} - {new Date(weekShifts?.finish).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Confirmed Shifts</p>
                    <p className="text-2xl font-bold text-gray-900">{parseFloat(weekShifts?.shifts?.filter(s => s.status !== 'pending').length)}</p>
                    <p className="text-xs text-gray-600 mt-1 flex items-center">
                      {new Date(weekShifts?.start).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })} - {new Date(weekShifts?.finish).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
                    </p>                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Pending Shifts</p>
                    <p className="text-2xl font-bold text-gray-900">{parseFloat(weekShifts?.shifts?.filter(s => s.status === 'pending').length)}</p>
                    <p className="text-xs text-gray-600 mt-1 flex items-center">
                      {new Date(weekShifts?.start).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })} - {new Date(weekShifts?.finish).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
                    </p>                  
                    </div>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Target className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>
            </div>

           
          </div>
          
          </>
    )
}

export default Overview