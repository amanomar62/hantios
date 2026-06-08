import React, { useState } from 'react';
import axios from 'axios';
import { Building2, Home, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AddPropertyModal = ({ isOpen, onClose, onPropertyAdded }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1 Data: Property Details
  const [propertyData, setPropertyData] = useState({
    name: '',
    type: 'Apartment Complex',
    address: '',
    description: ''
  });

  // Step 2 Data: Bulk Unit Generator
  const [unitData, setUnitData] = useState({
    floors: 1,
    units_per_floor: 1,
    monthly_rent: '',
    deposit_amount: ''
  });

  const [createdPropertyId, setCreatedPropertyId] = useState(null);

  if (!isOpen) return null;

  const handlePropertyChange = (e) => {
    setPropertyData({ ...propertyData, [e.target.name]: e.target.value });
  };

  const handleUnitChange = (e) => {
    setUnitData({ ...unitData, [e.target.name]: e.target.value });
  };

  const handleCreateProperty = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('hantios_token');
      const res = await axios.post('/api/properties', propertyData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCreatedPropertyId(res.data.id);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create property');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateUnits = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('hantios_token');
      await axios.post('/api/units/bulk', {
        property_id: createdPropertyId,
        floors: parseInt(unitData.floors),
        units_per_floor: parseInt(unitData.units_per_floor),
        monthly_rent: parseFloat(unitData.monthly_rent) || 0,
        deposit_amount: parseFloat(unitData.deposit_amount) || 0
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (onPropertyAdded) onPropertyAdded();
      
      // Navigate to the property details drill-down view!
      navigate(`/properties/${createdPropertyId}`);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate units');
    } finally {
      setLoading(false);
    }
  };

  const totalUnitsToGenerate = parseInt(unitData.floors || 0) * parseInt(unitData.units_per_floor || 0);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {step === 1 ? 'Add New Property' : 'Generate Units'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {step === 1 ? 'Step 1 of 2: Property Details' : 'Step 2 of 2: Bulk Unit Generation'}
            </p>
          </div>
          <div className="flex gap-2">
            <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-slate-200'}`}></div>
            <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-slate-200'}`}></div>
          </div>
        </div>

        <div className="p-6">
          {error && <p className="text-red-500 text-sm mb-4 p-3 bg-red-50 rounded-lg">{error}</p>}

          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={handleCreateProperty} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Property Name *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    required
                    value={propertyData.name}
                    onChange={handlePropertyChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="e.g. Hodan Apartments"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Property Type</label>
                <select
                  name="type"
                  value={propertyData.type}
                  onChange={handlePropertyChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                >
                  <option>Apartment Complex</option>
                  <option>Commercial Plaza</option>
                  <option>Single Family Home</option>
                  <option>Townhouse</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Address *</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={propertyData.address}
                  onChange={handlePropertyChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="123 Main St, City, Country"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? 'Saving...' : <>Next Step <ArrowRight size={18} /></>}
                </button>
              </div>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form onSubmit={handleGenerateUnits} className="space-y-4">
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-primary-dark flex items-center gap-2">
                  <Check size={18} /> Property Created Successfully!
                </h3>
                <p className="text-sm text-primary/80 mt-1">
                  Now, let's instantly generate the units for {propertyData.name}.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Number of Floors *</label>
                  <input
                    type="number"
                    name="floors"
                    min="1"
                    required
                    value={unitData.floors}
                    onChange={handleUnitChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Units per Floor *</label>
                  <input
                    type="number"
                    name="units_per_floor"
                    min="1"
                    required
                    value={unitData.units_per_floor}
                    onChange={handleUnitChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg text-center border border-slate-100">
                <span className="text-slate-500 text-sm">Will automatically generate: </span>
                <span className="font-bold text-slate-800">{totalUnitsToGenerate} Units</span>
                <span className="text-slate-500 text-sm"> (e.g., 101, 102, 201...)</span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Default Rent ($)</label>
                  <input
                    type="number"
                    name="monthly_rent"
                    required
                    value={unitData.monthly_rent}
                    onChange={handleUnitChange}
                    placeholder="1500"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Default Deposit ($)</label>
                  <input
                    type="number"
                    name="deposit_amount"
                    required
                    value={unitData.deposit_amount}
                    onChange={handleUnitChange}
                    placeholder="1500"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    // Quick skip option
                    if (onPropertyAdded) onPropertyAdded();
                    navigate(`/properties/${createdPropertyId}`);
                    onClose();
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                >
                  Skip for now
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? 'Generating...' : <>Generate Units <Home size={18} /></>}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default AddPropertyModal;
