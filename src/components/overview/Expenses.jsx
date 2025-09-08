import { Banknote, TrendingUp, Coffee, Car, Home, ShoppingBag } from "lucide-react"
import { useEffect, useState } from "react"
import { getExpenses } from '../routes/ExpenseRoutes'
import { formatCurrency } from '../functions/Format'
import ExpenseModal from "./ExpenseModal"

const Expenses = () => {
    const [expenses, setExpenses] = useState([])
    const [open, setOpen] = useState(false)

    const fetchExpenses = async () => {
        const response = await getExpenses()
        setExpenses(response)
    }

    useEffect(() => {
        fetchExpenses()
    }, [])

    const categories = ['food', 'travel', 'supplies', 'other'];

        // build summary with 0 defaults
        const summary = categories.map(cat => {
        const items = expenses.filter(e => e.name.toLowerCase() === cat);
        const total = items.reduce((acc, e) => acc + e.amount, 0);
        return { name: cat, amount: total };
        });

        const totalExpenses = summary.reduce((acc, item) => acc + item.amount, 0);

   
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
    return (
        <div className='border border-gray-200 rounded-xl p-6'>
            <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Banknote className="w-5 h-5 mr-2 text-indigo-600" />
                Expenses
            </h3>
            </div>
            

            {/* Expense Breakdown */}
            <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Category Breakdown</h4>
                <div className="space-y-3">
                    {summary.map((item, index) => {
                        const IconComponent = getIcon(item.name)
                        const percentage = item.amount > 0 ? ((item.amount / totalExpenses) * 100).toFixed(0) : 0
                        const numberOfItems = expenses.filter(e => e.name.toLowerCase() === item.name).length
                        
                        return (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center flex-1">
                                    <div 
                                        className="w-3 h-3 rounded-full mr-3 bg-indigo-500"
                                    ></div>
                                    <IconComponent className="w-4 h-4 mr-2 text-gray-500" />
                                    <span className="text-sm text-gray-700">{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</span>
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

            {open && (
                <ExpenseModal isOpen={open} setIsOpen={setOpen} expenses={expenses}/>
            )}

           

            {/* Trend Indicator */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                <div>
                <p className={`text-xs text-gray-400`}>
                    <span 
                    onClick={() => { if (expenses.filter((exp) => exp.expensable).length > 0) setOpen(true) }}
                    className={`${expenses.filter((exp) => exp.expensable).length > 0 ? 'underline' : ''}
                    ${expenses.filter((exp) => exp.expensable).length > 0 ? 'font-bold' : ''}
                    ${expenses.filter((exp) => exp.expensable).length > 0 ? 'cursor-pointer' : ''} 
                    mr-1`}
                    >
                    {expenses.filter(exp => exp.expensable).length}
                    </span>
                     {expenses.filter(exp => exp.expensable).length === 1 ? 'expense is' : 'expenses are'} eligible for reimbursement.
                </p>
                </div>
                <div className="text-gray-700 text-sm font-medium">{formatCurrency(summary.reduce((acc, item) => item.amount + acc, 0))}</div>
            </div>
        </div>
    )
}

export default Expenses