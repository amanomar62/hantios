import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Building2, ArrowLeft, Home, UserPlus, FileText, CheckCircle, Clock } from 'lucide-react';
import InviteUserModal from '../components/InviteUserModal';
import EditPropertyModal from '../components/EditPropertyModal';
import AddSingleUnitModal from '../components/AddSingleUnitModal';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);

  const [inviteModalData, setInviteModalData] = useState({
    isOpen: false,
    unitId: null,
    unitName: ''
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const token = localStorage.getItem('hantios_token');
        const res = await axios.get(`/api/properties/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProperty(res.data);
      } catch (err) {
        setError('Failed to load property details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="p-6 text-center text-red-500 bg-red-50 rounded-xl">
        {error || 'Property not found'}
      </div>
    );
  }

  const vacantCount = property.units?.filter(u => u.status === 'vacant').length || 0;
  const occupiedCount = property.units?.filter(u => u.status === 'occupied').length || 0;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Header Back Button & Title */}
      <div>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-4"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
              <Building2 size={32} />
            </div>
            <div>
              <h1 className="text-h2">{property.name}</h1>
              <p className="text-muted">{property.address}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-outline" onClick={() => setIsEditModalOpen(true)}><FileText size={18} /> Edit Details</button>
            <button className="btn btn-primary" onClick={() => setIsAddUnitModalOpen(true)}><Home size={18} /> Add Single Unit</button>
          </div>
        </div>
      </div>

      {/* Property Stats */}
      <div className="grid grid-cols-4 gap-6">
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-500 rounded-xl"><Home size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Units</p>
            <h3 className="text-2xl font-bold text-slate-800">{property.units_count}</h3>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-500 rounded-xl"><CheckCircle size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Occupied</p>
            <h3 className="text-2xl font-bold text-slate-800">{occupiedCount}</h3>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-orange-500 rounded-xl"><Clock size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Vacant</p>
            <h3 className="text-2xl font-bold text-slate-800">{vacantCount}</h3>
          </div>
        </div>
      </div>

      {/* Units Grid */}
      <div className="card">
        <h3 className="text-h4 mb-4">Unit Configuration</h3>
        
        {(!property.units || property.units.length === 0) ? (
          <div className="text-center py-2" style={{ backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-lg)', padding: '3rem 1rem', border: '1px dashed var(--color-border)' }}>
            <Home size={32} style={{ color: 'var(--color-text-light)', margin: '0 auto 0.75rem auto' }} />
            <p className="text-muted">No units have been generated for this property yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
            {property.units.map(unit => (
              <div key={unit.id} className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-h4" style={{ fontSize: '1.1rem' }}>Unit {unit.unit_number}</h4>
                    <p className="text-xs text-muted">Floor {unit.floor}</p>
                  </div>
                  <span className={`badge ${unit.status === 'vacant' ? 'badge-warning' : 'badge-success'}`}>
                    {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
                  </span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '0.5rem' }}>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Rent</span>
                    <span className="font-medium">${unit.monthly_rent}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Deposit</span>
                    <span className="font-medium">${unit.deposit_amount}</span>
                  </div>
                </div>

                <div style={{ marginTop: 'auto' }}>
                  {unit.status === 'vacant' ? (
                    <button 
                      onClick={() => setInviteModalData({ isOpen: true, unitId: unit.id, unitName: unit.unit_number })}
                      className="btn btn-primary w-full"
                    >
                      <UserPlus size={16} /> Invite Tenant
                    </button>
                  ) : (
                    <button className="btn btn-outline w-full" style={{ justifyContent: 'center' }}>
                      View Lease
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <InviteUserModal 
        isOpen={inviteModalData.isOpen}
        onClose={() => setInviteModalData({ isOpen: false, unitId: null, unitName: '' })}
        role="tenant"
        unitId={inviteModalData.unitId}
        unitName={inviteModalData.unitName}
      />

      <EditPropertyModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        property={property}
        onPropertyUpdated={(updatedProperty) => setProperty(updatedProperty)}
      />

      <AddSingleUnitModal 
        isOpen={isAddUnitModalOpen}
        onClose={() => setIsAddUnitModalOpen(false)}
        propertyId={property.id}
        onUnitAdded={(newUnit) => {
          setProperty(prev => ({
            ...prev,
            units: [...prev.units, newUnit].sort((a, b) => a.unit_number.localeCompare(b.unit_number, undefined, {numeric: true}))
          }));
        }}
      />
    </div>
  );
};

export default PropertyDetails;
