import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DollarSign, TrendingUp, TrendingDown, ArrowUpRight, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const FinancialAnalytics = () => {
  const [invoices, setInvoices] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('hantios_token');
        const headers = { Authorization: `Bearer ${token}` };
        const [invoicesRes, statsRes] = await Promise.all([
          axios.get('/api/rent/invoices', { headers }),
          axios.get('/api/rent/stats', { headers })
        ]);
        setInvoices(invoicesRes.data);
        setChartData(statsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex-1 flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  // Calculate Metrics
  const totalExpected = invoices.reduce((sum, i) => sum + parseFloat(i.amount), 0);
  const totalCollected = invoices.reduce((sum, i) => sum + parseFloat(i.paid_amount || 0), 0);
  const totalOutstanding = totalExpected - totalCollected;
  const collectionRate = totalExpected > 0 ? (totalCollected / totalExpected) * 100 : 0;

  const graphData = chartData;

  return (
    <div className="flex-1 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-h2">Financial Analytics</h1>
          <p className="text-muted">Portfolio revenue and collection performance</p>
        </div>
        <div className="flex gap-2">
          <select className="input-field py-1.5" style={{ minWidth: '150px' }}>
            <option>All Properties</option>
            <option>Sunset Apartments</option>
          </select>
          <select className="input-field py-1.5" style={{ minWidth: '120px' }}>
            <option>This Year</option>
            <option>Last Year</option>
          </select>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card flex flex-col gap-1">
          <div className="flex justify-between items-center text-muted mb-2">
            <span className="text-sm font-medium">Total Collected</span>
            <DollarSign size={16} />
          </div>
          <span className="text-h2 font-bold">${totalCollected.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          <div className="flex items-center gap-1 text-xs font-medium text-success mt-1">
            <TrendingUp size={14} /> +4.2% from last month
          </div>
        </div>

        <div className="card flex flex-col gap-1">
          <div className="flex justify-between items-center text-muted mb-2">
            <span className="text-sm font-medium">Expected Rent</span>
            <ArrowUpRight size={16} />
          </div>
          <span className="text-h2 font-bold">${totalExpected.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          <div className="flex items-center gap-1 text-xs font-medium text-muted mt-1">
            Total active leases
          </div>
        </div>

        <div className="card flex flex-col gap-1 border-l-4" style={{ borderLeftColor: 'var(--color-warning)' }}>
          <div className="flex justify-between items-center text-muted mb-2">
            <span className="text-sm font-medium">Outstanding</span>
            <AlertCircle size={16} />
          </div>
          <span className="text-h2 font-bold text-warning">${totalOutstanding.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          <div className="flex items-center gap-1 text-xs font-medium text-danger mt-1">
            <TrendingDown size={14} /> -1.5% from last month
          </div>
        </div>

        <div className="card flex flex-col gap-1">
          <div className="flex justify-between items-center text-muted mb-2">
            <span className="text-sm font-medium">Collection Rate</span>
            <CheckCircle size={16} />
          </div>
          <span className="text-h2 font-bold">{collectionRate.toFixed(1)}%</span>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
            <div className="bg-success h-1.5 rounded-full" style={{ width: `${collectionRate}%` }}></div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 card flex flex-col">
          <h3 className="text-h4 mb-6">Revenue Over Time</h3>
          <div className="flex-1 w-full" style={{ minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={graphData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-light)', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-light)', fontSize: 12 }} dx={-10} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
                />
                <Area type="monotone" dataKey="expected" stroke="#cbd5e1" strokeDasharray="5 5" fill="none" strokeWidth={2} name="Expected" />
                <Area type="monotone" dataKey="collected" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorCollected)" strokeWidth={3} name="Collected" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card flex flex-col">
          <h3 className="text-h4 mb-4">Recent Transactions</h3>
          <div className="flex flex-col gap-4 overflow-y-auto pr-2 flex-1">
            {invoices.filter(i => i.status === 'paid').slice(0, 6).map(inv => (
              <div key={inv.id} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-success-light text-success flex items-center justify-center">
                    <CheckCircle size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold m-0">{inv.tenant_name || 'Tenant'}</h4>
                    <p className="text-xs text-muted m-0">{inv.unit_name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-success">+${inv.amount}</div>
                  <div className="text-xs text-muted">Today</div>
                </div>
              </div>
            ))}
            {invoices.filter(i => i.status === 'paid').length === 0 && (
              <div className="text-center py-8 text-muted text-sm">
                No recent transactions
              </div>
            )}
          </div>
          <button className="btn btn-outline w-full mt-4 text-sm py-2">View All Transactions</button>
        </div>
      </div>
    </div>
  );
};

export default FinancialAnalytics;
