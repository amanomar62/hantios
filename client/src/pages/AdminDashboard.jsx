import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatsCard from '../components/StatsCard';
import DataTable from '../components/DataTable';
import { 
  Users, 
  Building2, 
  CreditCard, 
  Activity, 
  Shield, 
  Bot, 
  Cpu, 
  AlertTriangle,
  Clock
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    organizations: 0,
    mrr: 0,
    system: {
      uptime: 0,
      memoryUsage: 0,
      dbSize: '152 KB'
    }
  });

  const [activeTab, setActiveTab] = useState('organizations');
  const [organizations, setOrganizations] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [aiStats, setAiStats] = useState({
    totalRequests: 0,
    classificationRate: '0%',
    avgConfidence: '0%',
    tokenUsage: 0,
    recentQueries: []
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('hantios_token');
      const headers = { 'Authorization': `Bearer ${token}` };

      // Fetch stats
      const statsRes = await axios.get('/api/admin/stats', { headers });
      setStats(statsRes.data);

      // Fetch organizations
      const orgRes = await axios.get('/api/admin/organizations', { headers });
      setOrganizations(orgRes.data);

      // Fetch users
      const usersRes = await axios.get('/api/admin/users', { headers });
      setUsersList(usersRes.data);

      // Fetch AI stats
      const aiRes = await axios.get('/api/admin/ai-logs', { headers });
      setAiStats(aiRes.data);

      // Fetch MRR chart data
      const chartRes = await axios.get('/api/admin/mrr-chart', { headers });
      setChartData(chartRes.data);

    } catch (err) {
      console.error('Failed to load admin stats', err);
      toast.error('Failed to retrieve platform administrator statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleOrgStatus = async (orgId) => {
    try {
      const token = localStorage.getItem('hantios_token');
      const headers = { 'Authorization': `Bearer ${token}` };
      const res = await axios.post(`/api/admin/organizations/${orgId}/toggle-status`, {}, { headers });
      if (res.data.success) {
        toast.success(`Organization subscription is now ${res.data.newStatus}`);
        fetchData();
      }
    } catch (err) {
      console.error('Failed to toggle organization status', err);
      toast.error('Failed to change organization status.');
    }
  };

  const toggleUserStatus = async (userId) => {
    try {
      const token = localStorage.getItem('hantios_token');
      const headers = { 'Authorization': `Bearer ${token}` };
      const res = await axios.post(`/api/admin/users/${userId}/toggle-status`, {}, { headers });
      if (res.data.success) {
        toast.success(`User login is now ${res.data.newStatus}`);
        fetchData();
      }
    } catch (err) {
      console.error('Failed to toggle user status', err);
      toast.error('Failed to change user status.');
    }
  };

  const formatUptime = (seconds) => {
    if (!seconds) return '0d 0h 0m';
    const d = Math.floor(seconds / (3600*24));
    const h = Math.floor(seconds % (3600*24) / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    return `${d}d ${h}h ${m}m`;
  };

  const orgColumns = [
    { 
      header: 'Organization Name', 
      accessor: 'name', 
      render: (row) => <div className="font-semibold">{row.name || 'Unnamed Org'}</div> 
    },
    { 
      header: 'Subscription Plan', 
      accessor: 'plan', 
      render: (row) => (
        <span className={`badge ${row.plan === 'free_trial' ? 'badge-warning' : 'badge-success'}`} style={{ textTransform: 'capitalize' }}>
          {row.plan ? row.plan.replace('_', ' ') : 'None'}
        </span>
      ) 
    },
    { 
      header: 'SaaS Status', 
      accessor: 'subscription_status', 
      render: (row) => (
        <span className={`badge ${(row.subscription_status === 'active' || row.subscription_status === 'trialing') ? 'badge-success' : 'badge-danger'}`} style={{ textTransform: 'capitalize' }}>
          {row.subscription_status || 'Trial Expired'}
        </span>
      ) 
    },
    { 
      header: 'Billing End Date', 
      accessor: 'current_period_end',
      render: (row) => <span>{row.current_period_end ? new Date(row.current_period_end).toLocaleDateString() : 'N/A'}</span>
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (row) => (
        <button 
          onClick={() => toggleOrgStatus(row.id)}
          className={`btn btn-xs ${(row.subscription_status === 'active' || row.subscription_status === 'trialing') ? 'btn-danger' : 'btn-primary'}`}
          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
        >
          {(row.subscription_status === 'active' || row.subscription_status === 'trialing') ? 'Suspend' : 'Activate'}
        </button>
      )
    }
  ];

  const userColumns = [
    { 
      header: 'Full Name', 
      accessor: 'full_name', 
      render: (row) => <div className="font-semibold">{row.full_name || 'System User'}</div> 
    },
    { 
      header: 'Email Address', 
      accessor: 'email', 
      render: (row) => <div className="text-muted">{row.email}</div> 
    },
    { 
      header: 'Organization', 
      accessor: 'organization_name', 
      render: (row) => <span>{row.organization_name || <span className="text-muted italic">System Admin</span>}</span> 
    },
    { 
      header: 'Role', 
      accessor: 'role', 
      render: (row) => (
        <span className="badge badge-info" style={{ textTransform: 'capitalize' }}>
          {row.role}
        </span>
      ) 
    },
    { 
      header: 'Login Access', 
      accessor: 'status', 
      render: (row) => (
        <span className={`badge ${row.status === 'active' ? 'badge-success' : 'badge-danger'}`} style={{ textTransform: 'capitalize' }}>
          {row.status || 'Active'}
        </span>
      ) 
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (row) => (
        row.role !== 'admin' && (
          <button 
            onClick={() => toggleUserStatus(row.id)}
            className={`btn btn-xs ${row.status === 'active' ? 'btn-danger' : 'btn-primary'}`}
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
          >
            {row.status === 'active' ? 'Suspend' : 'Activate'}
          </button>
        )
      )
    }
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-h2">Platform Administration</h1>
          <p className="text-muted">Global SaaS performance dashboard and system metrics</p>
        </div>
        <button className="btn btn-primary" onClick={fetchData}>Sync Diagnostics</button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <StatsCard title="Registered Companies" value={stats.organizations.toString()} icon={Building2} trend="up" trendValue="1 new" />
        <StatsCard title="Global Active Users" value={stats.users.toString()} icon={Users} trend="up" trendValue="12%" />
        <StatsCard title="SaaS Platform MRR" value={`$${stats.mrr}`} icon={CreditCard} trend="up" trendValue="100% active" />
        <StatsCard 
          title="Server Diagnostics" 
          value={stats.system ? formatUptime(stats.system.uptime) : '0d 0h 0m'} 
          icon={Cpu} 
          trend="neutral" 
          trendValue={`RAM: ${stats.system?.memoryUsage || 0}MB`} 
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* SaaS MRR over time Chart */}
        <div className="card flex flex-col col-span-2">
          <h3 className="text-h4 mb-6">SaaS Subscription Revenue (MRR)</h3>
          <div className="w-full" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSaaSMrr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-light)', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-light)', fontSize: 12 }} dx={-10} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-lg)' }}
                  formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
                />
                <Area type="monotone" dataKey="expected" stroke="var(--color-text-light)" strokeDasharray="5 5" fill="none" strokeWidth={2} name="Target MRR" />
                <Area type="monotone" dataKey="collected" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorSaaSMrr)" strokeWidth={3} name="Collected MRR" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Uptime & Database */}
        <div className="card flex flex-col justify-between">
          <div>
            <h3 className="text-h4 mb-6">Platform Server Health</h3>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center p-3 rounded-lg border bg-slate-50/50" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex items-center gap-2">
                  <Activity size={18} className="text-primary" />
                  <span className="font-semibold text-sm">System Health</span>
                </div>
                <span className="badge badge-success">Online</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg border bg-slate-50/50" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex items-center gap-2">
                  <Shield size={18} className="text-info" />
                  <span className="font-semibold text-sm">Database Engine</span>
                </div>
                <span className="text-sm font-medium">SQLite3 (Active)</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg border bg-slate-50/50" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-warning" />
                  <span className="font-semibold text-sm">Storage Size</span>
                </div>
                <span className="text-sm font-medium">{stats.system?.dbSize || '152 KB'}</span>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl border border-dashed text-center mt-6" style={{ borderColor: 'var(--color-border)' }}>
            <AlertTriangle className="mx-auto text-amber-500 mb-2" size={24} />
            <p className="text-xs text-muted">All backend services are operating nominally. No critical exceptions detected.</p>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b" style={{ borderColor: 'var(--color-border)' }}>
        <button 
          onClick={() => setActiveTab('organizations')}
          className={`py-3 px-6 font-semibold border-b-2 transition-all ${activeTab === 'organizations' ? 'border-primary text-primary' : 'border-transparent text-muted'}`}
        >
          Registered Companies
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`py-3 px-6 font-semibold border-b-2 transition-all ${activeTab === 'users' ? 'border-primary text-primary' : 'border-transparent text-muted'}`}
        >
          Users Directory
        </button>
        <button 
          onClick={() => setActiveTab('ai-logs')}
          className={`py-3 px-6 font-semibold border-b-2 transition-all ${activeTab === 'ai-logs' ? 'border-primary text-primary' : 'border-transparent text-muted'}`}
        >
          AI Copilot Diagnostics
        </button>
      </div>

      {/* Tab Contents */}
      {loading ? (
        <div className="flex justify-center items-center py-12 card h-full">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          {activeTab === 'organizations' && (
            <div>
              <div className="p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
                <h3 className="text-h4">Registered Property Management Organizations</h3>
              </div>
              <DataTable columns={orgColumns} data={organizations} />
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <div className="p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
                <h3 className="text-h4">Global User Account Directory</h3>
              </div>
              <DataTable columns={userColumns} data={usersList} />
            </div>
          )}

          {activeTab === 'ai-logs' && (
            <div className="p-6 flex flex-col gap-6">
              <div className="grid grid-cols-4 gap-6">
                <div className="p-4 rounded-xl border bg-slate-50/50" style={{ borderColor: 'var(--color-border)' }}>
                  <span className="text-xs text-muted block mb-1">Copilot Request Volume</span>
                  <span className="text-2xl font-bold">{aiStats.totalRequests}</span>
                </div>
                <div className="p-4 rounded-xl border bg-slate-50/50" style={{ borderColor: 'var(--color-border)' }}>
                  <span className="text-xs text-muted block mb-1">Auto-Classification Accuracy</span>
                  <span className="text-2xl font-bold">{aiStats.classificationRate}</span>
                </div>
                <div className="p-4 rounded-xl border bg-slate-50/50" style={{ borderColor: 'var(--color-border)' }}>
                  <span className="text-xs text-muted block mb-1">Average Model Confidence</span>
                  <span className="text-2xl font-bold">{aiStats.avgConfidence}</span>
                </div>
                <div className="p-4 rounded-xl border bg-slate-50/50" style={{ borderColor: 'var(--color-border)' }}>
                  <span className="text-xs text-muted block mb-1">Copilot API Tokens Utilized</span>
                  <span className="text-2xl font-bold">{aiStats.tokenUsage.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3">Recent AI Parsing Interactions</h4>
                <div className="flex flex-col gap-3">
                  {aiStats.recentQueries.map((log, idx) => (
                    <div key={idx} className="p-4 rounded-lg border bg-white flex justify-between items-center" style={{ borderColor: 'var(--color-border)' }}>
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-sm">Query: "{log.query}"</span>
                        <span className="text-xs text-muted">Classified as: <span className="text-primary font-medium">{log.classification}</span> | Confidence: {(log.confidence * 100).toFixed(0)}%</span>
                      </div>
                      <span className="text-xs text-muted">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
