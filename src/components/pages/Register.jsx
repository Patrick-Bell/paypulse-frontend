import { useState } from 'react';
import { AlertCircleIcon, Eye, EyeOff, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext'
import { registerUser } from '../routes/UserRoutes';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

const Register = () => {
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    job: '',
    password: '',
    confirm_password: ''

  })
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({})

  const navigate = useNavigate()


  const handleInputChange = (e) => {
    const { name, value } = e.target

    setUserData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = (userData) => {
    let newErrors = {};
  
    if (!userData.first_name || !userData.first_name.trim()) {
      newErrors.first_name = "First name cannot be empty";
    }
  
    if (!userData.last_name || !userData.last_name.trim()) {
      newErrors.last_name = "Last name cannot be empty";
    }

    if (!userData.job.trim()) newErrors.job = 'Job title cannot be empty'
   
    if (!userData.email || !userData.email.trim()) {
      newErrors.email = "Email cannot be empty";
    } else {
      // Simple email regex check
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(userData.email)) {
        newErrors.email = "Invalid email format";
      }
    }

    if (!userData.password.trim()) newErrors.password = 'Password cannot be blank'
    if (userData.password.length < 8) newErrors.password = 'Password cannot be less than 8 characters'

    if (userData.password !== userData.confirm_password) newErrors.confirm_password = 'Passwords do not match'
  
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // run validation
    const isValid = validateForm(userData);
  
    if (!isValid) {
      toast.error('Error creating your account', {
        description: 'Please read the error messages and amend the form to continue with registration.'
      })
      return;
    }
  
    try {
      const response = await registerUser(userData);
      toast.success('Registration Successful', {
        description: 'You can now sign into your account'
      })
      navigate('/login')
    } catch (e) {
      console.error("Registration failed:", e);
      toast.error('Registration Error', {
        description: e.response.data.email
      })
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-gray-200 p-8 w-full max-w-xl">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">PayPulse</h1>
          <p className="text-gray-600">Create your account</p>
        </div>

        {/* Login Form */}
        <div className="space-y-6">

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              name='first_name'
              value={userData.first_name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 pr-10 border ${errors.first_name ? 'border-red-300' : 'border-gray-300' } rounded-md`}
              placeholder="First Name"
              required
            />
          {errors.first_name && (
              <div className='text-red-600 text-xs mt-1 flex items-center'><span> <AlertCircleIcon className='w-3 h-3 mr-1' /> </span>{errors.first_name}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              name='last_name'
              value={userData.last_name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 pr-10 border ${errors.last_name ? 'border-red-300' : 'border-gray-300' } rounded-md`}
              placeholder="Last Name"
              required
            />
          {errors.last_name && (
              <div className='text-red-600 text-xs mt-1 flex items-center'><span> <AlertCircleIcon className='w-3 h-3 mr-1' /> </span>{errors.last_name}</div>
            )}
          </div>
          </div>


          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name='email'
              value={userData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 pr-10 border ${errors.email ? 'border-red-300' : 'border-gray-300' } rounded-md`}
              placeholder="Enter your email"
              required
            />
            {errors.email && (
              <div className='text-red-600 text-xs mt-1 flex items-center'><span> <AlertCircleIcon className='w-3 h-3 mr-1' /> </span>{errors.email}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title
            </label>
            <input
              type="text"
              name='job'
              value={userData.job}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 pr-10 border ${errors.job ? 'border-red-300' : 'border-gray-300' } rounded-md`}
              placeholder="Last Name"
              required
            />
            {errors.job && (
              <div className='text-red-600 text-xs mt-1 flex items-center'><span> <AlertCircleIcon className='w-3 h-3 mr-1' /> </span>{errors.job}</div>
            )}
            </div>

          {/* Password Field */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name='password'
                value={userData.password}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 pr-10 border ${errors.password ? 'border-red-300' : 'border-gray-300' } rounded-md`}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <div className='text-red-600 text-xs mt-1 flex items-center'><span> <AlertCircleIcon className='w-3 h-3 mr-1' /> </span>{errors.password}</div>
            )}
          </div>

          {/* Confirm Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name='confirm_password'
                value={userData.confirm_password}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 pr-10 border ${errors.confirm_password ? 'border-red-300' : 'border-gray-300' } rounded-md`}
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirm_password && (
              <div className='text-red-600 text-xs mt-1 flex items-center'><span> <AlertCircleIcon className='w-3 h-3 mr-1' /> </span>{errors.confirm_password}</div>
            )}
          </div>
          </div>


          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Loading...
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register