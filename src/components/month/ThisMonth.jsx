import React, { useEffect, useState } from 'react';
import { 
  Clock, 
  Calendar,
  Target, 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock4,
  MapPin,
  Star,
  Award,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Users,
  Zap,
  Download,
  File,
  List,
  Headphones,
  Speaker,
  Volume,
  Volume1,
  ArrowDown01,
  Info
} from 'lucide-react';
import { getCurrentMonthShifts } from '../routes/ShiftRoutes';
import MiniCalendar from './Calendar';
import CompletedShifts from './CompletedShifts';
import UpcomingShifts from './UpcomingShifts';
import Loader from '../loading/Loader';
import { percentageChange as getPercentageChange, numberOfShiftsPercentageChange, shiftPercentageChange as getShiftPercentageChange } from '../functions/PercentageChange';
import { PDFDownloadLink } from '@react-pdf/renderer';
import WorkSummaryPDF from './WorkSummaryPDF';
import { toast } from 'sonner';
import CountUp from 'react-countup'
import ProgressBar from '../animations/ProgressBar';

const ThisMonth = () => {

  const [shifts, setShifts] = useState([]);
  const [completedShifts, setCompletedShifts] = useState([])
  const [upcomingShifts, setUpcomingShifts] = useState([]);
  const [loading, setLoading] = useState(true)
  const [changeData, setChangeData] = useState({ change: '£0.00', percentageChange: '0%' });
  const [hoursChange, setHoursChange] = useState({ hoursChange: '0 hours', hoursPercentageChange: '0%' });
  const [shiftChange, setShiftChange] = useState({ shiftChange: 0, shiftPercentageChange: '0%' });

  

  const fetchStats = async () => {
    setLoading(true)
    try {
      const shifts = await getCurrentMonthShifts()
      setShifts(shifts);
      setCompletedShifts(shifts.filter(shift => shift.status === 'complete'));
      setUpcomingShifts(shifts.filter(shift => shift.status !== 'complete' && shift.status !== 'cancelled'));

      const { change, percentageChange } = await getPercentageChange();
      const { hoursChange, hoursPercentageChange } = await getShiftPercentageChange()
      const { shiftChange, shiftPercentageChange } = await numberOfShiftsPercentageChange();
      
      setChangeData({ change, percentageChange });
      setHoursChange({ hoursChange, hoursPercentageChange });
      setShiftChange({ shiftChange, shiftPercentageChange });

      setLoading(false)

    }catch(e){
      console.log(e)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = currentDate.getDate();
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const currentMonth = {
    period: `${monthNames[month]} ${year}`,
    startDate: `${monthNames[month]} 1`,
    endDate: `${monthNames[month]} ${daysInMonth}`,
    daysElapsed: today,
    totalDays: daysInMonth,
    progressPercentage: Math.round((today / daysInMonth) * 100)
  };


  const monthlyStats = [
    {
      title: 'Total Earned',
      value: completedShifts.reduce((acc, shift) => acc + parseFloat(shift.pay), 0),
      change: changeData?.percentageChange,
      isPositive: changeData?.percentageChange >= 0 ? true : false,
      icon: DollarSign,
      color: 'green',
      subtitle: 'vs last month'
    },
    {
      title: 'Hours Worked',
      value: completedShifts.reduce((acc, shift) => acc + parseFloat(shift.hours), 0).toFixed(2),
      change: hoursChange?.hoursPercentageChange,
      isPositive: hoursChange.hoursPercentageChange >= 0 ? true : false,
      icon: Clock,
      color: 'blue',
      subtitle: 'vs last month'
    },
    {
      title: 'Shifts Completed',
      value: completedShifts.length,
      change: shiftChange?.shiftPercentageChange,
      isPositive: shiftChange.shiftPercentageChange >= 0 ? true : false,
      icon: CheckCircle,
      color: 'purple',
      subtitle: 'vs last month'
    },
    {
      title: 'Pending Payments',
      value: upcomingShifts.reduce((acc, shift) => acc + parseFloat(shift.pay), 0),
      isPositive: true,
      icon: Star,
      color: 'orange',
      subtitle: 'from ' + shifts.filter(shift => shift.status !== 'complete' && shift.status !== 'cancelled').length + ' shifts'
    }
  ];


  const projections = {
    onTrackEarnings: shifts.filter(s => s.status !== 'cancelled').reduce((acc, shift) => acc + parseFloat(shift.pay), 0).toLocaleString('en-US', { style: 'currency', currency: 'GBP' }),
    projectedHours: shifts.filter(s => s.status !== 'cancelled').reduce((acc, shift) => acc + parseFloat(shift.hours), 0).toFixed(2),
    projectedShifts: shifts.filter(s => s.status !== 'cancelled').length,
    comparisonToLastMonth: changeData.percentageChange
  };

  const audioSummary = () => {
    // Stop any ongoing speech first
    window.speechSynthesis.cancel();
  
    const earnt = completedShifts.reduce((acc, shift) => acc + parseFloat(shift.pay), 0).toLocaleString('en-GB', { style: 'currency', currency: 'GBP' });
    const pending = upcomingShifts.reduce((acc, shift) => acc + parseFloat(shift.pay), 0).toLocaleString('en-GB', { style: 'currency', currency: 'GBP' });
    const completed = completedShifts.length;
    const upcoming = upcomingShifts.length;
    const hoursWorked = completedShifts.reduce((acc, shift) => acc + parseFloat(shift.hours), 0).toFixed(2);
    const pendingHours = upcomingShifts.reduce((acc, shift) => acc + parseFloat(shift.hours), 0).toFixed(2);
    const orderedShifts = upcomingShifts.sort((a, b) => new Date(a.date) - new Date(b.date));
    const nextShift = orderedShifts.length > 0 ? new Date(orderedShifts[0].date).toLocaleDateString('en-GB') : 'No upcoming shifts';
  
    const text = `This is your monthly summary. You have currently earned ${earnt}. You have worked ${hoursWorked} hours this month and have completed ${completed} shifts. You have ${upcoming} upcoming shifts with a total of ${pending} pending payments and ${pendingHours} hours to work. Your next shift is at ${nextShift}.`;
  
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = 1;
    utterance.volume = 1;
    
    window.speechSynthesis.speak(utterance);
  };




  const showMessage = () => {
    const today = new Date();
    const payslipGenerated = new Date(today.getFullYear(), today.getMonth() + 1, 2);
    const month = today.toLocaleString('en-GB', { month: 'long' });


    const diff = payslipGenerated - today;
    const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));


    toast.info('Payslip not available', {
      description: `Your payslip for ${month} will be available in ${diffDays} days. Payslips are generated on the 2nd of every month for the previous month and available in the Payslips section.`,
  })
  }


  if (loading) {
    return <Loader />
  }


  return (
    <div className="space-y-2">
      {/* Month Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">{currentMonth.period}</h2>
            <p className="text-indigo-100">{currentMonth.startDate} - {currentMonth.endDate}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-indigo-100">Progress</p>
            <CountUp start={0} duration={3} suffix='%' className='text-3xl font-bold' end={currentMonth.progressPercentage}></CountUp>
            <div className='flex'>
            <CountUp start={0} duration={3} end={currentMonth.daysElapsed} className='text-sm text-indigo-100'></CountUp>
            <p className='text-sm text-indigo-100'>/{currentMonth.totalDays} days</p>
            </div>
          </div>
        </div>
        <div className="mt-4 w-full bg-indigo-500 rounded-full h-2">
          <ProgressBar progress={currentMonth.progressPercentage}></ProgressBar>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        {monthlyStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    <CountUp end={stat.value} prefix={stat.title === 'Total Earned' || stat.title === 'Pending Payments' ? '£' : ''} decimals={stat.title !== 'Shifts Completed' ? 2 : 0}  />
                    </p>
                  {stat.title === 'Pending Payments' ? (
                     <p className={`text-xs mt-1 flex items-center`}>
                     {stat.change} {stat.subtitle}
                   </p>
                  ):(
                    <p className={`text-xs mt-1 flex items-center ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {stat.change} {stat.subtitle}
                  </p>
                  )}
                </div>
                <div className={`bg-${stat.color}-100 p-3 rounded-lg`}>
                  <IconComponent className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        {/* Projections & Comparison */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-indigo-600" />
            Month Projections
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
              <p className="text-sm text-gray-600 mb-1">On Track to Earn</p>
              <p className="text-2xl font-bold text-gray-900">{projections.onTrackEarnings}</p>
              {parseFloat(projections.comparisonToLastMonth) > 0 ? (
                <p className="text-xs text-green-600 flex items-center mt-1">
                <ArrowUp className="w-3 h-3 mr-1" />
                {projections.comparisonToLastMonth} vs last month
              </p>
              ):(
                <p className="text-xs text-red-600 flex items-center mt-1">
                <ArrowDown className="w-3 h-3 mr-1" />
                {projections.comparisonToLastMonth} vs last month
              </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-gray-600">Projected Hours</p>
                <p className="text-lg font-bold text-gray-900">{projections.projectedHours}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-xs text-gray-600">Projected Shifts</p>
                <p className="text-lg font-bold text-gray-900">{projections.projectedShifts}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mini Calendar */}
        <MiniCalendar />

        {/* Performance Summary */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-indigo-600" />
            PulseBot
          </h3>
          <div>
            <div onClick={() => showMessage()} className="flex items-center justify-between p-3 group bg-orange-50 rounded-lg hover:cursor-pointer mt-2">
              <div className="flex items-center">
                <File className="w-5 h-5 text-orange-500 mr-2" />
                <span className="text-sm font-medium">Invoice</span>
              </div>
              <span className="font-bold text-orange-600"><Info /></span>
            </div>
            <PDFDownloadLink document={<WorkSummaryPDF />}>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg mt-2">
              <div className="flex items-center">
                <List className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm font-medium">Work Summary</span>
              </div>
              <span className="font-bold text-green-600"><Download /></span>
            </div>
            </PDFDownloadLink>
            <div onClick={() => audioSummary()} className={`flex items-center justify-between p-3 bg-blue-50 rounded-lg cursor-pointer mt-2`}>
              <div className="flex items-center">
                <Headphones className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-sm font-medium">Summary</span>
              </div>
              <span className="font-bold text-blue-600"><Volume1 /></span>
            </div>
          </div>
        </div>
      </div>

      {/* Shifts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {/* Completed Shifts */}
       <CompletedShifts shifts={completedShifts} />

        {/* Upcoming Shifts */}
        <UpcomingShifts shifts={upcomingShifts} />
      </div>

    </div>
  );
};

export default ThisMonth;