import { useState, useEffect, Fragment } from "react";
import { Description, Dialog, DialogPanel, DialogTitle, Transition } from '@headlessui/react'
import {
  Calendar,
  Clock,
  MapPin,
  Building2,
  BadgeCheck,
  DollarSign,
  StickyNote,
  Clock10,
  Contact,
  XIcon,
  Banknote,
} from "lucide-react"
import { getCurrentMonthShifts } from "../routes/ShiftRoutes";
import { getContacts } from "../routes/ContactRoutes";
import { formatCurrency } from '../functions/Format'

const MiniCalendar = () => {
  const [shifts, setShifts] = useState([]);
  const [isOpen, setIsOpen] = useState(false)
  const [selectedShift, setSelectedShift] = useState(null);
  const [contacts, setContacts] = useState([])



  useEffect(() => {
    const fetchShifts = async () => {
      const response = await getCurrentMonthShifts();
      setShifts(response);
      const contacts = await getContacts();
      setContacts(contacts)
    };

    fetchShifts();
  }, []);

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0‑indexed (0 = Jan)
  const today = currentDate.getDate();

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
      isCancelled: shift.status === "cancelled",
      shiftId: shift.id,
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
        isCancelled: false,
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

  const displayShift = (id) => {
    if (!id) return;
    const shift = shifts.find(s => s.id === id);
    setSelectedShift(shift);
    setIsOpen(true);
    setContacts(prev => prev.filter(contact => contact.company === shift.company))
    
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">


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
        <div className="fixed inset-0 bg-black/30" />
      </Transition.Child>

      {/* Modal panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
        <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all space-y-6 relative">
          <XIcon onClick={() => setIsOpen(false)} className="absolute top-3 right-3 text-gray-400 hover:text-black cursor-pointer transition-colors" />
  {/* Modal title */}
  <div className="space-y-1">
    <DialogTitle className="text-xl font-bold text-gray-900">{selectedShift?.name}</DialogTitle>
    <p className="text-sm text-gray-500">{selectedShift?.location}</p>
  </div>

<div className="space-y-2 max-h-[500px] overflow-scroll">
  <hr className="border-gray-200" />
  <div className="space-y-2">
    <p className="text-sm font-medium text-gray-800">Information</p>
  {/* Shift Info Grid */}
  <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
    <div className="flex items-center">
      <Calendar className="w-9 h-9 p-2 bg-purple-100 text-purple-600 rounded-md" />
      <div className="ml-3">
        <p className="text-xs text-gray-500">Date</p>
        <p>{selectedShift?.date}</p>
      </div>
    </div>

    <div className="flex items-center">
      <Clock className="w-9 h-9 p-2 bg-indigo-100 text-indigo-600 rounded-md" />
      <div className="ml-3">
        <p className="text-xs text-gray-500">Time</p>
        <p>
          {new Date(selectedShift?.start_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          –{" "}
          {new Date(selectedShift?.finish_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>

    <div className="flex items-center">
      <Building2 className="w-9 h-9 p-2 bg-amber-100 text-amber-600 rounded-md" />
      <div className="ml-3">
        <p className="text-xs text-gray-500">Company</p>
        <p>{selectedShift?.company?.split(" ")[0] || "—"}</p>
      </div>
    </div>

    <div className="flex items-center">
      <BadgeCheck
        className={`w-9 h-9 p-2 rounded-md ${
          selectedShift?.status === "complete"
            ? "bg-green-100 text-green-600"
            : "bg-red-100 text-red-600"
        }`}
      />
      <div className="ml-3">
        <p className="text-xs text-gray-500">Status</p>
        <p className="capitalize">{selectedShift?.status}</p>
      </div>
    </div>
  </div>
  </div>


  <hr className="border-gray-200 mt-4" />

  {/* Pay Info */}
  <div className="space-y-2">
    <p className="text-sm font-medium text-gray-800">Earnings</p>
    <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
      <div className="flex items-center">
        <DollarSign className="w-9 h-9 p-2 bg-blue-100 text-blue-600 rounded-md" />
        <div className="ml-3">
          <p className="text-xs text-gray-500">Pay</p>
          <p>£{selectedShift?.pay}</p>
        </div>
      </div>

      <div className="flex items-center">
        <DollarSign className="w-9 h-9 p-2 bg-green-100 text-green-600 rounded-md" />
        <div className="ml-3">
          <p className="text-xs text-gray-500">Rate</p>
          <p>£{selectedShift?.rate}</p>
        </div>
      </div>

      <div className="flex items-center">
        <Clock10 className="w-9 h-9 p-2 bg-blue-100 text-blue-600 rounded-md" />
        <div className="ml-3">
          <p className="text-xs text-gray-500">Hours</p>
          <p>{selectedShift?.hours}</p>
        </div>
      </div>
    </div>
  </div>

  {selectedShift?.notes && (
    <>
  <hr className="border-gray-200 mt-4" />
    <div className="space-y-2">
    <p className="text-sm font-medium text-gray-800">Notes</p>
      <div className="flex items-start text-sm text-gray-700">
        <StickyNote className="w-9 h-9 p-2 bg-pink-100 text-pink-600 rounded-md mt-1" />
        <div className="ml-3">
          <p className="text-xs text-gray-500 mb-1">Notes</p>
          <p>{selectedShift.notes}</p>
        </div>
      </div>
      </div>
    </>
  )}

{selectedShift?.expenses.length > 0 && (
  <>
  <hr className="border-gray-200 mt-4" />
<p className="text-sm font-medium text-gray-800">Expenses</p>
<div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
  {selectedShift?.expenses?.map((expense, i) => (
    <div className="flex items-start text-sm text-gray-700">
    <Banknote className="w-9 h-9 p-2 bg-pink-100 text-pink-600 rounded-md mt-1" />
    <div className="ml-3">
      <p className="text-xs text-gray-500 mb-1">{expense.name.toUpperCase()}</p>
      <p>{formatCurrency(expense.amount)}</p>
    </div>
  </div>
  ))}
</div>
  </>
)}





{contacts.length > 0 && (
  <>
  <hr className="border-gray-200"></hr>
  <div className="space-y-2">
  <p className="text-sm font-medium text-gray-800">Related Contacts</p>
  <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
    {contacts.map((contact, i) => (
      <div className="flex items-center">
      <Contact className="w-9 h-9 p-2 bg-indigo-100 text-indigo-600 rounded-md" />
      <div className="ml-3">
        <p className="text-xs text-gray-500">{contact.role}</p>
        <p>{contact.first_name} {contact.last_name}</p>
      </div>
    </div>
    ))}
  </div>
  </div>
  </>
  )}

</div>
</DialogPanel>

        </Transition.Child>
      </div>
    </Dialog>
  </Transition>




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
              onClick={() => displayShift(cell.shiftId)}
              className={`
                text-xs p-1 rounded
                ${cell.hasShift
                  ? cell.isCompleted
                    ? "bg-green-100 text-green-800 font-medium"
                    : "bg-blue-100 text-blue-800 font-medium"
                  : cell.day <= currentMonth.daysElapsed
                    ? "text-gray-400"
                    : "text-gray-600"}
                ${cell.day === today ? "ring-2 ring-indigo-400" : ""}
                ${cell.hasShift ? 'cursor-pointer' : 'cursor-not-allowed'}
                ${cell.isCancelled ? 'bg-red-100 text-red-800' : ''}
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
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-100 rounded mr-1" />
          <span className="text-gray-600">Cancelled</span>
        </div>
      </div>
    </div>
  );
};

export default MiniCalendar;
