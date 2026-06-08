import React, { useState, useEffect } from 'react';
import StatsCard from '../components/StatsCard';
import DataTable from '../components/DataTable';
import { Users, AlertTriangle, CheckCircle, Clock, UserPlus } from 'lucide-react';
import InviteUserModal from '../components/InviteUserModal';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ManagerDashboard = () => {
  const [stats, setStats] = useState({
    activeTenants: 0,
    openTickets: 0,
    pendingLeases: 0,
    latePayments: 0
  });

  const [tickets, setTickets] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('hantios_token');
        const headers = { 'Authorization': `Bearer ${token}` };
        
        // Fetch tickets
        const tktRes = await fetch('/api/maintenance', { headers });
        let fetchedTickets = [];
        if (tktRes.ok) {
          const tktData = await tktRes.json();
          fetchedTickets = tktData.map(t => ({
            id: `TKT-${t.id}`,
            property: `Unit ${t.unit_id}`,
            issue: t.title,
            priority: t.priority.charAt(0).toUpperCase() + t.priority.slice(1),
            status: t.status.charAt(0).toUpperCase() + t.status.slice(1),
            date: new Date(t.created_at).toLocaleDateString()
          }));
          setTickets(fetchedTickets);
        }
        
        // Fetch tenants for stats
        const tenRes = await fetch('/api/tenants', { headers });
        let tenantCount = 0;
        if (tenRes.ok) {
          const tenData = await tenRes.json();
          tenantCount = tenData.length;
        }

        setStats({
          activeTenants: tenantCount,
          openTickets: fetchedTickets.filter(t => t.status !== 'Closed' && t.status !== 'Resolved').length,
          pendingLeases: 0,
          latePayments: 0
        });

        // Fetch financial stats
        const chartRes = await fetch('/api/rent/stats', { headers });
        if (chartRes.ok) {
          const cData = await chartRes.json();
          setChartData(cData);
        }

      } catch (err) {
        console.error('Failed to load manager dashboard data', err);
      }
    };
    fetchDashboardData();
  }, []);

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'High': return 'badge-danger';
      case 'Medium': return 'badge-warning';
      default: return 'badge-success';
    }
  };

  const columns = [
    { header: 'Ticket ID', accessor: 'id', render: (row) => <span className="font-medium text-primary">{row.id}</span> },
    { header: 'Property/Unit', accessor: 'property' },
    { header: 'Issue Summary', accessor: 'issue' },
    { header: 'Priority', accessor: 'priority', render: (row) => (
      <span className={`badge ${getPriorityBadge(row.priority)}`}>{row.priority}</span>
    )},
    { header: 'Status', accessor: 'status', render: (row) => (
      <span className={`badge ${row.status === 'Resolved' ? 'badge-success' : 'badge-info'}`}>{row.status}</span>
    )},
    { header: 'Created', accessor: 'date', render: (row) => <span className="text-muted text-sm">{row.date}</span> }
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-h2">Property Manager Workspace</h1>
          <p className="text-muted">Manage operations, tenants, and maintenance</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setIsInviteModalOpen(true)}
        >
          <UserPlus size={18} /> Invite Tenant
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <StatsCard title="Active Tenants" value={stats.activeTenants} icon={Users} />
        <StatsCard title="Open Tickets" value={stats.openTickets} icon={AlertTriangle} trend="up" trendValue="4" />
        <StatsCard title="Pending Leases" value={stats.pendingLeases} icon={Clock} />
        <StatsCard title="Late Payments" value={stats.latePayments} icon={AlertTriangle} trend="down" trendValue="2%" />
      </div>

      {/* Financial Revenue Over Time Chart */}
      <div className="card flex flex-col">
        <h3 className="text-h4 mb-6">Rent Collections over Time</h3>
        <div className="w-full" style={{ height: '260px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCollectedManager" x1="0" y1="0" x2="0" y2="1">
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
              <Area type="monotone" dataKey="expected" stroke="var(--color-text-light)" strokeDasharray="5 5" fill="none" strokeWidth={2} name="Expected" />
              <Area type="monotone" dataKey="collected" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorCollectedManager)" strokeWidth={3} name="Collected" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: 'var(--color-border)' }}>
          <h3 className="text-h4">Recent Maintenance Requests</h3>
          <button className="btn btn-outline text-sm">View All Tickets</button>
        </div>
        <DataTable columns={columns} data={tickets} />
      </div>
      
      <InviteUserModal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
        role="tenant" 
      />
    </div>
  );
};

export default ManagerDashboard;
