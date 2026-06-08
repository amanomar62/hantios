import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { Building2, X, Check } from 'lucide-react';

const EditPropertyModal = ({ isOpen, onClose, property, onPropertyUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'residential',
    address: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (property) {
      setFormData({
        name: property.name || '',
        type: property.type || 'residential',
        address: property.address || '',
        description: property.description || ''
      });
    }
  }, [property]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(`/api/properties/${property.id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('hantios_token')}` }
      });
      onPropertyUpdated(response.data);
      onClose();
    } catch (error) {
      console.error("Failed to update property", error);
      toast.error(error.response?.data?.error || "Failed to save changes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200" style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-xl)' }}>
        <div className="p-6 border-b border-border flex justify-between items-center" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-light text-primary flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
              <Building2 size={20} />
            </div>
            <h2 className="text-h3 m-0">Edit Property</h2>
          </div>
          <button onClick={onClose} className="text-muted hover:text-main transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex flex-col gap-4">
            <div className="input-group">
              <label className="input-label">Property Name</label>
              <input 
                type="text" 
                className="input-field" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                required 
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">Property Type</label>
              <select 
                className="input-field" 
                value={formData.type} 
                onChange={e => setFormData({...formData, type: e.target.value})}
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="mixed">Mixed Use</option>
              </select>
            </div>
            
            <div className="input-group">
              <label className="input-label">Address</label>
              <input 
                type="text" 
                className="input-field" 
                value={formData.address} 
                onChange={e => setFormData({...formData, address: e.target.value})} 
                required 
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">Description (Optional)</label>
              <textarea 
                className="input-field" 
                rows="3"
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
              ></textarea>
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <button type="button" onClick={onClose} className="btn btn-outline flex-1">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary flex-1">
              {loading ? 'Saving...' : <><Check size={18} /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPropertyModal;
