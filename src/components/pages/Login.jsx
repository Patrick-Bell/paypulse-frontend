import { useState } from 'react';
import { AlertCircleIcon, Eye, EyeOff, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext'
import Logo from '../assets/logo.png'
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({})

  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    let newErrors = {}
    try{
        const response = await login({email, password})
    }catch(e){
        console.log(e)
        toast.error('Error Logging In', {
          description: e.response.data.error
        })
        if (e.response.data.error.includes('User')) {
          newErrors.username = 'Email not found'
        } else if (e.response.data.error.includes('password')){
          newErrors.password = 'Incorrect Password'
        }
        setErrors(newErrors)

        setTimeout(() => {
          setErrors({})
        }, 3000)
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-gray-200 p-8 w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
            <img className='w-15 h-15 rounded-lg mx-auto mb-3' src={Logo} />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">PayPulse</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <div className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 py-2 pr-10 border ${errors.username ? 'border-red-300' : 'border-gray-300' } rounded-md`}
              placeholder="Enter your email"
              required
            />
            {errors.username && (
              <div className='text-red-600 text-xs mt-1 flex items-center'><span> <AlertCircleIcon className='w-3 h-3 mr-1' /> </span>{errors.username}</div>
            )}
              </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login