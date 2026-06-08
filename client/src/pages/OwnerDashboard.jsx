import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../components/StatsCard';
import DataTable from '../components/DataTable';
import { Building2, Home, DollarSign, TrendingUp, UserPlus, Wrench } from 'lucide-react';
import InviteUserModal from '../components/InviteUserModal';
import AddPropertyModal from '../components/AddPropertyModal';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalUnits: 0,
    occupancyRate: 0,
    monthlyRevenue: 0,
    openMaintenanceCount: 0
  });
  const [properties, setProperties] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('hantios_token');
      const headers = { 'Authorization': `Bearer ${token}` };

      // CRIT-5: Fetch real stats from dedicated endpoint
      const [propsRes, statsRes, chartRes] = await Promise.all([
        fetch('/api/properties', { headers }),
        fetch('/api/properties/stats', { headers }),
        fetch('/api/rent/stats', { headers })
      ]);

      if (propsRes.ok) {
        const data = await propsRes.json();
        setProperties(data.map(p => ({
          id: p.id,
          name: p.name,
          address: p.address,
          units: p.units_count || 0,
          type: p.type || 'Residential'
        })));
      }

      if (statsRes.ok) {
        const s = await statsRes.json();
        setStats(s);
      }

      if (chartRes.ok) {
        const cData = await chartRes.json();
        setChartData(cData);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    { 
      header: 'Property Name', 
      accessor: 'name', 
      render: (row) => (
        <div 
          className="font-semibold text-primary hover:text-primary-dark cursor-pointer flex items-center gap-2"
          onClick={() => navigate(`/properties/${row.id}`)}
        >
          {row.name}
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
        </div>
      ) 
    },
    { header: 'Address', accessor: 'address', render: (row) => <div className="text-muted">{row.address || '—'}</div> },
    { header: 'Type', accessor: 'type', render: (row) => <span className="badge badge-info">{row.type}</span> },
    { header: 'Total Units', accessor: 'units' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-h2">Portfolio Overview</h1>
          <p className="text-muted">Monitor your properties and income</p>
        </div>
        <div className="flex gap-3">
          <button 
            className="btn btn-outline"
            onClick={() => setIsInviteModalOpen(true)}
          >
            <UserPlus size={18} /> Invite Manager
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => setIsAddPropertyModalOpen(true)}
          >
            <Building2 size={18} /> Add Property
          </button>
        </div>
      </div>

      {/* CRIT-5: Real stats from API */}
      <div className="grid grid-cols-2 gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
        <StatsCard title="Total Properties" value={stats.totalProperties} icon={Building2} />
        <StatsCard title="Total Units" value={stats.totalUnits} icon={Home} />
        <StatsCard 
          title="Occupancy Rate" 
          value={`${stats.occupancyRate}%`} 
          icon={TrendingUp} 
          trend={stats.occupancyRate >= 80 ? 'up' : 'down'} 
        />
        <StatsCard 
          title="Monthly Revenue" 
          value={`$${(stats.monthlyRevenue || 0).toLocaleString()}`} 
          icon={DollarSign} 
          trend="up"
        />
        <StatsCard 
          title="Open Maintenance" 
          value={stats.openMaintenanceCount} 
          icon={Wrench}
          trend={stats.openMaintenanceCount > 0 ? 'down' : 'up'}
        />
      </div>

      {/* Financial Revenue Over Time Chart */}
      <div className="card flex flex-col">
        <h3 className="text-h4 mb-6">Revenue Over Time</h3>
        <div className="w-full" style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCollectedOwner" x1="0" y1="0" x2="0" y2="1">
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
              <Area type="monotone" dataKey="collected" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorCollectedOwner)" strokeWidth={3} name="Collected" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: 'var(--color-border)' }}>
          <h3 className="text-h4">My Properties</h3>
          <button className="btn btn-outline text-sm" onClick={() => navigate('/properties')}>View All</button>
        </div>
        {properties.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center gap-3">
            <Building2 size={40} className="text-muted opacity-40" />
            <h4 className="text-h4">No properties yet</h4>
            <p className="text-muted text-sm max-w-xs">Click <strong>Add Property</strong> to add your first building and start managing your portfolio.</p>
            <button className="btn btn-primary mt-2" onClick={() => setIsAddPropertyModalOpen(true)}>
              <Building2 size={16} /> Add Your First Property
            </button>
          </div>
        ) : (
          <DataTable columns={columns} data={properties} />
        )}
      </div>
      
      <InviteUserModal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
        role="manager" 
      />

      {/* HIGH-8: Replaced window.location.reload() with proper state update */}
      <AddPropertyModal 
        isOpen={isAddPropertyModalOpen} 
        onClose={() => setIsAddPropertyModalOpen(false)}
        onPropertyAdded={() => fetchData()}
      />
    </div>
  );
};

export default OwnerDashboard;
