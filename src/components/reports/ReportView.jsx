import React, { useEffect, useState, useRef } from 'react';
import { ChevronDown, Clock, CheckCircle, Star, TrendingUp, Calendar, Calendar1, LocateIcon, MoreHorizontal, Plus, Briefcase, File, ArrowLeft, DownloadIcon, PrinterIcon, Coffee, Car, Home, ShoppingBag, Banknote, DollarSign, BarChart } from 'lucide-react';
import MiniCalendar from '../month/Calendar';
import { getMonthShifts } from '../routes/PayslipRoutes';
import { formatCurrency } from '../functions/Format';
import Tippy from '@tippyjs/react';
import { pdf, PDFDownloadLink } from '@react-pdf/renderer';
import PayslipPDF from '../payslips/PayslipPDF';
import ReportSummaryPDF from './ReportSummaryPDF';


const ReportView = ({ report, setSelectedReport }) => {

  const containerRef = useRef(null)
  const [showArrow, setShowArrow] = useState(true)


  const handleScroll = () => {
    const container = containerRef.current
    if (!container) return

    const isAtBottom = container.scrollHeight - container.scrollTop === container.clientHeight
    setShowArrow(!isAtBottom)
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('scroll', handleScroll)
    handleScroll() // initial check

    return () => container.removeEventListener('scroll', handleScroll)
  }, [])


  const scrollDown = () => {
    const container = containerRef.current
    if (!container) return
    // Scroll down 80 pixels smoothly
    container.scrollBy({ top: 80, behavior: 'smooth' })
  }

  const categories = ['food', 'travel', 'supplies', 'other'];

        // build summary with 0 defaults
        const summary = categories.map(cat => {
        const items = report?.expenses.filter(e => e.name.toLowerCase() === cat);
        const total = items.reduce((acc, e) => acc + e.amount, 0);
        return { name: cat, amount: total };
        });

        const totalExpenses = report.expenses.reduce((acc, item) => acc + item.amount, 0);

   
    const getIcon = (category) => {
        switch (category) {
            case 'food':
                return Coffee
            case 'travel':
                return Car
            case 'other':
                return Home
            case 'supplies':
                return ShoppingBag
            default:
                return Banknote
        }
    }

    const calculateNumberOfDays = (start, end) => {
        const startDate = new Date(start)
        const endDate = new Date(end)
        const timeDiff = Math.abs(endDate - startDate)
        const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1
        return diffDays
    }

  const [shifts, setShifts] = useState(report?.shifts || [])
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({})

  const validShifts = shifts.filter(s => s.status !== 'cancelled'); 
  const validExpenses = report?.expenses.filter(exp => exp.expensable) || [];

  const overallStats = {
    totalHours: validShifts.reduce((acc, shift) => acc + parseFloat(shift.hours), 0).toFixed(2),
    gross: validShifts.reduce((acc, shift) => acc + parseFloat(shift.hours * shift.rate), 0),
    averageRate: (validShifts.reduce((acc, shift) => acc + parseFloat(shift.hours * shift.rate), 0) / validShifts.reduce((acc, shift) => acc + parseFloat(shift.hours), 0)),
    tax: (validShifts.reduce((acc, shift) => acc + parseFloat(shift.hours * shift.rate), 0) * 0.2).toFixed(2),
    net: (validShifts.reduce((acc, shift) => acc + parseFloat(shift.hours * shift.rate), 0) * 0.8).toFixed(2),
  }

  const randomStats = {
    avgHoursPerShift: (overallStats.totalHours / validShifts.length || 0).toFixed(2),
    totalExpenses: validExpenses.reduce((acc, exp) => acc + parseFloat(exp.amount), 0).toFixed(2),
    expensesIncomeRatio: ((totalExpenses / overallStats.gross) * 100).toFixed(1),
    highestDailyPay: Math.max(...shifts.map(s => s.hours * s.rate)),
    lowestDailyPay: Math.min(...shifts.map(s => s.hours * s.rate)),
    cancelledShifts: shifts.filter(s => s.status === 'cancelled').length
  }
  

  const loadData = async () => {
    setLoading(true);
    setShifts(report?.shifts || []);
    setStats(overallStats)
    setLoading(false);
  }

  useEffect(() => {
    loadData()
  }, [])



 
    const monthlyStats = [
        {
          title: 'Period',
          value: calculateNumberOfDays(report?.start_date, report?.end_date) + ' days',
          change: report?.start_date && report?.end_date ? `${new Date(report.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - ${new Date(report.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}` : '',
          isPositive: true,
          icon: Calendar,
          color: 'green',
          subtitle: ''
        },
        {
          title: 'Hours Worked',
          value: shifts.filter(s => s.status !== 'cancelled').reduce((acc, shift) => acc + parseFloat(shift.hours), 0).toFixed(2),
          change: '',
          isPositive: true,
          icon: Clock,
          color: 'blue',
          subtitle: 'in period'
        },
        {
          title: 'Shifts Completed',
          value: shifts.filter(s => s.status !== 'cancelled').length,
          change: '',
          isPositive: true,
          icon: CheckCircle,
          color: 'purple',
          subtitle: 'in period'
        },
        {
          title: 'Gross Pay',
          value: shifts?.filter(s => s.status !== 'cancelled').reduce((acc, shift) => acc + parseFloat(shift.hours * shift.rate), 0).toLocaleString('en-US', { style: 'currency', currency: 'GBP' }),
          isPositive: true,
          icon: Star,
          color: 'orange',
          subtitle: `Average: £${(shifts.reduce((acc, shift) => acc + parseFloat(shift.hours * shift.rate), 0) / shifts.length).toFixed(2)}`,
        }
      ];

      const locations = Array.from(new Set(shifts.map(s => s.location))).map(location => {
        const count = shifts.filter(s => s.location === location).length;
        return { location, count };
      });

      const companies = Array.from(new Set(shifts.map(s => s.company))).map(company => {
        const count = shifts.filter(s => s.company === company).length;
        return { company, count };
      });
      

  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
      <p onClick={() => setSelectedReport(null)} className='text-sm flex items-center cursor-pointer'> <ArrowLeft className='w-5' /> Back to Reports</p>
      <div className='flex gap-2'>
      <Tippy content='Download Payslip'>
        <PDFDownloadLink document={<ReportSummaryPDF reportData={report} fileName={`${report?.name} report`} />}>
      <div className='border border-gray-200 rounded-lg p-2 hover:bg-gray-50 cursor-pointer'>
          <DownloadIcon className='text-gray-500 hover:text-gray-700 transition-colors' />
        </div>
        </PDFDownloadLink>
        </Tippy>
        
            <Tippy content='Print Payslip'>
              <div className='border border-gray-200 rounded-lg p-2 hover:bg-gray-50 cursor-pointer'>
                <PrinterIcon className='text-gray-500 hover:text-gray-700 transition-colors' />
              </div>
            </Tippy>

      </div>
      </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        {monthlyStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-xs mt-1 flex items-center`}>
                    {stat.change} {stat.subtitle}
                  </p>
                </div>
                <div className={`bg-${stat.color}-100 p-3 rounded-lg`}>
                  <IconComponent className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-2 mt-2'>
  {/* Expenses */}
  <div className='bg-white rounded-xl p-6 border border-gray-200'>
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <DollarSign className="w-5 h-5 mr-2 text-indigo-600" />
      Expenses
    </h3>
    {report.expenses.length === 0 ? (
      <p className="text-gray-500 text-sm">No expenses recorded</p>
    ) : (
    <div className="mb-6 max-h-50 overflow-y-auto pr-2">
      <h4 className="text-sm font-medium text-gray-700 mb-3">Category Breakdown</h4>
      <div className="space-y-3">
        {report.expenses.map((item, index) => {
          const IconComponent = getIcon(item.name)
          const percentage = item.amount > 0 ? ((item.amount / totalExpenses) * 100).toFixed(0) : 0
          const numberOfItems = report?.expenses.filter(e => e.name.toLowerCase() === item.name).length
          
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center flex-1">
                <div className="w-3 h-3 rounded-full mr-3 bg-indigo-500"></div>
                <IconComponent className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm text-gray-700">
                  {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{formatCurrency(item.amount)}</div>
                <div className="text-xs text-gray-500">({numberOfItems}) {percentage}%</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
    )}
  </div>

  {/* Random Stats */}
  <div className='bg-white rounded-xl p-6 border border-gray-200'>
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <BarChart className="w-5 h-5 mr-2 text-indigo-600" />
      Stats
    </h3>
    <div className="grid grid-cols-1 gap-2 max-h-50 overflow-y-auto pr-2">
    <div className="flex items-center justify-between p-2 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div>
                <span className="text-sm font-medium text-gray-900">
                  Avg hrs per shift
                </span>
                <span className="text-xs text-gray-600 ml-2"></span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-gray-900">{randomStats.avgHoursPerShift}h</span>
              <span className="text-xs text-gray-600"></span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div>
                <span className="text-sm font-medium text-gray-900">
                  Total Expenses
                </span>
                <span className="text-xs text-gray-600 ml-2"></span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-gray-900">{formatCurrency(randomStats.totalExpenses)}</span>
              <span className="text-xs text-gray-600 ml-2">({validExpenses.length})</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div>
                <span className="text-sm font-medium text-gray-900">
                  Cancelled Shifts
                </span>
                <span className="text-xs text-gray-600 ml-2"></span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-gray-900">{randomStats.cancelledShifts}</span>
              <span className="text-xs text-gray-600"></span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div>
                <span className="text-sm font-medium text-gray-900">
                  High Earning Shift
                </span>
                <span className="text-xs text-gray-600 ml-2"></span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-gray-900">{formatCurrency(randomStats.highestDailyPay)}</span>
              <span className="text-xs text-gray-600"></span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div>
                <span className="text-sm font-medium text-gray-900">
                  Lowest Earning Shift
                </span>
                <span className="text-xs text-gray-600 ml-2"></span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-gray-900">{formatCurrency(randomStats.lowestDailyPay)}</span>
              <span className="text-xs text-gray-600"></span>
            </div>
          </div>



    </div>
  </div>
  
  
  {/* Shifts */}
  <div className='bg-white rounded-xl p-6 border border-gray-200 relative'>
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <Calendar1 className="w-5 h-5 mr-2 text-indigo-600" />
      Shifts
    </h3>
    <div ref={containerRef} className="grid grid-cols-1 gap-2 max-h-50 overflow-y-auto pr-2">
      {shifts
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map((shift, index) => (
          <div key={index} className="flex items-center justify-between p-2 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div>
                <span className="text-sm font-medium text-gray-900">
                  {new Date(shift.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </span>
                <span className="text-xs text-gray-600 ml-2">{shift.location}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-gray-900">{shift.hours}h</span>
              <span className="text-xs text-gray-600 ml-2">£{(shift.hours * shift.rate).toFixed(2)}</span>
            </div>
          </div>
        ))}
    </div>
  {showArrow && (
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
          <ChevronDown onClick={() => scrollDown()} className="w-6 h-6 text-gray-400 cursor-pointer" />
        </div>
      )}
  </div>
</div>



      <div className='grid grid-cols-1 md:grid-cols-3 gap-2 mt-2'>
  {/* Locations */}
  <div className='bg-white rounded-xl p-6 border border-gray-200'>
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <LocateIcon className="w-5 h-5 mr-2 text-indigo-600" />
      Locations
    </h3>
    <div className="max-h-50 overflow-y-auto pr-2">
      {locations.length === 0 ? (
        <p className="text-gray-500 text-sm">No locations found</p>
      ) : (
        locations.map(({ location, count }, index) => (
          <div key={index} className="flex items-center justify-between p-2 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-sm font-medium text-gray-900">{location}</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-gray-900">{count}</span>
              <span className="text-xs text-gray-600 ml-2">({(count / shifts.length * 100).toFixed(2)}%)</span>
            </div>
          </div>
        ))
      )}
    </div>
  </div>

  {/* Companies */}
  <div className='bg-white rounded-xl p-6 border border-gray-200'>
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <Briefcase className="w-5 h-5 mr-2 text-indigo-600" />
      Companies
    </h3>
    <div className="max-h-50 overflow-y-auto pr-2">
      {companies.length === 0 ? (
        <p className="text-gray-500 text-sm">No companies found</p>
      ) : (
        companies.map(({ company, count }, index) => (
          <div key={index} className="flex items-center justify-between p-2 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-sm font-medium text-gray-900">{company}</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-gray-900">{count}</span>
              <span className="text-xs text-gray-600 ml-2">({(count / shifts.length * 100).toFixed(2)}%)</span>
            </div>
          </div>
        ))
      )}
    </div>
  </div>

  {/* Summary */}
  <div className='bg-white rounded-xl p-6 border border-gray-200'>
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <File className="w-5 h-5 mr-2 text-indigo-600" />
      Summary
    </h3>
    <div className="space-y-2 max-h-50 overflow-y-auto pr-2">
      <div className="flex items-center justify-between p-2 border-b border-gray-100 last:border-b-0">
        <span className="text-sm text-gray-600">Gross Pay:</span>
        <span className="text-sm font-medium text-gray-900">{formatCurrency(stats.gross)}</span>
      </div>
      <div className="flex items-center justify-between p-2 border-b border-gray-100 last:border-b-0">
        <span className="text-sm text-gray-600">Net Pay:</span>
        <span className="text-sm font-medium text-gray-900">{formatCurrency(stats.net)}</span>
      </div>
      <div className="flex items-center justify-between p-2 border-b border-gray-100 last:border-b-0">
        <span className="text-sm text-gray-600">Tax Deducted:</span>
        <span className="text-sm font-medium text-gray-900">{formatCurrency(stats.tax)}</span>
      </div>
      <div className="flex items-center justify-between p-2 border-b border-gray-100 last:border-b-0">
        <span className="text-sm text-gray-600">Total Hours:</span>
        <span className="text-sm font-medium text-gray-900">{stats.totalHours}h</span>
      </div>
      <div className="flex items-center justify-between p-2 border-b border-gray-100 last:border-b-0">
        <span className="text-sm text-gray-600">Avg. Hourly Rate:</span>
        <span className="text-sm font-medium text-gray-900">{formatCurrency(stats.averageRate)}</span>
      </div>
    </div>
  </div>
</div>

     
    </div>
  );
};

export default ReportView;