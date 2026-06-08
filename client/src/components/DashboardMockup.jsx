import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, FileText, Settings, LayoutDashboard, 
  Home, DollarSign, TrendingUp, Bell, PieChart, Wrench, 
  Folder, ArrowUpRight, ShieldCheck, HardDrive, CheckCircle2,
  AlertTriangle, Play, Pause, ChevronRight
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import StatsCard from './StatsCard';

const DashboardMockup = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [financialData, setFinancialData] = useState([]);

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Properties', icon: Building2 },
    { label: 'Tenants', icon: Users },
    { label: 'Financials', icon: PieChart },
    { label: 'Maintenance', icon: Wrench },
    { label: 'Documents', icon: FileText },
  ];

  // Auto-cycle tabs every 5 seconds if autoplay is active
  useEffect(() => {
    if (!isAutoplay) return;

    const interval = setInterval(() => {
      setActiveTab((currentTab) => {
        const currentIndex = navItems.findIndex(item => item.label === currentTab);
        const nextIndex = (currentIndex + 1) % navItems.length;
        return navItems[nextIndex].label;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoplay]);

  // Load animated charts data
  useEffect(() => {
    setChartData([
      { name: 'Jan', collected: 5000, expected: 6000 },
      { name: 'Feb', collected: 7200, expected: 8000 },
      { name: 'Mar', collected: 9500, expected: 10000 },
      { name: 'Apr', collected: 11000, expected: 12000 },
      { name: 'May', collected: 13500, expected: 14000 },
      { name: 'Jun', collected: 15400, expected: 16000 }
    ]);

    setFinancialData([
      { month: 'Jan', Income: 8200, Expenses: 3100 },
      { month: 'Feb', Income: 9800, Expenses: 4200 },
      { month: 'Mar', Income: 11500, Expenses: 3900 },
      { month: 'Apr', Income: 12800, Expenses: 4600 },
      { month: 'May', Income: 14200, Expenses: 5100 },
      { month: 'Jun', Income: 15400, Expenses: 5950 }
    ]);
  }, [activeTab]); // Triggers transition animation when activeTab changes

  // Handle manual tab click: update tab and pause autoplay
  const handleTabClick = (label) => {
    setActiveTab(label);
    setIsAutoplay(false);
  };

  const payments = [
    { tenant: 'Mohamed Aska', property: 'Mogadishu Tower', amount: '$450.00', method: 'EVC Plus', date: 'Today, 2:14 PM', status: 'Paid' },
    { tenant: 'Farah Hirsi', property: 'Hargeisa Heights', amount: '$600.00', method: 'Zaad', date: 'Today, 11:30 AM', status: 'Paid' },
    { tenant: 'Amina Yusuf', property: 'Mogadishu Tower', amount: '$350.00', method: 'Sahal', date: 'Yesterday', status: 'Paid' },
    { tenant: 'Abdi Warsame', property: 'Garowe Plaza', amount: '$500.00', method: 'EVC Plus', date: '04 Jun 2026', status: 'Pending' }
  ];

  const properties = [
    { name: 'Mogadishu Tower', address: 'Wadada Makka Al-Mukarama, Mogadishu', type: 'Residential', units: 24, occupancy: 95, revenue: '$6,500' },
    { name: 'Hargeisa Heights', address: 'Shacab Area, Hargeisa', type: 'Commercial', units: 12, occupancy: 100, revenue: '$4,200' },
    { name: 'Garowe Plaza', address: 'Main Street, Garowe', type: 'Residential', units: 8, occupancy: 88, revenue: '$2,850' },
    { name: 'Kismayo Suites', address: 'Beach Road, Kismayo', type: 'Residential', units: 4, occupancy: 75, revenue: '$1,850' }
  ];

  const tenants = [
    { name: 'Mohamed Aska', phone: '+252 61 555 1234', unit: 'Apt 4B', property: 'Mogadishu Tower', rent: '$450/mo', status: 'Paid' },
    { name: 'Farah Hirsi', phone: '+252 63 444 5678', unit: 'Suite 201', property: 'Hargeisa Heights', rent: '$600/mo', status: 'Paid' },
    { name: 'Amina Yusuf', phone: '+252 61 777 9876', unit: 'Apt 12A', property: 'Mogadishu Tower', rent: '$350/mo', status: 'Paid' },
    { name: 'Abdi Warsame', phone: '+252 90 222 3456', unit: 'Apt 2C', property: 'Garowe Plaza', rent: '$500/mo', status: 'Pending' },
    { name: 'Halima Dirie', phone: '+252 61 999 8888', unit: 'Suite 4', property: 'Kismayo Suites', rent: '$400/mo', status: 'Overdue' }
  ];

  const maintenance = [
    { id: 'MT-402', title: 'Plumbing Water Leak', location: 'Mogadishu Tower - Apt 3B', priority: 'Urgent', status: 'In Progress', date: '1 hr ago' },
    { id: 'MT-405', title: 'Air Conditioner Malfunction', location: 'Hargeisa Heights - Suite 8', priority: 'High', status: 'Open', date: '3 hrs ago' },
    { id: 'MT-398', title: 'Flickering Electrical Outlets', location: 'Garowe Plaza - Unit 1', priority: 'Urgent', status: 'Completed', date: 'Yesterday' }
  ];

  const documents = [
    { name: 'Lease_Agreement_Mogadishu_Tower_4B.pdf', size: '2.4 MB', type: 'PDF', folder: 'Leases', date: '01 Jun 2026' },
    { name: 'Hargeisa_Property_Deed_Signed.pdf', size: '4.8 MB', type: 'PDF', folder: 'Deeds', date: '15 May 2026' },
    { name: 'Tax_Statement_Q1_2026.xlsx', size: '1.2 MB', type: 'Excel', folder: 'Financials', date: '30 Apr 2026' },
    { name: 'Elevator_Safety_Inspection.pdf', size: '850 KB', type: 'PDF', folder: 'Compliance', date: '12 Apr 2026' }
  ];

  return (
    <div className="flex bg-[#FAF7F2] text-slate-800 h-[650px] text-left overflow-hidden font-sans select-none" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* 1. Sidebar */}
      <aside className="sidebar shrink-0 h-full relative">
        <div className="flex items-center justify-center p-6 mb-2">
          <img src="/logo.png" alt="HantiOS" style={{ height: '120px', width: 'auto' }} />
        </div>
        
        <div className="flex-1 overflow-y-auto py-2">
          <ul className="flex flex-col gap-1 px-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.label;
              return (
                <li key={item.label}>
                  <button
                    onClick={() => handleTabClick(item.label)}
                    className={`mockup-sidebar-btn ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Autoplay Status Indicator */}
        <div className="px-6 py-3 border-t flex justify-between items-center bg-[#FAF8F5]/80" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isAutoplay ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`}></span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              {isAutoplay ? 'Live Demo Cycle' : 'Demo Paused'}
            </span>
          </div>
          <button 
            onClick={() => setIsAutoplay(!isAutoplay)}
            className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-teal-700 hover:bg-slate-100 transition-all active:scale-90"
            title={isAutoplay ? 'Pause autoplay' : 'Play autoplay'}
          >
            {isAutoplay ? <Pause size={12} /> : <Play size={12} />}
          </button>
        </div>

        <div className="p-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem 0.75rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-text-muted)',
              width: '100%',
              textAlign: 'left'
            }}
          >
            <Settings size={20} style={{ color: 'var(--color-text-muted)' }} />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Content */}
      <div className="main-content flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="top-nav">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Workspace</h2>
            <span className="text-slate-300">/</span>
            <span className="text-sm font-bold text-teal-800 uppercase tracking-wider" style={{ color: 'var(--color-primary)' }}>{activeTab}</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-slate-600 relative">
              <Bell size={20} />
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>
            </button>
            <div className="w-px h-5 bg-slate-200"></div>
            <div className="avatar">M</div>
          </div>
        </header>

        {/* Page Content View Selector */}
        <main className="page-content flex flex-col gap-6 overflow-y-auto" style={{ padding: '1.5rem' }}>
          
          {/* TAB 1: DASHBOARD VIEW */}
          {activeTab === 'Dashboard' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div>
                <h1 className="text-h2">Ku soo dhawaada, Mohamed (HantiOS)</h1>
                <p className="text-muted">Built for Somali property owners</p>
              </div>

              {/* Stats Card Grid */}
              <div className="grid grid-cols-2 gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
                <StatsCard title="Total Properties" value={48} icon={Building2} trend="up" trendValue="+4" />
                <StatsCard title="Total Units" value={132} icon={Home} trend="up" trendValue="+12" />
                <StatsCard title="Occupancy Rate" value="92%" icon={TrendingUp} trend="up" trendValue="+2%" />
                <StatsCard title="Monthly Revenue" value="$15,400" icon={DollarSign} trend="up" trendValue="+8%" />
              </div>

              {/* Revenue Area Chart */}
              <div className="card flex flex-col">
                <h3 className="text-h4 mb-6">Revenue Over Time</h3>
                <div className="w-full" style={{ height: '220px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCollectedOwnerMock" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.35}/>
                          <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-light)', fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-light)', fontSize: 11 }} tickFormatter={(val) => `$${val}`} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-lg)' }}
                        formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
                      />
                      <Area type="monotone" dataKey="expected" stroke="var(--color-text-light)" strokeDasharray="5 5" fill="none" strokeWidth={2} name="Expected" />
                      <Area type="monotone" dataKey="collected" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorCollectedOwnerMock)" strokeWidth={3} name="Collected" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Payments Table */}
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: 'var(--color-border)' }}>
                  <h3 className="text-h4">Recent Payments</h3>
                  <span className="text-xs font-semibold text-muted font-bold">Somali Mobile Money Log</span>
                </div>
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Tenant</th>
                        <th>Property</th>
                        <th>Amount</th>
                        <th>Method</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((p, i) => (
                        <tr key={i}>
                          <td>
                            <div className="font-semibold text-primary">{p.tenant}</div>
                            <div className="text-xs text-muted">{p.date}</div>
                          </td>
                          <td className="text-muted">{p.property}</td>
                          <td className="font-bold">{p.amount}</td>
                          <td>
                            <span className={`badge ${
                              p.method === 'EVC Plus' ? 'badge-info' : 
                              p.method === 'Zaad' ? 'badge-success' : 'badge-warning'
                            }`}>{p.method}</span>
                          </td>
                          <td>
                            <span className={`badge ${p.status === 'Paid' ? 'badge-success' : 'badge-warning'}`}>{p.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROPERTIES VIEW */}
          {activeTab === 'Properties' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div>
                <h1 className="text-h2">My Properties</h1>
                <p className="text-muted">Manage buildings, occupancy and leasing limits</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {properties.map((prop, i) => (
                  <div key={i} className="card flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-h4 text-primary font-bold">{prop.name}</h4>
                        <p className="text-xs text-muted mt-0.5">{prop.address}</p>
                      </div>
                      <span className="badge badge-info">{prop.type}</span>
                    </div>

                    <div className="flex items-center gap-6 my-4">
                      <div>
                        <div className="text-xs font-semibold text-muted">TOTAL UNITS</div>
                        <div className="text-h3 font-bold text-slate-800">{prop.units}</div>
                      </div>
                      <div className="w-px h-8 bg-slate-200"></div>
                      <div>
                        <div className="text-xs font-semibold text-muted">OCCUPANCY</div>
                        <div className="text-h3 font-bold text-teal-700">{prop.occupancy}%</div>
                      </div>
                      <div className="w-px h-8 bg-slate-200"></div>
                      <div>
                        <div className="text-xs font-semibold text-muted">MONTHLY RENT</div>
                        <div className="text-h3 font-bold text-amber-600">{prop.revenue}</div>
                      </div>
                    </div>

                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-teal-700 h-full" style={{ width: `${prop.occupancy}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TENANTS VIEW */}
          {activeTab === 'Tenants' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div>
                <h1 className="text-h2">Active Tenants</h1>
                <p className="text-muted">Tenant contacts, unit mappings, and payments statuses</p>
              </div>

              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="table-container border-none">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Tenant Name</th>
                        <th>Contact Phone</th>
                        <th>Unit Location</th>
                        <th>Monthly Rent</th>
                        <th>Payment Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tenants.map((t, i) => (
                        <tr key={i}>
                          <td className="font-semibold text-primary">{t.name}</td>
                          <td className="text-muted font-mono">{t.phone}</td>
                          <td>
                            <div className="font-medium text-slate-800">{t.unit}</div>
                            <div className="text-xs text-muted">{t.property}</div>
                          </td>
                          <td className="font-bold">{t.rent}</td>
                          <td>
                            <span className={`badge ${
                              t.status === 'Paid' ? 'badge-success' : 
                              t.status === 'Pending' ? 'badge-warning' : 'badge-danger'
                            }`}>{t.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FINANCIALS VIEW */}
          {activeTab === 'Financials' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div>
                <h1 className="text-h2">Financial Analytics</h1>
                <p className="text-muted">Analyze your net property cashflows, incomes and expense logs</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="card">
                  <div className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Total Cashflow</div>
                  <div className="text-h2 font-extrabold text-teal-800">$74,100</div>
                  <div className="text-xs text-success font-semibold mt-1">↑ 12% vs last quarter</div>
                </div>
                <div className="card">
                  <div className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Expenses Paid</div>
                  <div className="text-h2 font-extrabold text-slate-700">$26,850</div>
                  <div className="text-xs text-muted font-normal mt-1">Maintenance & staff salaries</div>
                </div>
                <div className="card">
                  <div className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Net Cash Margin</div>
                  <div className="text-h2 font-extrabold text-amber-600">63.7%</div>
                  <div className="text-xs text-success font-semibold mt-1">Excellent liquidity ratio</div>
                </div>
              </div>

              {/* Income vs Expenses Bar Chart */}
              <div className="card">
                <h3 className="text-h4 mb-6">Income vs Expenses (USD)</h3>
                <div className="w-full" style={{ height: '220px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={financialData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-light)', fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-light)', fontSize: 11 }} tickFormatter={(val) => `$${val}`} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-lg)' }}
                      />
                      <Legend verticalAlign="top" height={36} />
                      <Bar dataKey="Income" fill="var(--color-primary)" radius={[4, 4, 0, 0]} name="Income" />
                      <Bar dataKey="Expenses" fill="var(--color-text-light)" radius={[4, 4, 0, 0]} name="Expenses" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MAINTENANCE VIEW */}
          {activeTab === 'Maintenance' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div>
                <h1 className="text-h2">Maintenance Requests</h1>
                <p className="text-muted">Tenant reported malfunctions and repair contractor assignments</p>
              </div>

              <div className="flex flex-col gap-4">
                {maintenance.map((ticket, i) => (
                  <div key={i} className="card flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                      <div className="avatar" style={{ borderRadius: 'var(--radius-md)', background: ticket.priority === 'Urgent' ? 'var(--color-danger-light)' : 'var(--color-primary-light)' }}>
                        <Wrench size={18} className={ticket.priority === 'Urgent' ? 'text-danger' : 'text-primary'} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-mono font-semibold text-muted">{ticket.id}</span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            ticket.priority === 'Urgent' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                          }`}>{ticket.priority}</span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm mt-1">{ticket.title}</h4>
                        <p className="text-xs text-muted mt-0.5">{ticket.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <span className="text-xs text-muted font-medium">{ticket.date}</span>
                      <span className={`badge ${
                        ticket.status === 'Completed' ? 'badge-success' : 
                        ticket.status === 'In Progress' ? 'badge-info' : 'badge-warning'
                      }`}>{ticket.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: DOCUMENTS VIEW */}
          {activeTab === 'Documents' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div>
                <h1 className="text-h2">Document Vault</h1>
                <p className="text-muted">Secure storage for deeds, lease contracts, and compliance PDF records</p>
              </div>

              {/* Folders List */}
              <div className="grid grid-cols-4 gap-4">
                {['Leases', 'Deeds', 'Financials', 'Compliance'].map((folderName, i) => (
                  <div key={i} className="card flex items-center gap-3 py-4 hover:border-primary/35 cursor-pointer">
                    <Folder className="text-amber-500" size={24} />
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs">{folderName}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">Directory</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Documents List Table */}
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="p-4 border-b flex justify-between items-center bg-slate-50/50" style={{ borderColor: 'var(--color-border)' }}>
                  <h3 className="text-h4">All Files</h3>
                  <HardDrive size={16} className="text-muted" />
                </div>
                <div className="table-container border-none">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>File Name</th>
                        <th>Folder</th>
                        <th>Size</th>
                        <th>Upload Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map((doc, i) => (
                        <tr key={i}>
                          <td className="font-semibold text-primary flex items-center gap-2">
                            <FileText size={16} className="text-muted" />
                            <span>{doc.name}</span>
                          </td>
                          <td>
                            <span className="badge badge-info">{doc.folder}</span>
                          </td>
                          <td className="text-muted font-mono">{doc.size}</td>
                          <td className="text-muted">{doc.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardMockup;
