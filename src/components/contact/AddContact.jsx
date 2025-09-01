import React, { useState } from 'react';
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
  Mail,
  Phone,
  PodcastIcon,
  Check,
  XCircleIcon
} from 'lucide-react';
import { createShift } from '../routes/ShiftRoutes';
import { createContact } from '../routes/ContactRoutes';
import { toast } from 'sonner';

const AddContact = ({ setOpen }) => {

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    location: '',
    email: '',
    phone: '',
    company: '',
    role: ''
  });

  const [errors, setErrors] = useState({});


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
    
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.company) newErrors.comapny = 'Company is required';
    if (!formData.email) newErrors.email = 'Email time is required';
    if (!formData.phone || formData.phone.length < 10) {
      newErrors.phonw = 'Valid Phone nuber is required';
    }
    if (!formData.role) newErrors.role = 'Role is required'
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    try{
        const response = await createContact(formData)
        toast.success('Contact created successfully!', {
          description: 'You can now view this contact in your contacts list.',
          duration: 3000,
        });
        setOpen(false)
    }catch(e){
      console.log(e)
    }
  };

  const handleReset = () => {
    setFormData({
      first_name: '',
      last_name: '',
      location: '',
      email: '',
      phone: '',
      company: '',
      role: ''
    });
    setErrors({});
  };


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
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <User className="w-4 h-4 text-blue-500" />
                      First Name
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      placeholder="John"
                      className={`w-full px-4 py-3 rounded-xl border transition-all ${
                        errors.first_name ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-400 focus:bg-blue-50/30'
                      } focus:outline-none`}
                    />
                    {errors.first_name && <p className="text-red-600 text-xs mt-1">{errors.first_name}</p>}
                  </div>

                  {/* Date */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <User className="w-4 h-4 text-blue-500" />
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border transition-all ${
                        errors.last_name ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-400 focus:bg-blue-50/30'
                      } focus:outline-none`}
                    />
                    {errors.last_name && <p className="text-red-600 text-xs mt-1">{errors.last_name}</p>}
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

                  {/* Company */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <Briefcase className="w-4 h-4 text-emerald-500" />
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
                    {errors.company && <p className="text-red-600 text-xs mt-1">{errors.company}</p>}
                  </div>

                  {/* Email*/}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <Mail className="w-4 h-4 text-emerald-500" />
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border transition-all ${
                        errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-400 focus:bg-blue-50/30'
                      } focus:outline-none`}
                    />
                    {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                  </div>

                  {/* phone */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <Phone className="w-4 h-4 text-green-500" />
                      Phone Number
                    </label>
                    <input
                      type="number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="15.50"
                      step="0.01"
                      min="0"
                      className={`w-full px-4 py-3 rounded-xl border transition-all ${
                        errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-400 focus:bg-blue-50/30'
                      } focus:outline-none`}
                    />
                    {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <PodcastIcon className="w-4 h-4 text-green-500" />
                      Role
                    </label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      placeholder="15.50"
                      step="0.01"
                      min="0"
                      className={`w-full px-4 py-3 rounded-xl border transition-all ${
                        errors.role ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-400 focus:bg-blue-50/30'
                      } focus:outline-none`}
                    />
                    {errors.role && <p className="text-red-600 text-xs mt-1">{errors.role}</p>}
                  </div>

                  
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={(e) => handleSubmit(e, false)}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all"
                  >
                    <Save className="w-4 h-4" />
                    Create Contact
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 text-gray-600 font-semibold rounded-xl border border-gray-200 transition-all"
                  >
                    <X className="w-4 h-4" />
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Preview</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                    {formData.first_name && formData.last_name ? `${formData.first_name} ${formData.last_name}` : 'Name'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {formData.location || 'Location'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">
                        {formData.company || 'Company'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-gray-600">
                      {formData.role || 'Role'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50/30 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-100 rounded-lg">
                      <Mail className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-bold text-gray-900">
                        {formData.email ? <Check className='w-4 h-4 text-green-600' /> : <X className='w-4 h-4 text-red-600' />}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-100 rounded-lg">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Number</p>
                      <p className="font-bold text-gray-900">
                      {formData.phone ? <Check className='w-4 h-4 text-green-600' /> : <X className='w-4 h-4 text-red-600' />}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
              <h4 className="font-semibold text-gray-900 mb-3">Quick Tips</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Use accurate information</li>
                <li>• Can be used to quickly send emails</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddContact;