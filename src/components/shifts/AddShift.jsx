import React, { useEffect, useState } from 'react';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  MapPin,
  Save,
  X,
  ArrowLeft,
  Briefcase,
  Timer,
  User,
  Building,
  Plus,
  Trash
} from 'lucide-react';
import { createShift, getShifts } from '../routes/ShiftRoutes';
import { toast } from 'sonner';
import Loader from '../loading/Loader'

const AddShift = () => {

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true)

  const fetchShifts = async () => {
    try{
    const response = await getShifts()
    const uniqueCompanies = Array.from(new Set(response.map(shift => shift.company)));
    setCompanies(uniqueCompanies);

    setLoading(false)
    }catch(e){
      console.log(e)
    }
  }

  useEffect(() => {
    fetchShifts();
  })


  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: '',
    start_time: '',
    finish_time: '',
    hours: 0,
    notes: '',
    status: 'pending',
    company: '',
    expenses: []
  });

  const addExpense = () => {
    setFormData(prev => ({
      ...prev,
      expenses: [...prev.expenses, {
        id: Date.now(),
        amount: '',
        name: 'food',
        expensable: false
      }]
    }))
  }

  const removeExpense = (id) => {
    setFormData(prev => ({
      ...prev,
      expenses: prev.expenses.filter(exp => exp.id !== id)
    }))
  }



  const [errors, setErrors] = useState({});

  const calculateHours = () => {
    if (formData.start_time && formData.finish_time) {
      const startTime = new Date(`2000-01-01 ${formData.start_time}`);
      let finishTime = new Date(`2000-01-01 ${formData.finish_time}`);
      
      // Handle shifts that end after midnight
      if (finishTime <= startTime) {
        finishTime.setDate(finishTime.getDate() + 1);
      }
      
      const diffMs = finishTime - startTime;
      const hours = diffMs / (1000 * 60 * 60);
      return Math.round(hours * 100) / 100; // Round to 2 decimal places
    }
    return 0;
  };

  const calculatePay = () => {
    const hours = calculateHours();
    const rate = parseFloat(formData.rate) || 0;
    return Math.round(hours * rate);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };


  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Shift name is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.start_time) newErrors.start = 'Start time is required';
    if (!formData.finish_time) newErrors.finish = 'Finish time is required';
    if (!formData.company) newErrors.company = 'Company is required';
    if (!formData.rate || parseFloat(formData.hourlyRate) <= 0) {
      newErrors.hourlyRate = 'Valid hourly rate is required';
    }
    
    // Check if finish time is after start time (accounting for overnight shifts)
    if (formData.start && formData.finish) {
      const hours = calculateHours();
      if (hours <= 0 || hours > 24) {
        newErrors.finish = 'Invalid time range';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try{

      const response = await createShift(formData)
      toast.success('Shift created successfully!', {
        description: 'You can view it in your shifts list.',
        duration: 3000
      });

      setFormData({
        name: '',
        date: '',
        location: '',
        start_time: '',
        finish_time: '',
        rate: 0,
        notes: '',
        status: 'pending',
        hours: 0,
        pay: 0,
        company: '',
        expenses: []
      });

      

    }catch(e){
      console.log(e)
    }
    
  };

  const handleReset = () => {
    setFormData({
      name: '',
      date: '',
      location: '',
      start_time: '',
      finish_time: '',
      rate: 0,
      notes: '',
      status: 'pending',
      hours: 0,
      pay: 0,
      company: '',
      expenses: []
    });
    setErrors({});
  };

  const hours = calculateHours();
  const totalPay = calculatePay();

  if (loading) {
    return (
      <Loader />
    )
  }

  return (
    <div>
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Shift Name */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <User className="w-4 h-4 text-blue-500" />
                      Shift Name / Client
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Robbie Williams, Camden Market"
                      className={`w-full px-4 py-3 rounded-xl border transition-all ${
                        errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-400 focus:bg-blue-50/30'
                      } focus:outline-none`}
                    />
                    {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                  </div>

                  {/* Date */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border transition-all ${
                        errors.date ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-400 focus:bg-blue-50/30'
                      } focus:outline-none`}
                    />
                    {errors.date && <p className="text-red-600 text-xs mt-1">{errors.date}</p>}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <MapPin className="w-4 h-4 text-purple-500" />
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., Emirates Stadium, Customer Service"
                      className={`w-full px-4 py-3 rounded-xl border transition-all ${
                        errors.location ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-400 focus:bg-blue-50/30'
                      } focus:outline-none`}
                    />
                    {errors.location && <p className="text-red-600 text-xs mt-1">{errors.location}</p>}
                  </div>

                  {/* Start Time */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <Clock className="w-4 h-4 text-emerald-500" />
                      Start Time
                    </label>
                    <input
                      type="time"
                      name="start_time"
                      value={formData.start_time}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border transition-all ${
                        errors.start ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-400 focus:bg-blue-50/30'
                      } focus:outline-none`}
                    />
                    {errors.start && <p className="text-red-600 text-xs mt-1">{errors.start}</p>}
                  </div>

                  {/* Finish Time */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <Clock className="w-4 h-4 text-emerald-500" />
                      Finish Time
                    </label>
                    <input
                      type="time"
                      name="finish_time"
                      value={formData.finish_time}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border transition-all ${
                        errors.finish ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-400 focus:bg-blue-50/30'
                      } focus:outline-none`}
                    />
                    {errors.finish && <p className="text-red-600 text-xs mt-1">{errors.finish}</p>}
                  </div>

                  {/* Hourly Rate */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      Hourly Rate (£)
                    </label>
                    <input
                      type="number"
                      name="rate"
                      value={formData.rate}
                      onChange={handleInputChange}
                      placeholder="15.50"
                      step="0.01"
                      min="0"
                      className={`w-full px-4 py-3 rounded-xl border transition-all ${
                        errors.hourlyRate ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-400 focus:bg-blue-50/30'
                      } focus:outline-none`}
                    />
                    {errors.hourlyRate && <p className="text-red-600 text-xs mt-1">{errors.hourlyRate}</p>}
                  </div>

                  {/* Status */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <Briefcase className="w-4 h-4 text-indigo-500" />
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:bg-blue-50/30 focus:outline-none transition-all"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="complete">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                   {/* Comapny */}
                   <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <MapPin className="w-4 h-4 text-purple-500" />
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border transition-all ${
                        errors.company ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-400 focus:bg-blue-50/30'
                      } focus:outline-none`}
                    />
                    <p className='text-xs space-x-3'>
                      {companies.map((c, i) => (
                        <span className='ml-1 hover:underline cursor-pointer' onClick={() => setFormData({ ...formData, company: c})}>{c}</span>
                      ))}
                    </p>
                    {errors.company && <p className="text-red-600 text-xs mt-1">{errors.company}</p>}
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <Building className="w-4 h-4 text-orange-500" />
                      Description (Optional)
                    </label>
                    <textarea
                      name="description"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Additional notes about this shift..."
                      rows="3"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:bg-blue-50/30 focus:outline-none transition-all resize-none"
                    />
                  </div>
                  </div>








                  <div className='flex justify-between border-t border-gray-200 py-4 mt-4'>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <Building className="w-4 h-4 text-orange-500" />
                      Expenses (Optional)
                    </label>
                    <div>
                      <Plus onClick={() => addExpense()} className='w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer'/>
                    </div>
                    </div>
                    <div>
                    <div className="mt-3 space-y-3">
          {formData?.expenses?.map((exp, index) => (
          <div
            key={exp.id}
            className="p-3 border border-gray-200 rounded-lg"
          >
            <input
              type="number"
              name='amount'
              placeholder="Amount (£)"
              className="border rounded border-gray-200 p-1 text-sm w-full mb-2"
              value={exp.amount}
              onChange={(e) => {
                const updated = [...formData.expenses];
                updated[index].amount = parseFloat(e.target.value);
                setFormData(prev => ({
                  ...prev,
                  expenses: updated
                }))
              }}
            />

              <input
              type="text"
              name='notes'
              placeholder="Provide Description (optional)"
              className="border rounded border-gray-200 p-1 text-sm w-full mb-2"
              value={exp.notes}
              onChange={(e) => {
                const updated = [...formData.expenses];
                updated[index].notes = (e.target.value);
                setFormData(prev => ({
                  ...prev,
                  expenses: updated
                }))
              }}
            />

            <select
              className="border rounded border-gray-200 p-1 text-sm w-full mb-2"
              name='name'
              value={exp.name}
              onChange={(e) => {
                const updated = [...formData.expenses];
                updated[index].name = (e.target.value) || 0;
                setFormData(prev => ({
                  ...prev,
                  expenses: updated
                }))
              }}
            >
              <option value='food'>Food</option>
              <option value='travel'>Travel</option>
              <option value='supplies'>Supplies</option>
              <option value='other'>Other</option>
            </select>

            <div className='flex justify-between items-center'>
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                name='expensable'
                checked={exp.expensable}
                onChange={(e) => {
                  const updated = [...formData.expenses];
                  updated[index].expensable = e.target.checked;
                  setFormData(prev => ({
                    ...prev,
                    expenses: updated
                  }))
                }}
              />
              <span>Can this be expensed?</span>
            </label>
            <div>
              <Trash onClick={() => removeExpense(exp.id)} className='w-4 h-4 text-gray-400 hover:text-red-500 cursor-pointer' />
            </div>
            </div>
          </div>
        ))}
      </div>
    </div>







                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={(e) => handleSubmit(e, false)}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    Create Shift
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 text-gray-600 font-semibold rounded-xl border border-gray-200 transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shift Preview</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {formData.name || 'Shift Name'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {formData.location || 'Location'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">
                      {formData.date ? new Date(formData.date).toLocaleDateString('en-GB', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      }) : 'Select date'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-gray-600">
                      {formData.start_time && formData.finish_time ? `${formData.start_time} - ${formData.finish_time}` : 'Set times'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50/30 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-100 rounded-lg">
                      <Timer className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Hours</p>
                      <p className="font-bold text-gray-900">{hours}h</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-100 rounded-lg">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total Pay</p>
                      <p className="font-bold text-gray-900">£{totalPay}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
              <h4 className="font-semibold text-gray-900 mb-3">Quick Tips</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Use descriptive names for easy identification</li>
                <li>• Double-check times for overnight shifts</li>
                <li>• Save as draft if details aren't finalized</li>
                <li>• Add location details like floor or department</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddShift;