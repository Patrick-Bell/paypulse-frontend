import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Mail, 
  Target, 
  FileText, 
  Star, 
  Twitter, 
  Instagram, 
  Linkedin,
  Phone,
  MapPin,
  Crown,
  TrendingUp,
  Shield,
  Menu,
  X,
  ArrowRight,
  CheckCircle,
  Contact,
  Calendar1
} from 'lucide-react';
import CountUp from 'react-countup'
import Logo from '../assets/logo.png'
import { useAuth } from '../context/AuthContext'
import { toast } from 'sonner';
import { createPayment } from '../routes/PaymentRoutes';
import newLogo from '../assets/newlogo.png'

const WageTrackerHomepage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth()

  const handleClick = async () => {
    if (!user) {
      window.open('/register')
      toast.error('You must be signed in to upgrade to PayPulse Pro')
    } else {
      const response = await createPayment()
      window.open(response.url, '_blank');
    }
  }

  const features = [
    { icon: Clock, title: 'Track Shifts', description: 'Monitor your work hours with precision timing and smart logging capabilities.' },
    { icon: Mail, title: 'Email Reminders', description: 'Never miss a shift with automated email notifications and scheduling alerts.' },
    { icon: FileText, title: 'Payslip Generation', description: 'Automatic payslips generated at the start of every month with key metrics.' },
    { icon: Target, title: 'Set Goals', description: 'Achieve your financial targets with smart goal setting and progress tracking (coming soon).' },
    { icon: Contact, title: 'Contacts', description: 'Add contacts to have all managers in one place so you can easily contact them.' },
    { icon: Calendar1, title: 'Calendar Integration', description: 'Seamlessly integrate your shifts into your chosen calendar.' },
    { icon: TrendingUp, title: 'Analytics', description: 'Detailed insights into your earning patterns to plan accordingly.' },
    { icon: Shield, title: 'Data Security', description: 'Your personal and financial data is safe and only accessible to you.' }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
                <img className='w-30' src={newLogo} />
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-700 hover:text-purple-600 transition-colors">Features</a>
              <a href="#pricing" className="text-gray-700 hover:text-purple-600 transition-colors">Pricing</a>
              <a href="#reviews" className="text-gray-700 hover:text-purple-600 transition-colors">Reviews</a>
              <a href="#contact" className="text-gray-700 hover:text-purple-600 transition-colors">Contact</a>
            </nav>
            
            {/* Desktop Auth Buttons */}
            {!user ? (
              <div className="hidden md:flex space-x-3">
              <button onClick={() => window.open('/login')} className="px-4 py-2 text-purple-600 transition-colors cursor-pointer hover:text-purple-700">
                Sign In
              </button>
              <button onClick={() => window.open('/register')} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer">
                Register
              </button>
            </div>
            ):(
              <div>
                <button onClick={() => window.open('/dashboard')} className='px-4 py-2 rounded-lg bg-indigo-600 text-white text-md hover:bg-indigo-700 cursor-pointer'>My Dashboard</button>
              </div>
            )}
            
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-700 hover:text-purple-600">Features</a>
                <a href="#pricing" className="text-gray-700 hover:text-purple-600">Pricing</a>
                <a href="#reviews" className="text-gray-700 hover:text-purple-600">Reviews</a>
                <a href="#contact" className="text-gray-700 hover:text-purple-600">Contact</a>
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  <button className="px-4 py-2 text-purple-600 border border-purple-600 rounded-lg cursor-pointer">
                    Sign In
                  </button>
                  <button onClick={() => window.open('/register')} className="px-4 py-2 bg-purple-600 text-white rounded-lg cursor-pointer">
                    Register
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Know Your Earnings Before Payday
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              For retail, hospitality and flexible contract workers
            </p>
            <p className="text-lg mb-10 opacity-75 max-w-2xl mx-auto">
              Take control of your earnings with precision tracking, automated payslips, and smart financial insights.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => window.open('/register')} className="px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center cursor-pointer">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white hover:text-purple-600 transition-colors">
                Watch Demo
              </button>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold">
                  <CountUp end={50} duration={5}/>+
                </div>
                <div className="text-sm opacity-75">Registered Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  <CountUp end={300} duration={5}/>+
                </div>
                <div className="text-sm opacity-75">Hours Tracked</div>
              </div>
              <div className="text-center">
              <div className="text-3xl font-bold">
              {/* Mobile */}
              <span className="sm:hidden">
                £<CountUp end={10} suffix="k" duration={5}/>+
              </span>
              {/* Desktop */}
              <span className="hidden sm:inline">
                £<CountUp end={10000} duration={5}/>+
              </span>
            </div>
                <div className="text-sm opacity-75">Wages Calculated</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your wages and maximize your earnings
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Track Shifts */}
            {features.map((feature, i) => {
              const icon = feature.icon ? <feature.icon className="w-8 h-8 text-purple-600" /> : null;
              return (
              <div key={i} className="bg-white p-8 rounded-2xl border border-gray-200">
              <div className="bg-purple-100 p-3 rounded-xl w-fit mb-6">
                <div>{icon}</div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
            )})}
           </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple Pricing</h2>
            <p className="text-xl text-gray-600">Choose the plan that works for you</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">PayPulse Free</h3>
              <div className="text-4xl font-bold text-gray-900 mb-6">£0</div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span>Track up to 50 shifts</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span>Basic payslip generation</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span>Add people to your contact book</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span>Email reminders</span>
                </li>
              </ul>
              <button onClick={() => window.open('/register')} className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors cursor-pointer">
                Get Started Free
              </button>
            </div>
            
            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-8 rounded-2xl text-white relative">
              <div className="absolute top-4 right-4">
                <Crown className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-4">PayPulse Pro</h3>
              <div className="text-4xl font-bold mb-6">£4.99</div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3" />
                  <span>Unlimited shifts tracking</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3" />
                  <span>Advanced analytics dashboard</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3" />
                  <span>Priority customer support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3" />
                  <span>Access to PayPulse Bot (Beta version)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3" />
                  <span>Calendar integration</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3" />
                  <span>Access to all new features</span>
                </li>
              </ul>
              <button onClick={() => handleClick()} className="w-full py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors cursor-pointer">
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How PayPulse Works</h2>
            <p className="text-xl text-gray-600">Get started in under 2 minutes</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">

          <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Register</h3>
              <p className="text-gray-600">Create an account so you can start tracking your shifts.</p>
            </div>

             <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Create Shifts</h3>
              <p className="text-gray-600">Add shifts on your dashboard to start tracking your pay and hours.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">See Your Earnings</h3>
              <p className="text-gray-600">PayPulse instantly calculates your expected pay for the month, allowing you to budget accordingly.</p>
            </div>
          
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <div className="flex items-center justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-8 h-8 text-yellow-400 fill-current" />
              ))}
              <span className="ml-3 text-2xl font-bold text-gray-900">4.9/5</span>
            </div>
            <p className="text-xl text-gray-600">Based on 1,000+ reviews</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-200">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">"Best wage tracker I've ever used! The payslip generation feature saves me hours every month."</p>
              <div className="font-semibold text-gray-900">Sarah Johnson</div>
              <div className="text-sm text-gray-600">Freelance Designer</div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border border-gray-200">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">"PayPulse Pro is worth every penny. The analytics help me optimize my work schedule perfectly."</p>
              <div className="font-semibold text-gray-900">Mike Chen</div>
              <div className="text-sm text-gray-600">Gig Worker</div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border border-gray-200">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">"Simple, intuitive, and incredibly powerful. PayPulse transformed how I manage my finances."</p>
              <div className="font-semibold text-gray-900">Emma Rodriguez</div>
              <div className="text-sm text-gray-600">Part-time Worker</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about PayPulse</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Is my data secure and private?</h3>
              <p className="text-gray-600">Absolutely. PayPulse uses bank-level encryption to protect your data. We never share your information with employers or third parties. Your shifts and earnings data stays completely private.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I track multiple jobs with different pay rates?</h3>
              <p className="text-gray-600">Yes! PayPulse is perfect for people working multiple jobs. Set up different hourly rates for each employer - whether it's Sainsbury's at £10.50/hour and Costa at £9.80/hour.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What if my shifts change or get cancelled?</h3>
              <p className="text-gray-600">Just update or delete shifts as needed. PayPulse recalculates your earnings instantly. Perfect for the unpredictable nature of retail and hospitality work.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Do I need to manually add every single shift?</h3>
              <p className="text-gray-600">Currently yes, but it's super quick - under 10 seconds per shift. We're working on rota photo scanning and integration with major retailers' scheduling systems.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Does it handle overtime and different shift rates?</h3>
              <p className="text-gray-600">Yes! Set different rates for weekends, bank holidays, or overtime hours. PayPulse handles all the calculations automatically.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What about holiday pay and sick leave?</h3>
              <p className="text-gray-600">PayPulse Pro tracks your accrued holiday entitlement based on hours worked, helping you know exactly how much paid time off you've earned.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I prove to my manager I'm working more than my contract?</h3>
              <p className="text-gray-600">Absolutely! PayPulse shows you clear data comparing your actual hours worked vs your contracted hours - perfect evidence for requesting more guaranteed hours.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <img className='w-30 rounded-lg' src={Logo} />
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Empowering workers with intelligent wage tracking and financial insights. 
                Take control of your earnings today.
              </p>
              <div className="flex space-x-4">
                <Twitter className="w-6 h-6 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
                <Instagram className="w-6 h-6 text-gray-400 hover:text-pink-500 cursor-pointer transition-colors" />
                <Linkedin className="w-6 h-6 text-gray-400 hover:text-blue-600 cursor-pointer transition-colors" />
              </div>
            </div>
            
            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-300">0208 980 1431</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-300">paypulse@gmail.com</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-300">London, UK</span>
                </div>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <div className="space-y-3">
                <a href="#features" className="block text-gray-300 hover:text-white transition-colors">Features</a>
                <a href="#pricing" className="block text-gray-300 hover:text-white transition-colors">Pricing</a>
                <a href="#reviews" className="block text-gray-300 hover:text-white transition-colors">Reviews</a>
                <a href="#" className="block text-gray-300 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="block text-gray-300 hover:text-white transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 PayPulse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default WageTrackerHomepage