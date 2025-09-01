import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Bell, Edit2, Save, X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext'
import { toast } from 'sonner';
import { changePassword } from '../routes/UserRoutes';
import PayPulsePro from '../overview/PayPulsePro';
import { formatDate } from '../functions/Format';

const ProfilePage = () => {

    const { user, updateUser, checkAuth } = useAuth()
    console.log('user', user)
  // User data from the schema
  const [userData, setUserData] = useState({
    id: user?.id,
    first_name: user?.first_name,
    last_name: user?.last_name, 
    email: user?.email,
    role: user?.role,
    dob: user?.dob || 'N/A',
    job: user?.job || 'N/A',
    created_at: user?.created_at
  });
  

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [editingSections, setEditingSections] = useState({
    personal: false,
    notifications: false,
    password: false
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [tempUserData, setTempUserData] = useState(userData);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  const handleEditToggle = (section) => {
    if (editingSections[section]) {
      // Cancel editing
      setTempUserData(userData);
      setEditingSections(prev => ({ ...prev, [section]: false }));
    } else {
      // Start editing
      setEditingSections(prev => ({ ...prev, [section]: true }));
    }
  };

  const handleSave = async (section) => {
    if (section === 'personal') {
      setUserData(tempUserData);
      const response = await updateUser(user?.id, tempUserData);
      await checkAuth()
      toast.success('Profile updated successfully!', {
        description: 'Your personal information has been saved.',
      });
    }
    setEditingSections(prev => ({ ...prev, [section]: false }));
  };

  const handlePasswordChange = async () => {
    try{
      const response = await changePassword({ current_password: passwords.currentPassword, new_password: passwords.newPassword, confirm_password: passwords.confirmPassword })
      toast.success('Password updated successfully!', {
        description: 'Your password has been changed successfully.',
      });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }catch(e){
      console.log(e)
      toast.error('Error updating password', {
        description: e.response?.data?.error || 'An error occurred while updating your password.',
      });
    }
    
  };

  return (
    <div>
      <div className="mx-auto">
        

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="rounded-xl p-8 border border-gray-200 bg-white">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
              </div>
              <button
                onClick={() => editingSections.personal ? handleSave('personal') : handleEditToggle('personal')}
                className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingSections.personal ? (
                  <>
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </>
                )}
              </button>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  {editingSections.personal ? (
                    <input
                      type="text"
                      value={tempUserData?.first_name}
                      onChange={(e) => setTempUserData(prev => ({ ...prev, first_name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{userData.first_name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  {editingSections.personal ? (
                    <input
                      type="text"
                      value={tempUserData.last_name}
                      onChange={(e) => setTempUserData(prev => ({ ...prev, last_name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{userData.last_name}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                {editingSections.personal ? (
                  <input
                    type="email"
                    value={tempUserData.email}
                    onChange={(e) => setTempUserData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{userData.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                {editingSections.personal ? (
                  <input
                    type="text"
                    value={tempUserData.job || ''}
                    onChange={(e) => setTempUserData(prev => ({ ...prev, job: e.target.value }))}
                    placeholder="Enter your job title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{userData.job || 'Not specified'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                {editingSections.personal ? (
                  <input
                    type="date"
                    value={tempUserData.dob || ''}
                    onChange={(e) => setTempUserData(prev => ({ ...prev, dob: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{formatDate(userData.dob)}</p>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                <p className="text-gray-600">{formatDate(userData.created_at)}</p>
              </div>

              <div className="pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Verification</label>
                <p className="text-gray-600">Your email has been verified.</p>
              </div>

              <div className="pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">PayPulse Pro</label>
                <p className="text-gray-600">You are currently using the PayPulse Free Plan. Click <span className='text-indigo-600 font-bold cursor-pointer hover:text-indigo-400 transition-colors'>here</span> to upgrade to PayPulse Pro</p>
              </div>

              {editingSections.personal && (
                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => handleEditToggle('personal')}
                    className="mr-3 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <X className="w-4 h-4 mr-1 inline" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Notification Preferences */}
          <div className='grid grid-rows-2 gap-4'>
          <div className="rounded-xl p-8 border border-gray-200 bg-white">
            <div className="flex items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Notification Preferences</h3>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-medium text-gray-900">Email Notifications</h4>
                  <p className="text-sm text-gray-600">Receive important updates via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.emailNotifications}
                    onChange={(e) => setNotifications(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-medium text-gray-900">Push Notifications</h4>
                  <p className="text-sm text-gray-600">Get notified instantly on your device</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.pushNotifications}
                    onChange={(e) => setNotifications(prev => ({ ...prev, pushNotifications: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-medium text-gray-900">Marketing Emails</h4>
                  <p className="text-sm text-gray-600">Receive promotional content and updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.marketingEmails}
                    onChange={(e) => setNotifications(prev => ({ ...prev, marketingEmails: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
          <div className='border border-gray-200 rounded-xl'>
              <PayPulsePro />
          </div>
          </div>

          {/* Password Management */}
          <div className="rounded-xl p-8 border border-gray-200 bg-white lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <h3 className="text-xl font-semibold text-gray-900">Change Password</h3>
              </div>
              <button
                onClick={() => handleEditToggle('password')}
                className="flex items-center px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                {editingSections.password ? (
                  <>
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </>
                )}
              </button>
            </div>

            {editingSections.password ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      value={passwords.currentPassword}
                      onChange={(e) => setPasswords(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPasswords.current ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      value={passwords.newPassword}
                      onChange={(e) => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPasswords.new ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwords.confirmPassword}
                      onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="md:col-span-3 flex justify-end pt-4">
                  <button
                    onClick={handlePasswordChange}
                    disabled={!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">Click "Edit" to update your account password</p>
                <p className="text-sm text-gray-500 mt-2">Last Updated: {formatDate(user?.password_last_updated) || 'N/A'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;