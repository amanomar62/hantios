import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Settings as SettingsIcon, Bell, Shield, CreditCard, User, Building, Lock, Check } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Settings = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('general');

  // Forms states
  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
  });
  const [passwordData, setPasswordData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [notifPreferences, setNotifPreferences] = useState({
    email_notif: true,
    sms_notif: false,
    maint_alerts: true,
    rent_reminders: true
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const token = localStorage.getItem('hantios_token');
      const res = await axios.put('/api/auth/me', profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      updateUser(res.data);
      setSuccessMsg('Profile updated successfully!');
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    if (passwordData.password !== passwordData.confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const token = localStorage.getItem('hantios_token');
      await axios.put('/api/auth/me', { password: passwordData.password }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPasswordData({ password: '', confirmPassword: '' });
      setSuccessMsg('Password changed successfully!');
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const toggleNotif = (key) => {
    setNotifPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    setSuccessMsg('Notification preferences updated!');
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  return (
    <div className="flex-1 flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-h2 m-0 mb-1">Settings</h1>
          <p className="text-muted">Configure your workspace and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 flex flex-col gap-2">
          <button 
            onClick={() => { setActiveTab('general'); setSuccessMsg(''); setErrorMsg(''); }}
            className={`btn w-full justify-start py-3 px-4 rounded-xl ${activeTab === 'general' ? 'btn-primary' : 'btn-outline border-0 hover:bg-slate-100 text-muted'}`}
          >
            <User size={18} /> Profile & Workspace
          </button>
          <button 
            onClick={() => { setActiveTab('security'); setSuccessMsg(''); setErrorMsg(''); }}
            className={`btn w-full justify-start py-3 px-4 rounded-xl ${activeTab === 'security' ? 'btn-primary' : 'btn-outline border-0 hover:bg-slate-100 text-muted'}`}
          >
            <Shield size={18} /> Security
          </button>
          <button 
            onClick={() => { setActiveTab('notifications'); setSuccessMsg(''); setErrorMsg(''); }}
            className={`btn w-full justify-start py-3 px-4 rounded-xl ${activeTab === 'notifications' ? 'btn-primary' : 'btn-outline border-0 hover:bg-slate-100 text-muted'}`}
          >
            <Bell size={18} /> Notifications
          </button>
        </div>

        {/* Content Box */}
        <div className="md:col-span-3 card">
          {successMsg && <div className="p-3 mb-4 text-sm text-success bg-success-light rounded-xl border border-success/15 flex items-center gap-2"><Check size={16} /> {successMsg}</div>}
          {errorMsg && <div className="p-3 mb-4 text-sm text-danger bg-danger-light rounded-xl border border-danger/15">{errorMsg}</div>}

          {/* GENERAL TAB */}
          {activeTab === 'general' && (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div>
                <h3 className="text-h3 mb-1">General Settings</h3>
                <p className="text-muted text-sm">Update your personal information and view workspace details.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="input-group">
                  <label className="input-label">Full Name</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={profileData.full_name} 
                    onChange={e => setProfileData({ ...profileData, full_name: e.target.value })}
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Phone Number</label>
                  <input 
                    type="tel" 
                    className="input-field" 
                    value={profileData.phone} 
                    onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Email Address (Read-only)</label>
                <input 
                  type="email" 
                  disabled
                  className="input-field bg-slate-50 text-slate-500 cursor-not-allowed" 
                  value={user?.email || ''} 
                />
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
                  <Building size={18} className="text-muted" /> Workspace Metadata
                </h4>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Organization ID</span>
                    <span className="font-mono text-slate-700">{user?.organization_id || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Account Role</span>
                    <span className="font-medium text-primary capitalize">{user?.role}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button type="submit" disabled={loading} className="btn btn-primary px-6 rounded-xl">
                  {loading ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <form onSubmit={handleSecuritySubmit} className="space-y-6">
              <div>
                <h3 className="text-h3 mb-1">Security Settings</h3>
                <p className="text-muted text-sm">Configure your account credentials and password safety.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="input-group">
                  <label className="input-label">New Password</label>
                  <input 
                    type="password" 
                    required
                    minLength={6}
                    placeholder="••••••••"
                    className="input-field" 
                    value={passwordData.password} 
                    onChange={e => setPasswordData({ ...passwordData, password: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Confirm New Password</label>
                  <input 
                    type="password" 
                    required
                    minLength={6}
                    placeholder="••••••••"
                    className="input-field" 
                    value={passwordData.confirmPassword} 
                    onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button type="submit" disabled={loading} className="btn btn-primary px-6 rounded-xl">
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-h3 mb-1">Notification Preferences</h3>
                <p className="text-muted text-sm">Control when and how you receive alerts from your tenants and managers.</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition">
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm">Email Alerts</h4>
                    <p className="text-xs text-muted">Receive periodic billing and messaging updates on your email.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifPreferences.email_notif} 
                    onChange={() => toggleNotif('email_notif')}
                    className="w-5 h-5 accent-primary cursor-pointer"
                  />
                </div>

                <div className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition">
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm">SMS alerts</h4>
                    <p className="text-xs text-muted">Receive emergency maintenance dispatch notifications on your phone.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifPreferences.sms_notif} 
                    onChange={() => toggleNotif('sms_notif')}
                    className="w-5 h-5 accent-primary cursor-pointer"
                  />
                </div>

                <div className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition">
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm">Maintenance Alerts</h4>
                    <p className="text-xs text-muted">Instantly get notified when a tenant submits a maintenance request.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifPreferences.maint_alerts} 
                    onChange={() => toggleNotif('maint_alerts')}
                    className="w-5 h-5 accent-primary cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
