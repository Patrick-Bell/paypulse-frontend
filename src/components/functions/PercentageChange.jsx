import React from 'react';
import { getCurrentMonthShifts, getPreviousMonthShifts } from '../routes/ShiftRoutes';

export const percentageChange = async () => {

    const previousShifts = await getPreviousMonthShifts();
    const currentShifts = await getCurrentMonthShifts();

    const previousPay = previousShifts.reduce((total, shift) => total + parseFloat(shift.pay), 0);
    const currentPay = currentShifts.reduce((total, shift) => total + parseFloat(shift.pay), 0);

    const change = currentPay - previousPay;

    const percentageChange = previousPay === 0 ? 0 : (change / previousPay) * 100;

    return {
        change: change.toLocaleString('en-US', { style: 'currency', currency: 'GBP' }),
        percentageChange: percentageChange.toFixed(2) + '%'
    };

}

export const shiftPercentageChange = async () => {
    const previousShifts = await getPreviousMonthShifts();
    const currentShifts = await getCurrentMonthShifts();
  
    const previousHours = previousShifts.reduce((total, shift) => total + (parseFloat(shift.hours) || 0), 0);
    const currentHours = currentShifts.reduce((total, shift) => total + (parseFloat(shift.hours) || 0), 0);
  
    const change = currentHours - previousHours;
    const percentageChange = previousHours === 0 ? 0 : (change / previousHours) * 100;
  
    return {
      hoursChange: change.toFixed(2) + ' hours',
      hoursPercentageChange: percentageChange.toFixed(2) + '%'
    };
  };
  

export const numberOfShiftsPercentageChange = async () => {
    const previousShifts = await getPreviousMonthShifts();
    const currentShifts = await getCurrentMonthShifts();

    const previousCount = previousShifts.length;
    const currentCount = currentShifts.length;

    const change = currentCount - previousCount;

    const percentageChange = previousCount === 0 ? 0 : (change / previousCount) * 100;

    return {
        shiftChange: change,
        shiftPercentageChange: percentageChange.toFixed(2) + '%'
    };
}