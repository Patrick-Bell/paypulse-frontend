import React from 'react';
import { 
  Calendar, 
  Clock, 
  Target, 
  FileText, 
  User, 
  BarChart3,
  X,
  Calendar1,
  Plus,
  Users,
  File,
  LogOut,
  BadgeCheck,
  BadgePoundSterling,
  MessageCircle,
  Crown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // Required Tippy core styles



const Sidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3, pro: false },
    { id: 'month', label: 'This Month', icon: Calendar1, pro: false  },
    { id: 'shifts', label: 'My Shifts', icon: Calendar, pro: false  },
    { id: 'addshift', label: 'Add Shift', icon: Plus, pro: false  },
    { id: 'goals', label: 'Goals', icon: Target, pro: true },
    { id: 'payslips', label: 'Payslips', icon: FileText, pro: false  },
    { id: 'message', label: 'Chatbot', icon: MessageCircle, pro: true },
    { id: 'reports', label: 'Reports', icon: File, pro: false  },
    { id: 'contact', label: 'Contacts', icon: Users, pro: false  },
    { id: 'profile', label: 'Profile', icon: User, pro: false  },
  ];

  return (
    <>
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/10 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 min-h-screen flex flex-col
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">PayPulse</h1>
              <p className="text-xs text-gray-500">Your Wage Tracker</p>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <div className={`w-full flex items-center space-x-3 rounded-lg text-left transition-all duration-200 cursor-pointer ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}>
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
              {item.pro && (
                <Crown className='mr-4' />
              )}
              </div>
            );
          })}
        <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-gray-100 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
          
        </nav>

        {/* User Info + Logout */}
        <div className="flex-shrink-0 border-t border-gray-200 p-4 bg-white z-90 space-y-3">
          <div className="flex items-center space-x-3 p-3 rounded-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className='flex items-center'>
              <p className="text-sm font-medium text-gray-900 truncate mr-[3px]">{user?.first_name}</p>
              <Tippy
                  content="Email verified"
                  placement="top"
                  theme="light-border"
                  delay={[100, 0]}
                  arrow={true}
                >
                  <BadgeCheck className="h-4 w-4 text-green-500 cursor-pointer" />
                </Tippy>  
                <Tippy
                  content="PayPulse Pro"
                  placement="top"
                  theme="light-border"
                  delay={[100, 0]}
                  arrow={true}
                >
                <BadgePoundSterling className='h-4 w-4 text-indigo-500 cursor-pointer'/>
                </Tippy>            
              </div>
              <p className="text-xs text-gray-500 truncate">{user?.job}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
