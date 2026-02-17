import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { getShifts } from '../routes/ShiftRoutes';
import { formatCurrency } from '../functions/Format';
import { LineChartIcon, Lock, Zap } from 'lucide-react';
import CountUp from 'react-countup'
import { useAuth } from '../context/AuthContext';

const SixMonthChart = () => {
  const [shifts, setShifts] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const { user } = useAuth()

  const fetchShifts = async () => {
    try {
      const response = await getShifts();
      setShifts(response);
  
      const shiftsByMonthYear = {};
  
      response.forEach((shift) => {
        const date = new Date(shift.date);
        const key = date.toLocaleString('default', { month: 'short' }) + ' ' + date.getFullYear(); 
        if (!shiftsByMonthYear[key]) {
          shiftsByMonthYear[key] = [];
        }
        shiftsByMonthYear[key].push(shift);
      });
  
      const now = new Date();
      const last4Months = [];
      for (let i = 3; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = d.toLocaleString('default', { month: 'short' }) + ' ' + d.getFullYear();
        last4Months.push(key);
      }
  
      const earningData = last4Months.map((key) => {
        const monthShifts = shiftsByMonthYear[key] || [];
        const validShifts = monthShifts.filter(shift => shift.status !== 'cancelled')
        const total = validShifts.reduce((sum, shift) => sum + (parseFloat(shift.pay) || 0), 0);
        return { month: key, earnings: total, shifts: monthShifts.length };
      });
  
      setMonthlyData(earningData);
    } catch (e) {
      console.error(e);
    }
  };
  

  useEffect(() => {
    fetchShifts();
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-sm text-indigo-600">
            Earnings: {formatCurrency(payload[0].value.toFixed(2))}
          </p>
            <p className="text-sm text-gray-500">
              Shifts: {payload[0].payload.shifts}
            </p>
        </div>
      );
    }
    return null;
  };

  const handleUpgrade = () => {
    console.log('Upgrade to Pro clicked');
  };

  const validShifts = shifts.filter(shift => shift.status !== 'cancelled');
  const totalEarnings = validShifts.reduce((acc, shift) => acc + (parseFloat(shift.pay) || 0), 0);
  const averageMonthly =
    monthlyData.length > 0
      ? monthlyData.reduce((acc, m) => acc + m.earnings, 0) / monthlyData.length
      : 0;
  const bestMonth = monthlyData.reduce(
    (max, m) => (m.earnings > max.earnings ? m : max),
    monthlyData[0] || { month: '', earnings: 0 }
  );

  return (
    <div className="relative">
      <div className={`${user.member ? 'blur-sm' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <LineChartIcon className="w-5 h-5 mr-2 text-indigo-600" />
            4-Month Earnings
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-xs text-gray-600 mb-1">Total Earnings</p>
            <p className="text-xl font-bold text-gray-900">
              <CountUp 
              end={totalEarnings}
              decimals={2}
              prefix='£'
              />
              </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Monthly Average</p>
            <p className="text-xl font-bold text-gray-900">
              <CountUp 
              end={averageMonthly}
              decimals={2}
              prefix='£'
              />
              </p>
          </div>
        </div>

        <div style={{ width: '100%', height: '150px' }}>
          <ResponsiveContainer>
            <LineChart
              data={monthlyData}
              margin={{ left: 30, right: 30, top: 10, bottom: 10 }}
            >
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="earnings"
                stroke="url(#gradient)"
                strokeWidth={3}
                dot={{ fill: '#6366F1', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#6366F1' }}
              />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-600">Best Month: {bestMonth?.month}</span>
          <span className="text-xs text-gray-600">{formatCurrency(bestMonth?.earnings)}</span>
        </div>
      </div>

      {/* Pro Upgrade Overlay */}
      {user.member && (
        <div className="absolute inset-1 flex items-center justify-center rounded-lg">
          <div className="text-center bg-white rounded-xl p-6 border border-gray-200 max-w-sm mx-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Unlock PayPulse Pro
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Unlock all premium features
            </p>
            <button
              onClick={handleUpgrade}
              className="cursor-pointer w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Upgrade Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SixMonthChart;