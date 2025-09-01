import React, { useEffect, useState, useRef } from 'react';
import { DollarSign, Clock, CheckCircle, Star, TrendingUp, Calendar, Calendar1, LocateIcon, MoreHorizontal, Plus, Briefcase, File, ArrowLeft, DownloadIcon, PrinterIcon } from 'lucide-react';
import MiniCalendar from '../month/Calendar';
import { getMonthShifts } from '../routes/PayslipRoutes';
import PayslipCalendar from './PayslipCalendar';
import { formatCurrency } from '../functions/Format';
import Tippy from '@tippyjs/react';
import { pdf, PDFDownloadLink } from '@react-pdf/renderer';
import PayslipPDF from './PayslipPDF';


const PayslipView = ({ payslip, setSelectedPayslip }) => {

  const [shifts, setShifts] = useState([])
  

  const fetchShifts = async (id) => {
    const response = await getMonthShifts(id)
    setShifts(response)
  }

  useEffect(() => {
    fetchShifts(payslip?.id)
  }, [])

    const monthlyStats = [
        {
          title: 'Period',
          value: payslip?.month + ' ' + payslip?.year,
          change: payslip?.start + ' - ' + payslip?.finish,
          isPositive: true,
          icon: Calendar,
          color: 'green',
          subtitle: ''
        },
        {
          title: 'Hours Worked',
          value: shifts.reduce((acc, shift) => acc + parseFloat(shift.hours), 0).toFixed(2),
          change: '',
          isPositive: true,
          icon: Clock,
          color: 'blue',
          subtitle: 'in month'
        },
        {
          title: 'Shifts Completed',
          value: shifts.length,
          change: '',
          isPositive: true,
          icon: CheckCircle,
          color: 'purple',
          subtitle: 'in month'
        },
        {
          title: 'Gross Pay',
          value: shifts?.reduce((acc, shift) => acc + parseFloat(shift.hours * shift.rate), 0).toLocaleString('en-US', { style: 'currency', currency: 'GBP' }),
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

      
      const summary = [{
        gross: payslip?.gross,
        net: payslip?.net,
        tax: payslip?.tax,
        hours: payslip?.hours,
        rate: payslip?.rate
      }]

      const handlePrint = async () => {
        const blob = await pdf(<PayslipPDF payslip={payslip} />).toBlob();
        const blobUrl = URL.createObjectURL(blob);
    
        const newWindow = window.open(blobUrl, '_blank');
        if (newWindow) {
          newWindow.focus();
          newWindow.onload = () => {
            newWindow.print();
          };
        }
      };
      

  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
      <p onClick={() => setSelectedPayslip(null)} className='text-sm flex items-center cursor-pointer'> <ArrowLeft className='w-5' /> Back to Payslips</p>
      <div className='flex gap-2'>
      <Tippy content='Download Payslip'>
        <PDFDownloadLink document={<PayslipPDF payslip={payslip} fileName={`${payslip?.month} payslip`} />}>
      <div className='border border-gray-200 rounded-lg p-2 hover:bg-gray-50 cursor-pointer'>
          <DownloadIcon className='text-gray-500 hover:text-gray-700 transition-colors' />
        </div>
        </PDFDownloadLink>
        </Tippy>
        
            <Tippy content='Print Payslip'>
              <div onClick={() => handlePrint()} className='border border-gray-200 rounded-lg p-2 hover:bg-gray-50 cursor-pointer'>
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
          <PayslipCalendar payslip={payslip} />
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
      {formatCurrency(payslip?.gross)}
    </span>
  </div>
  <div className="flex items-center justify-between p-2 border-b border-gray-100 last:border-b-0">
  <span className="text-sm text-gray-600">Net Pay:</span>
    <span className="text-sm font-medium text-gray-900">
      {formatCurrency(payslip?.net)}
    </span>
  </div>
  <div className="flex items-center justify-between p-2 border-b border-gray-100 last:border-b-0">
    <span className="text-sm text-gray-600">Tax Deducted:</span>
    <span className="text-sm font-medium text-gray-900">
      {formatCurrency(payslip?.tax)}
    </span>
  </div>
  <div className="flex items-center justify-between p-2 border-b border-gray-100 last:border-b-0">
    <span className="text-sm text-gray-600">Total Hours:</span>
    <span className="text-sm font-medium text-gray-900">{payslip?.hours}h</span>
  </div>
  <div className="flex items-center justify-between p-2 border-b border-gray-100 last:border-b-0">
    <span className="text-sm text-gray-600">Avg. Hourly Rate:</span>
    <span className="text-sm font-medium text-gray-900">
      {formatCurrency(payslip?.rate)}
    </span>
  </div>
</div>

       
                    
      </div>
        
      </div>
     
    </div>
  );
};

export default PayslipView;