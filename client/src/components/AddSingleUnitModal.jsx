import React, { useState } from 'react';
import axios from 'axios';
import { Home, X, Check } from 'lucide-react';

const AddSingleUnitModal = ({ isOpen, onClose, propertyId, onUnitAdded }) => {
  const [formData, setFormData] = useState({
    unit_number: '',
    floor: '1',
    monthly_rent: '',
    deposit_amount: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // MED-5: Use the single-unit endpoint, NOT the bulk generator
      const response = await axios.post('/api/units', {
        property_id: propertyId,
        unit_number: formData.unit_number,
        floor: formData.floor,
        monthly_rent: formData.monthly_rent,
        deposit_amount: formData.deposit_amount,
        status: 'vacant'
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('hantios_token')}` }
      });
      
      onUnitAdded(response.data);
      setFormData({ unit_number: '', floor: '1', monthly_rent: '', deposit_amount: '' });
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add unit. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-xl shadow-xl w-full max-w-md overflow-hidden" style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-xl)' }}>
        <div className="p-6 border-b border-border flex justify-between items-center" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
              <Home size={20} />
            </div>
            <h2 className="text-h3 m-0">Add Single Unit</h2>
          </div>
          <button onClick={onClose} className="text-muted hover:text-main transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="input-group">
                <label className="input-label">Unit Identifier *</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. 4B, Penthouse"
                  value={formData.unit_number} 
                  onChange={e => setFormData({...formData, unit_number: e.target.value})} 
                  required 
                />
              </div>
              <div className="input-group">
                <label className="input-label">Floor *</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={formData.floor} 
                  onChange={e => setFormData({...formData, floor: e.target.value})} 
                  required 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="input-group">
                <label className="input-label">Monthly Rent ($) *</label>
                <input 
                  type="number" 
                  min="0"
                  className="input-field" 
                  value={formData.monthly_rent} 
                  onChange={e => setFormData({...formData, monthly_rent: e.target.value})} 
                  required 
                />
              </div>
              <div className="input-group">
                <label className="input-label">Deposit ($) *</label>
                <input 
                  type="number" 
                  min="0"
                  className="input-field" 
                  value={formData.deposit_amount} 
                  onChange={e => setFormData({...formData, deposit_amount: e.target.value})} 
                  required 
                />
              </div>
            </div>

            {error && (
              <div className="text-sm font-medium p-3 rounded-lg" style={{ backgroundColor: 'var(--color-danger-light)', color: 'var(--color-danger)' }}>
                {error}
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <button type="button" onClick={onClose} className="btn btn-outline flex-1">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary flex-1">
              {loading ? 'Adding...' : <><Check size={18} /> Add Unit</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSingleUnitModal;
