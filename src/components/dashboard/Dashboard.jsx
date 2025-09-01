import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Target, 
  FileText, 
  DollarSign, 
  Settings, 
  User, 
  BarChart3,
  Menu,
} from 'lucide-react';
import Sidebar from '../sidebar/Sidebar';
import Overview from '../overview/Overview';
import ShiftPage from '../shifts/Shift';
import AddShift from '../shifts/AddShift';
import PayslipsView from '../payslips/Payslip';
import Goals from '../goals/Goals';
import ThisMonth from '../month/ThisMonth';
import Contacts from '../contact/Contacts';
import { Toaster } from 'sonner';
import ProfilePage from '../profile/Profile';
import Message from '../messages/Message';
import UnderConstructionPage from '../sidebar/UnderConstructionPage';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'month', label: 'This Month', icon: DollarSign },
    { id: 'shifts', label: 'My Shifts', icon: Calendar },
    { id: 'timesheet', label: 'Timesheet', icon: Clock },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'payslips', label: 'Payslips', icon: FileText },
    { id: 'contact', label: 'Contacts', icon: DollarSign },
    { id: 'reports', label: 'Reports', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const recentEarnings = [
    { period: 'This Week', amount: 485.50, hours: 32 },
    { period: 'Last Week', amount: 520.25, hours: 35 },
    { period: 'This Month', amount: 1840.75, hours: 128 },
  ];

  const goals = [
    { title: 'Monthly Hours Target', progress: 78, target: '160 hours', current: '125 hours' },
    { title: 'Customer Service Score', progress: 92, target: '4.5/5', current: '4.6/5' },
    { title: 'Shift Punctuality', progress: 95, target: '95%', current: '95%' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <Overview recentEarnings={recentEarnings} />
        );
      case 'shifts':
        return (
          <ShiftPage />
        );
        case 'addshift':
          return ( <AddShift />)
        case 'payslips':
          return ( <PayslipsView /> )
        case 'goals':
          return <UnderConstructionPage />
        case 'month':
          return ( <ThisMonth />)
        case 'contact':
          return ( <Contacts /> )
        case 'profile':
          return (<ProfilePage />)
        case 'message':
          return (<Message />)
      default:
        return (
          <div className="rounded-xl p-8 border border-gray-200 text-center">
            <div className="p-6 rounded-lg inline-block mb-4">
              <Settings className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {navItems.find(item => item.id === activeTab)?.label}
            </h3>
            <p className="text-gray-600">This section is under development. Check back soon for updates!</p>
          </div>
        );
    }
  };

  return (
    <div className="h-screen flex w-full">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        setSidebarOpen={setSidebarOpen}
      />

      <Toaster position='top-center' />

      <main className="flex flex-col flex-1 overflow-hidden rounded-lg">
        {/* Header */}
        <header className="bg-white sticky top-0 border-b border-gray-200 px-6 py-5 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Open sidebar"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {navItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                </h2>
                <p className="text-sm text-gray-600">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable content area */}
        <section className="flex-1 overflow-y-auto p-6 rounded-b-lg">
          {renderContent()}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
