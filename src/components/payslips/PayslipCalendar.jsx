import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { getCurrentMonthShifts } from "../routes/ShiftRoutes";
import { getMonthShifts } from "../routes/PayslipRoutes";

const PayslipCalendar = ({ payslip }) => {
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    const fetchShifts = async (id) => {
      const response = await getMonthShifts(id);
      setShifts(response);
    };

    fetchShifts(payslip?.id);
  }, []);

  const currentDate = shifts.length
  ? new Date(shifts[0].date)  
  : new Date();              

const year = currentDate.getFullYear();
const month = currentDate.getMonth(); 
const today = new Date().getDate();   


  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun, 6 = Sat

  // Map each shift to the calendar day (1‑based)
  const shiftMap = new Map();
  shifts.forEach((shift) => {
    const shiftDate = new Date(shift.date);
    const day = shiftDate.getDate();

    shiftMap.set(day, {
      hasShift: true,
      isCompleted: shift.status === "complete",
      isUpcoming: shift.status !== "complete",
    });
  });

  // Build an array including placeholder cells for the offset at the beginning of the month
  const calendarCells = [
    // Empty cells so the 1st of the month lands on the right weekday
    ...Array.from({ length: firstDayOfMonth }, () => ({ placeholder: true })),

    // One entry per actual calendar day
    ...Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const shiftInfo = shiftMap.get(day) || {
        hasShift: false,
        isCompleted: false,
        isUpcoming: false,
      };
      return { day, ...shiftInfo };
    }),
  ];

  const currentMonth = {
    period: `${monthNames[month]} ${year}`,
    daysElapsed: today,
    totalDays: daysInMonth,
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
        {currentMonth.period}
      </h3>

      <div className="grid grid-cols-7 gap-1 text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
          <div
            key={i}
            className="text-xs font-medium text-gray-500 p-1 uppercase"
          >
            {day}
          </div>
        ))}

        {calendarCells.map((cell, index) =>
          cell.placeholder ? (
            // Render an empty cell to pad the start of the grid
            <div key={index} className="p-1" />
          ) : (
            <div
              key={index}
              className={`
                text-xs p-1 rounded
                ${cell.hasShift
                  ? cell.isCompleted
                    ? "bg-green-100 text-green-800 font-medium"
                    : "bg-blue-100 text-blue-800 font-medium"
                  : cell.day <= currentMonth.daysElapsed
                    ? "text-gray-400"
                    : "text-gray-600"}
              `}
            >
              {cell.day}
            </div>
          )
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-100 rounded mr-1" />
          <span className="text-gray-600">Completed</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-100 rounded mr-1" />
          <span className="text-gray-600">Upcoming</span>
        </div>
      </div>
    </div>
  );
};

export default PayslipCalendar;
