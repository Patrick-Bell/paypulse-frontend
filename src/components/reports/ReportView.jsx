import React, { useEffect, useState, useRef } from 'react';
import { DollarSign, Clock, CheckCircle, Star, TrendingUp, Calendar, Calendar1, LocateIcon, MoreHorizontal, Plus, Briefcase, File, ArrowLeft, DownloadIcon, PrinterIcon } from 'lucide-react';
import MiniCalendar from '../month/Calendar';
import { getMonthShifts } from '../routes/PayslipRoutes';
import { formatCurrency } from '../functions/Format';
import Tippy from '@tippyjs/react';
import { pdf, PDFDownloadLink } from '@react-pdf/renderer';
import PayslipPDF from '../payslips/PayslipPDF';


const ReportView = ({ report, setSelectedReport }) => {

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

  const overallStats = {
    totalHours: validShifts.reduce((acc, shift) => acc + parseFloat(shift.hours), 0).toFixed(2),
    gross: validShifts.reduce((acc, shift) => acc + parseFloat(shift.hours * shift.rate), 0),
    averageRate: (validShifts.reduce((acc, shift) => acc + parseFloat(shift.hours * shift.rate), 0) / validShifts.reduce((acc, shift) => acc + parseFloat(shift.hours), 0)),
    tax: (validShifts.reduce((acc, shift) => acc + parseFloat(shift.hours * shift.rate), 0) * 0.2).toFixed(2),
    net: (validShifts.reduce((acc, shift) => acc + parseFloat(shift.hours * shift.rate), 0) * 0.8).toFixed(2),
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
          value: shifts.length,
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
        <PDFDownloadLink document={<PayslipPDF payslip={report} fileName={`${report?.name} report`} />}>
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

      <div className='grid grid-cols-1 md:grid-cols-2 gap-2 mt-2'>
        <div>
        </div>
        <div className='bg-white rounded-xl p-6 border border-gray-200'>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Calendar1 className="w-5 h-5 mr-2 text-indigo-600" />
        Shifts
        </h3>
        <div className="grid grid-cols-1 gap-2 max-h-49 overflow-x-scroll">
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
        </div>

      </div>


      <div className='grid grid-cols-1 md:grid-cols-3 gap-2 mt-2'>
      <div className='bg-white rounded-xl p-6 border border-gray-200'>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <LocateIcon className="w-5 h-5 mr-2 text-indigo-600" />
        Locations
        </h3>
        <div>
  {locations.length === 0 ? (
    <p className="text-gray-500 text-sm">No locations found</p>
  ) : (
    locations.map(({ location, count, index }) => (
      <div key={index} className="flex items-center justify-between p-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            {location}
                          </span>
                        </div>
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

      <div className='bg-white rounded-xl p-6 border border-gray-200'>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Briefcase className="w-5 h-5 mr-2 text-indigo-600" />
        Companies
        </h3>
        <div>
  {companies.length === 0 ? (
    <p className="text-gray-500 text-sm">No locations found</p>
  ) : (
    companies.map(({ company, count, index }) => (
      <div key={index} className="flex items-center justify-between p-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            {company}
                          </span>
                        </div>
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

      <div className='bg-white rounded-xl p-6 border border-gray-200'>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <File className="w-5 h-5 mr-2 text-indigo-600" />
        Summary
        </h3>
        <div className="space-y-2">
  <div className="flex items-center justify-between p-2 border-b border-gray-100 last:border-b-0">
    <span className="text-sm text-gray-600">Gross Pay:</span>
    <span className="text-sm font-medium text-gray-900">
        {formatCurrency(stats.gross)}
    </span>
  </div>
  <div className="flex items-center justify-between p-2 border-b border-gray-100 last:border-b-0">
  <span className="text-sm text-gray-600">Net Pay:</span>
      {/* Assuming a flat 20% tax rate for demonstration purposes */}
    <span className="text-sm font-medium text-gray-900">
        {formatCurrency(stats.net)}
    </span>
  </div>
  <div className="flex items-center justify-between p-2 border-b border-gray-100 last:border-b-0">
    <span className="text-sm text-gray-600">Tax Deducted:</span>
    <span className="text-sm font-medium text-gray-900">
        {formatCurrency(stats.tax)}
    </span>
  </div>
  <div className="flex items-center justify-between p-2 border-b border-gray-100 last:border-b-0">
    <span className="text-sm text-gray-600">Total Hours:</span>
    <span className="text-sm font-medium text-gray-900">{stats.totalHours}h</span>
  </div>
  <div className="flex items-center justify-between p-2 border-b border-gray-100 last:border-b-0">
    <span className="text-sm text-gray-600">Avg. Hourly Rate:</span>
    <span className="text-sm font-medium text-gray-900">
        {formatCurrency(stats.averageRate)}
    </span>
  </div>
</div>

       
                    
      </div>
        
      </div>
     
    </div>
  );
};

export default ReportView;