import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Download, Folder, UploadCloud, Search, X, Check } from 'lucide-react';
import DataTable from '../components/DataTable';

const DocumentVault = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Dropdowns for association
  const [properties, setProperties] = useState([]);
  const [units, setUnits] = useState([]);
  const [tenants, setTenants] = useState([]);

  // Form state
  const [selectedFile, setSelectedFile] = useState(null);
  const [docName, setDocName] = useState('');
  const [docVersion, setDocVersion] = useState('1.0');
  const [propertyId, setPropertyId] = useState('');
  const [unitId, setUnitId] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('hantios_token');
      const res = await axios.get('/api/documents', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocuments(res.data);
    } catch (err) {
      console.error('Failed to fetch documents', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const token = localStorage.getItem('hantios_token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const propRes = await axios.get('/api/properties', { headers });
      setProperties(propRes.data);

      const unitRes = await axios.get('/api/units', { headers });
      setUnits(unitRes.data);

      const tenantRes = await axios.get('/api/tenants', { headers });
      setTenants(tenantRes.data);
    } catch (err) {
      console.error('Failed to load associations', err);
    }
  };

  useEffect(() => {
    fetchDocuments();
    fetchDropdownData();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!docName) {
        setDocName(file.name);
      }
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('name', docName);
    formData.append('version', docVersion);
    if (propertyId) formData.append('property_id', propertyId);
    if (unitId) formData.append('unit_id', unitId);
    if (tenantId) formData.append('tenant_id', tenantId);

    try {
      const token = localStorage.getItem('hantios_token');
      await axios.post('/api/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      // Reset & Reload
      setSelectedFile(null);
      setDocName('');
      setPropertyId('');
      setUnitId('');
      setTenantId('');
      setIsUploadOpen(false);
      fetchDocuments();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const filteredDocs = documents.filter(d => 
    d.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const columns = [
    { 
      header: 'Document Name', 
      accessor: 'name', 
      render: (row) => (
        <div className="flex items-center gap-3">
          <FileText className={row.type?.includes('pdf') ? 'text-danger' : 'text-primary'} size={20} />
          <span className="font-medium">{row.name}</span>
        </div>
      )
    },
    { 
      header: 'Association', 
      accessor: 'property_id', 
      render: (row) => {
        const prop = properties.find(p => p.id === row.property_id);
        const unit = units.find(u => u.id === row.unit_id);
        return (
          <span className="text-xs text-muted">
            {prop ? `${prop.name}` : ''}
            {unit ? ` (Unit ${unit.unit_number})` : ''}
            {!prop && !unit ? 'General' : ''}
          </span>
        );
      }
    },
    { header: 'Size', accessor: 'size', render: (row) => <span className="text-muted text-sm">{formatSize(row.size)}</span> },
    { header: 'Version', accessor: 'version', render: (row) => <span className="badge badge-info">v{row.version || '1.0'}</span> },
    { header: 'Uploaded On', accessor: 'created_at', render: (row) => <span className="text-muted text-sm">{new Date(row.created_at).toLocaleDateString()}</span> },
    { 
      header: '', 
      accessor: 'file_url', 
      render: (row) => (
        <a 
          href={row.file_url} 
          target="_blank" 
          rel="noopener noreferrer"
          download
          className="text-muted hover:text-primary transition flex items-center justify-center p-1.5 hover:bg-slate-100 rounded-lg"
          title="Download File"
        >
          <Download size={18} />
        </a>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-h2 m-0 mb-1">Document Vault</h1>
          <p className="text-muted">Securely store and manage property files</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setIsUploadOpen(true)}
        >
          <UploadCloud size={18} /> Upload Document
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Folders Navigation */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <div className="card p-4">
            <h3 className="font-semibold mb-4 text-h4">Categories</h3>
            <ul className="flex flex-col gap-2">
              <li className="flex items-center gap-3 p-2 bg-primary-light text-primary rounded-md cursor-pointer font-medium">
                <Folder size={18} /> All Files ({documents.length})
              </li>
              <li className="flex items-center gap-3 p-2 hover:bg-slate-50 text-muted hover:text-main rounded-md cursor-pointer transition">
                <Folder size={18} /> Leases & Contracts
              </li>
              <li className="flex items-center gap-3 p-2 hover:bg-slate-50 text-muted hover:text-main rounded-md cursor-pointer transition">
                <Folder size={18} /> Receipts & Payments
              </li>
              <li className="flex items-center gap-3 p-2 hover:bg-slate-50 text-muted hover:text-main rounded-md cursor-pointer transition">
                <Folder size={18} /> Insurance
              </li>
            </ul>
          </div>
        </div>

        {/* Files Listing */}
        <div className="md:col-span-3 flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={18} />
            <input 
              type="text" 
              className="input-field pl-10 bg-white" 
              placeholder="Search files by name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12 card">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="card text-center p-12">
              <FileText size={48} className="text-muted mb-4 opacity-50 mx-auto" />
              <h3 className="text-h3 mb-2">No Documents Found</h3>
              <p className="text-muted max-w-md mx-auto mb-6">
                {searchTerm ? "No results match your search query." : "Your document storage is empty. Upload leases, reports, or unit photos."}
              </p>
            </div>
          ) : (
            <DataTable columns={columns} data={filteredDocs} />
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Upload New Document</h2>
              <button 
                onClick={() => setIsUploadOpen(false)} 
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
              {error && <p className="text-red-500 text-sm p-3 bg-red-50 rounded-lg">{error}</p>}
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Select File *</label>
                <input
                  type="file"
                  required
                  onChange={handleFileChange}
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary-light file:text-primary hover:file:bg-primary-light/80 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Document Display Name *</label>
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="e.g. Unit 204 Lease Agreement"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Associated Property</label>
                  <select
                    value={propertyId}
                    onChange={(e) => {
                      setPropertyId(e.target.value);
                      setUnitId(''); // reset unit on property change
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                  >
                    <option value="">None (General)</option>
                    {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Associated Unit</label>
                  <select
                    value={unitId}
                    disabled={!propertyId}
                    onChange={(e) => setUnitId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">None</option>
                    {units.filter(u => u.property_id === propertyId).map(u => (
                      <option key={u.id} value={u.id}>Unit {u.unit_number}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Associated Tenant</label>
                <select
                  value={tenantId}
                  onChange={(e) => setTenantId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                >
                  <option value="">None</option>
                  {tenants.map(t => <option key={t.id} value={t.id}>{t.full_name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Version</label>
                <input
                  type="text"
                  value={docVersion}
                  onChange={(e) => setDocVersion(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="1.0"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentVault;
