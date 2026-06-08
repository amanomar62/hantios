import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Search, Filter, Mail, Phone, Shield } from 'lucide-react';
import DataTable from '../components/DataTable';
import InviteUserModal from '../components/InviteUserModal';

const TenantsList = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('hantios_token');
      const res = await axios.get('/api/tenants', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTenants(res.data);
    } catch (err) {
      console.error('Failed to load tenants', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const filteredTenants = tenants.filter(t => 
    t.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { 
      header: 'Tenant Name', 
      accessor: 'full_name', 
      render: (row) => (
        <div className="font-semibold flex items-center gap-2">
          <div className="avatar bg-primary-light text-primary w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
            {row.full_name?.charAt(0).toUpperCase()}
          </div>
          {row.full_name}
        </div>
      ) 
    },
    { 
      header: 'Contact Info', 
      accessor: 'email', 
      render: (row) => (
        <div className="flex flex-col gap-0.5">
          <span className="flex items-center gap-1 text-sm"><Mail size={14} className="text-muted" /> {row.email}</span>
          {row.phone && <span className="flex items-center gap-1 text-xs text-muted"><Phone size={12} /> {row.phone}</span>}
        </div>
      )
    },
    { header: 'National ID', accessor: 'national_id', render: (row) => <span>{row.national_id || <span className="text-muted italic">Not Provided</span>}</span> },
    { 
      header: 'Emergency Contact', 
      accessor: 'emergency_contact', 
      render: (row) => (
        <span className="text-sm">{row.emergency_contact || <span className="text-muted italic">None</span>}</span>
      )
    }
  ];

  return (
    <div className="flex-1 flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-h2 m-0 mb-1">Tenants</h1>
          <p className="text-muted">Manage leases, documents, and tenant profiles</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setIsInviteModalOpen(true)}
        >
          <Users size={20} /> Invite Tenant
        </button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={18} />
          <input 
            type="text" 
            className="input-field pl-10 bg-white" 
            placeholder="Search tenants by name, email, or phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn btn-outline">
          <Filter size={18} /> Filter
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12 card h-full">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : filteredTenants.length === 0 ? (
        <div className="card flex flex-col justify-center items-center text-center p-12">
          <Users size={48} className="text-muted mb-4 opacity-50" />
          <h3 className="text-h3 mb-2">No Tenants Found</h3>
          <p className="text-muted max-w-md mb-6">
            {searchTerm ? "No tenants match your search term." : "You do not have any registered tenants in this workspace yet. Invite a tenant to occupy a unit."}
          </p>
          {!searchTerm && (
            <button 
              className="btn btn-primary"
              onClick={() => setIsInviteModalOpen(true)}
            >
              Invite Tenant Now
            </button>
          )}
        </div>
      ) : (
        <DataTable columns={columns} data={filteredTenants} />
      )}

      <InviteUserModal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)}
        role="tenant"
      />
    </div>
  );
};

export default TenantsList;
