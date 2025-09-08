import React, { Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition } from '@headlessui/react';
import { Banknote, TrendingUp, Coffee, Car, Home, ShoppingBag, XIcon } from "lucide-react"
import { formatCurrency, formatDate } from '../functions/Format';


const ExpenseModal = ({ isOpen, setIsOpen, expenses }) => {

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

    const eligibleExpenses = expenses?.filter(exp => exp.expensable)
  
 
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
            <div className="fixed inset-0 bg-black/30" />
            </Transition.Child>

            {/* Container for centering */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
            {/* Animate the modal panel */}
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95 translate-y-4"
                enterTo="opacity-100 scale-100 translate-y-0"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100 translate-y-0"
                leaveTo="opacity-0 scale-95 translate-y-4"
            >
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all space-y-6 relative">
                <XIcon
                    onClick={() => setIsOpen(false)}
                    className="absolute top-3 right-3 w-6 h-6 text-gray-400 hover:text-black cursor-pointer transition-colors"
                />

                {/* Title */}
                <div className="space-y-1">
                    <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    Expenses
                    </DialogTitle>
                    <p className="text-sm text-gray-500">View all expenses eligible for refund.</p>
                </div>

                <div className="space-y-2 max-h-[500px] overflow-scroll">
                    {eligibleExpenses.map((exp, i) => {
                        const IconComponent = getIcon(exp.name)

                        return (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center flex-1">
                                    <div 
                                        className="w-3 h-3 rounded-full mr-3 bg-indigo-500"
                                    ></div>
                                    <IconComponent className="w-4 h-4 mr-2 text-gray-500" />
                                    <span className="text-sm text-gray-700">{exp.name.charAt(0).toUpperCase() + exp.name.slice(1)}</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-medium text-gray-900">{formatCurrency(exp.amount)}</div>
                                    <div className="text-xs text-gray-500">{formatDate(exp.created_at)}</div>
                                </div>
                            </div>
                        )

                    })}


                    <hr className='text-gray-300 my-3'></hr>

                    <div className='text-right'>
                        <p className='text-sm text-gray-500'>Total</p>
                        <p className='text-md font-bold'>{formatCurrency(eligibleExpenses.reduce((acc, e) => acc + e.amount, 0))}</p>
                    </div>
                </div>
                </DialogPanel>
            </Transition.Child>
            </div>
        </Dialog>
    </Transition>

  );
};

export default ExpenseModal;
