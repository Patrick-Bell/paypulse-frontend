import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition } from '@headlessui/react';
import { X, TrendingUp, Calendar, DollarSign, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { getShifts } from '../routes/ShiftRoutes';

const StatsModal = ({ isOpen, setIsOpen }) => {
    const [shifts, setShifts] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await getShifts();

            const shiftsByMonthYear = {};

            response.forEach((shift) => {
                const key = new Date(shift.date).toLocaleString('default', { month: 'short' }) + ' ' + new Date(shift.date).getFullYear();
                if (!shiftsByMonthYear[key]) {
                    shiftsByMonthYear[key] = [];
                }
                shiftsByMonthYear[key].push(shift);
            });

            setShifts(shiftsByMonthYear);
        } catch (error) {
            console.error('Error fetching shifts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: 'GBP'
        }).format(amount);
    };

    const calculateMonthStats = (monthShifts) => {
        const totalShifts = monthShifts.length;
        const completed = monthShifts.filter(shift => shift.status === 'complete').length;
        const cancelled = monthShifts.filter(shift => shift.status === 'cancelled').length;
        const pending = monthShifts.filter(shift => shift.status === 'pending').length;
        
        const totalEarnings = monthShifts
            .filter(shift => shift.status === 'complete')
            .reduce((sum, shift) => sum + (parseFloat(shift.pay) || 0), 0);
        
        const avgEarnings = completed > 0 ? totalEarnings / completed : 0;
        
        const totalHours = monthShifts
            .filter(shift => shift.status === 'complete')
            .reduce((sum, shift) => sum + (parseFloat(shift.hours) || 0), 0);

        return {
            totalShifts,
            completed,
            cancelled,
            pending,
            totalEarnings,
            avgEarnings,
            totalHours,
            completionRate: totalShifts > 0 ? (completed / totalShifts) * 100 : 0
        };
    };

    const sortedMonths = Object.keys(shifts).sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateB - dateA; // Most recent first
    });

    const grandTotals = Object.values(shifts).flat().reduce((totals, shift) => {
        totals.totalShifts++;
        if (shift.status === 'complete') {
            totals.completed++;
            totals.totalEarnings += parseFloat(shift.pay) || 0;
            totals.totalHours += parseFloat(shift.hours) || 0;
        } else if (shift.status === 'cancelled') {
            totals.cancelled++;
        } else if (shift.status === 'pending') {
            totals.pending++;
        } 
        return totals;
    }, { totalShifts: 0, completed: 0, cancelled: 0, pending: 0, totalEarnings: 0, totalHours: 0 });

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
                {/* Background */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/40" />
                </Transition.Child>

                {/* Modal panel */}
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <DialogPanel className="w-full max-w-7xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-2xl transition-all relative max-h-[90vh] overflow-y-auto">
                            
                            {/* Header */}
                            <div className="px-6 py-4 relative">
                                <X 
                                    onClick={() => setIsOpen(false)} 
                                    className="absolute top-4 right-4 w-6 h-6 text-white/80 hover:text-white cursor-pointer transition-colors" 
                                />
                               <div className="space-y-1">
                                    <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    Shift Summary
                                    </DialogTitle>
                                    <p className="text-sm text-gray-500">View your overall stats in a table format. See past and future monthly summaries here.</p>
                                </div>
                            </div>

                            <div className="p-6">
                                {loading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                        <span className="ml-3 text-gray-600">Loading statistics...</span>
                                    </div>
                                ) : (
                                    <>
                                        {/* Table */}
                                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Earned</th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg per Shift</th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Shifts</th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cancelled</th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending</th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion Rate</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {sortedMonths.map((month) => {
                                                            const stats = calculateMonthStats(shifts[month]);
                                                            return (
                                                                <tr key={month} className="hover:bg-gray-50 transition-colors">
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <div className="flex items-center gap-2">
                                                                            <Calendar className="w-4 h-4 text-gray-400" />
                                                                            <span className="text-sm font-medium text-gray-900">{month}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <span className="text-sm font-semibold text-green-600">{formatCurrency(stats.totalEarnings)}</span>
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <span className="text-sm text-gray-900">{formatCurrency(stats.avgEarnings)}</span>
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <span className="text-sm font-medium text-gray-900">{stats.totalShifts}</span>
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                            {stats.completed}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                                            {stats.cancelled}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                                            {stats.pending}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <span className="text-sm text-gray-900">{stats.totalHours}h</span>
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <div className="flex items-center">
                                                                            <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                                                                                <div 
                                                                                    className="bg-green-500 h-2 rounded-full" 
                                                                                    style={{width: `${stats.completionRate}%`}}
                                                                                ></div>
                                                                            </div>
                                                                            <span className="text-xs text-gray-600">{stats.completionRate.toFixed(1)}%</span>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                    {/* Totals Row */}
                                                    <tfoot className="bg-gray-100">
                                                        <tr className="font-semibold">
                                                            <td className="px-6 py-4 text-sm text-gray-900">Total</td>
                                                            <td className="px-6 py-4 text-sm text-green-600">{formatCurrency(grandTotals.totalEarnings)}</td>
                                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                                {formatCurrency(grandTotals.completed > 0 ? grandTotals.totalEarnings / grandTotals.completed : 0)}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-900">{grandTotals.totalShifts}</td>
                                                            <td className="px-6 py-4 text-sm text-gray-900">{grandTotals.completed}</td>
                                                            <td className="px-6 py-4 text-sm text-gray-900">{grandTotals.cancelled}</td>
                                                            <td className="px-6 py-4 text-sm text-gray-900">{grandTotals.pending}</td>
                                                            <td className="px-6 py-4 text-sm text-gray-900">{grandTotals.totalHours}h</td>
                                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                                {((grandTotals.completed / grandTotals.totalShifts) * 100).toFixed(1)}%
                                                            </td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </div>

                                        {Object.keys(shifts).length === 0 && (
                                            <div className="text-center py-12">
                                                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                                <p className="text-gray-600">No shift data available</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-500">
                                        Last updated: {new Date().toLocaleDateString('en-GB', { 
                                            day: 'numeric', 
                                            month: 'short', 
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>

                        </DialogPanel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

export default StatsModal;