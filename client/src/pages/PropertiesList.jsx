import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Building2, Search, Filter, Plus } from 'lucide-react';
import DataTable from '../components/DataTable';
import AddPropertyModal from '../components/AddPropertyModal';

const PropertiesList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('hantios_token');
      const res = await axios.get('/api/properties', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProperties(res.data);
    } catch (err) {
      console.error('Failed to load properties', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const filteredProperties = properties.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { 
      header: 'Property Name', 
      accessor: 'name', 
      render: (row) => (
        <div 
          className="font-semibold text-primary hover:underline cursor-pointer flex items-center gap-2"
          onClick={() => navigate(`/properties/${row.id}`)}
        >
          <Building2 size={16} className="opacity-70" />
          {row.name}
        </div>
      ) 
    },
    { header: 'Type', accessor: 'type', render: (row) => <span className="capitalize">{row.type || 'N/A'}</span> },
    { header: 'Address', accessor: 'address', render: (row) => <div className="text-muted text-sm">{row.address}</div> },
    { header: 'Total Units', accessor: 'units_count', render: (row) => <span className="font-medium">{row.units_count || 0}</span> },
    { 
      header: 'Actions', 
      accessor: 'id', 
      render: (row) => (
        <button 
          onClick={() => navigate(`/properties/${row.id}`)} 
          className="btn btn-outline py-1 px-3 text-xs"
        >
          View Details
        </button>
      )
    }
  ];

  return (
    <div className="flex-1 flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-h2 m-0 mb-1">Properties</h1>
          <p className="text-muted">Manage your entire real estate portfolio</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={20} /> Add Property
        </button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={18} />
          <input 
            type="text" 
            className="input-field pl-10 bg-white" 
            placeholder="Search properties by name or address..." 
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
      ) : filteredProperties.length === 0 ? (
        <div className="card flex flex-col justify-center items-center text-center p-12">
          <Building2 size={48} className="text-muted mb-4 opacity-50" />
          <h3 className="text-h3 mb-2">No Properties Found</h3>
          <p className="text-muted max-w-md mb-6">
            {searchTerm ? "No properties match your search term." : "Start by adding your first property complex or family home."}
          </p>
          {!searchTerm && (
            <button 
              className="btn btn-primary"
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Property Now
            </button>
          )}
        </div>
      ) : (
        <DataTable columns={columns} data={filteredProperties} />
      )}

      <AddPropertyModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onPropertyAdded={fetchProperties}
      />
    </div>
  );
};

export default PropertiesList;
