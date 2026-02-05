import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  MapPin,
  Plus,
  CheckCircle2,
  Timer,
  Briefcase,
  Filter,
  X,
  MoreVertical,
  Edit,
  Trash2,
  XCircleIcon,
  PlusCircleIcon,
  CalendarPlus,
  FilterIcon,
  Star,
  Circle,
  RotateCcw
} from 'lucide-react';
import { deleteShift, getShifts } from '../routes/ShiftRoutes';
import EditShift from './EditShift';
import Loader from '../loading/Loader';
import { toast } from 'sonner';
import { formatCurrency } from '../functions/Format'
import Tippy from '@tippyjs/react';
import { useAuth } from '../context/AuthContext'
import ShiftModal from './ShiftModal'
import StaggerAppear from '../animations/StaggerAppear';

const Shift = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [loading, setLoading] = useState(true)
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null); // Track which menu is open
  const [open, setOpen] = useState(false)
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    minPay: '',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    companies: 'all'
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const [shiftsName, setShiftsName] = useState('All Shifts')
  const [shifts, setShifts] = useState([]);
  const [filterredShifts, setFilteredShifts] = useState([]);
  const [totalStats, setTotalStats] = useState({
    totalHours: '',
    totalPay: '',
    confirmedShifts: ''
  });
  const [selectedShift, setSelectedShift] = useState(null);
  const [companies, setCompanies] = useState([]);
  const menuRef = useRef(null);
  const { user } = useAuth()

  const fetchShifts = async () => {
    try{
      const response = await getShifts()
      setShifts(response)
      setFilteredShifts(response);
      setCompanies([...new Set(response.map(shift => shift?.company))]);

      setLoading(false)
    }catch(e){
      console.log(e)
    }
  }

  useEffect(() => {
    fetchShifts()
  }, [selectedShift])
 

  const handleMenuToggle = (shiftId, event) => {
    event.stopPropagation();
    setActiveMenu(activeMenu === shiftId ? null : shiftId);
  };

  const handleEdit = (shift, event) => {
    event.stopPropagation();
    console.log('shift', shift)
    setSelectedShift(shift)
    setActiveMenu(null)
  };

  const handleDelete = async (id) => {
    try{
      const response = await deleteShift(id)
      setShifts(prev => prev.filter(shift => shift.id !== id));
      toast.success('Shift deleted successfully', {
        description: 'The shift has been removed from your list.',
      })
    }catch(e){
      console.log(e)
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      confirmed: { 
        bg: 'bg-emerald-50 border-emerald-200', 
        text: 'text-emerald-700',
        dot: 'bg-emerald-500',
        label: 'Confirmed'
      },
      pending: { 
        bg: 'bg-amber-50 border-amber-200', 
        text: 'text-amber-700',
        dot: 'bg-amber-500',
        label: 'Pending'
      },
      complete: { 
        bg: 'bg-blue-50 border-blue-200', 
        text: 'text-blue-700',
        dot: 'bg-blue-500',
        label: 'Completed'
      },
      cancelled: { 
        bg: 'bg-red-50 border-red-200', 
        text: 'text-red-700',
        dot: 'bg-red-500',
        label: 'Cancelled'
      },
    };
    return configs[status] || configs.pending;
  };

  const formatTime = (start, finish) => {
    return new Date(start).toLocaleTimeString().slice(0, 5) + '-' + new Date(finish).toLocaleTimeString().slice(0, 5)
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      month: 'all',
      companies: 'all'
    });
  };

  useEffect(() => {
    let filtered = [...shifts];
  
    if (filters.status !== 'all') {
      filtered = filtered.filter(shift => shift.status === filters.status);
    }
  
    if (filters.month !== 'all') {
      filtered = filtered.filter(shift => new Date(shift.date).getMonth() + 1 === parseInt(filters.month));
    }

    if (filters.companies !== 'all') {
      filtered = filtered.filter(shift => shift.company === filters.companies)

    }
  
    // Add other filters here (e.g., dateRange, minPay) if needed
  
    setFilteredShifts(filtered);

    const validShifts = filtered.filter(shift => shift.status !== 'cancelled');
  
    // Update total stats based on filtered shifts
    setTotalStats({
      totalHours: validShifts.reduce((acc, shift) => acc + parseFloat(shift.hours), 0),
      totalPay: validShifts.reduce((acc, shift) => acc + parseFloat(shift.pay), 0),
      confirmedShifts: filtered.filter(shift => shift.status === 'complete').length,
    });
  }, [filters, shifts]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };
  
    if (activeMenu !== null) {
      document.addEventListener('click', handleClickOutside);
    }
  
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [activeMenu]);
  

  const handleAddToCalendar = async (shiftId) => {
    try{
      const url = `${import.meta.env.VITE_API_URL}/shifts/${shiftId}/calendar.ics`;
    
      // Create a temporary invisible link element
      const link = document.createElement('a');
      link.href = url;
      link.download = `shift_${shiftId}.ics`;
      
      // Append it to the document and trigger click
      document.body.appendChild(link);
      link.click();

      toast.success('Shift opened in calendar', {
        description: 'Open the download file to add the event to your calendar.',
    })
      
      // Remove it after download started
      document.body.removeChild(link);
    }catch(e){
      console.log(e)
    }
    
  };
  
  


  const ActionMenu = ({ shift, isActive }) => (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
        e.stopPropagation()
        handleMenuToggle(shift.id, e)}
        }
          
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
      >
        <MoreVertical className="w-4 h-4 text-gray-500" />
      </button>
      
      {isActive && (
        <div className="absolute right-0 top-full mt-1 w-45 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-70">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(shift, e);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(shift?.id);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>

          
          {user.member ? (
            <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCalendar(shift?.id);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
          >
            <CalendarPlus className="w-4 h-4" />
            Add to Calendar
          </button>
          ):(
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 cursor-not-allowed"
          >
            <CalendarPlus className="w-4 h-4 text-gray-400" />
            Add to Calendar
          </button>
          )}
        </div>
      )}
    </div>
  );

  if (loading) {
    return <Loader />
  }

  if (!shifts || shifts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4 animate-fade-in">
        <XCircleIcon className="w-12 h-12 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-600 mb-2">No Shifts Found</h2>
        <p className="text-gray-500 mb-4">
          Looks like you haven’t added any shifts yet.
        </p>
        <button
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusCircleIcon className="w-4 h-4" />
          Add New Shift
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
        {selectedShift ? (
        <>
        <EditShift shift={selectedShift} setSelectedShift={setSelectedShift} />
        </>
      ):(
        <>
        {/* Top Navigation Bar */}
      <div className="bg-white">
        <ShiftModal isOpen={open} setIsOpen={setOpen} />
        <div className="mx-auto pb-4">
          <div className="flex items-center justify-between">
            <div>{shiftsName}</div> {/* Empty left side */}
            
            <div className="flex items-center gap-2">
              {/* Filter Button */}
              <Tippy content='View Stats'>
              <div onClick={() => setOpen(true)} className='border border-gray-200 rounded-lg p-2 hover:bg-gray-50 cursor-pointer'>
                <Star className='text-gray-500 hover:text-gray-700 transition-colors' />
              </div>
            </Tippy>
            <div className="flex items-center gap-2">
              {/* Filter Button */}
              <Tippy content='Filter'>
              <div onClick={() => setShowFilterModal(true)} className='border border-gray-200 rounded-lg p-2 hover:bg-gray-50 cursor-pointer'>
                <FilterIcon className='text-gray-500 hover:text-gray-700 transition-colors' />
              </div>
            </Tippy>
            </div>
            <div className="flex items-center gap-2">
              {/* Filter Button */}
              <Tippy content='Reset'>
              <div onClick={() => clearFilters()} className='border border-gray-200 rounded-lg p-2 hover:bg-gray-50 cursor-pointer'>
                <RotateCcw className='text-gray-500 hover:text-gray-700 transition-colors' />
              </div>
            </Tippy>
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filterredShifts
            .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date descending
            .map((shift, index) => {
              const statusConfig = getStatusConfig(shift.status);
              return (
                <StaggerAppear index={index}>
                <div
                  key={`${shift.id}-${index}`}
                  className="group relative bg-white rounded-2xl border border-gray-200 transition-all duration-300">
                  {/* Card Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {shift.name.length <= 20 ? shift.name : (shift.name).slice(0, 17) + '...'}
                          
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{shift.location}</span>
                        </div>
                      </div>
                      <div className={`px-3 py-1.5 rounded-full border text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full ${statusConfig.dot}`}></div>
                          {statusConfig.label}
                        </div>
                      </div>
                    </div>

                    {/* Date and Time */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium text-gray-700">{formatDate(shift.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-500" />
                        <span className="text-sm font-medium text-gray-700">{formatTime(shift.start_time, shift.finish_time)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50/30 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <div className="p-1.5 bg-emerald-100 rounded-lg">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                          </div>
                          <span className="font-bold text-gray-900">£{shift.pay}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="p-1.5 bg-blue-100 rounded-lg">
                            <Timer className="w-3.5 h-3.5 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">{shift.hours}h</span>
                        </div>
                      </div>
                      
                      <ActionMenu shift={shift} isActive={activeMenu === shift.id} />
                    </div>
                  </div>
                </div>
            </StaggerAppear>
              );
            })}
          </div>
        </div>
      </div>

      {/*  Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/30 bg-opacity-50 transition-opacity duration-300 w-full cursor-pointer"
            onClick={() => setShowFilterModal(false)}
          ></div>
          
          {/* Modal */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-2xl transform transition-transform duration-300 ease-out m-10">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Filter Shifts</h2>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              {/* Filter Options */}
              <div className="space-y-6">
                {/* Status Filter */}
                <div className='w-full overflow-scroll'>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Status</label>
                  <div className="flex gap-2">
                    {['all', 'complete', 'confirmed', 'pending'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleFilterChange('status', status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          filters.status === status
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                              
                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      Month
                    </label>
                    <select
                      value={filters.month}
                      onChange={(e) => handleFilterChange('month', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                    >
                      <option value="all">All Months</option>
                      {months.map((month, index) => (
                        <option key={month} value={index + 1}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4">
                      <Briefcase className="w-4 h-4 text-blue-500" />
                      Company
                    </label>
                    <select
                      value={filters.companies}
                      onChange={(e) => handleFilterChange('companies', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                    >
                      <option value="all">All Companies</option>
                      {companies?.map((company, index) => (
                        <option key={index} value={company}>
                          {company}
                        </option>
                      ))}
                    </select>
                  </div>


              </div>
              
              {/* Modal Actions */}
              <div className="flex gap-3 mt-8">
                <button
                  onClick={clearFilters}
                  className="flex-1 px-3 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium cursor-pointer"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="flex-1 px-3 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Summary */}
      <div className="fixed bottom-0 z-30 left-0 lg:left-70 right-0 bg-white backdrop-blur-lg border-t border-gray-200 shadow-lg p-2.5">
        <div className="px-6 py-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Hours</p>
                    <p className="text-lg font-bold text-gray-900">{Number(totalStats?.totalHours).toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-100 rounded-xl">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Earnings</p>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(totalStats?.totalPay)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-100 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Completed</p>
                    <p className="text-lg font-bold text-gray-900">{totalStats?.confirmedShifts}</p>
                  </div>
                </div>
              </div>
              
              <div className="text-right hidden md:block">
                <p className="text-xs text-gray-500">Average per hour</p>
                <p className="text-lg font-bold text-blue-600">
                  £{totalStats.totalHours > 0 ? Math.round(totalStats?.totalPay / totalStats?.totalHours) : 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
        </>
      )}

      
    </div>
  );
};

export default Shift