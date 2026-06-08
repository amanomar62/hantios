import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { Wrench, Plus, Filter, MessageSquare, AlertTriangle, CheckCircle, Clock, X, User } from 'lucide-react';
import DataTable from '../components/DataTable';
import { AuthContext } from '../context/AuthContext';

const MaintenanceRequests = () => {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [properties, setProperties] = useState([]);
  const [units, setUnits] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'low',
    property_id: '',
    unit_id: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Details Drawer State
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [postingComment, setPostingComment] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('hantios_token');
      const res = await axios.get('/api/maintenance', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTickets(res.data);
    } catch (err) {
      console.error('Failed to load maintenance requests', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPropertiesAndUnits = async () => {
    try {
      const token = localStorage.getItem('hantios_token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const propRes = await axios.get('/api/properties', { headers });
      setProperties(propRes.data);

      const unitRes = await axios.get('/api/units', { headers });
      setUnits(unitRes.data);
    } catch (err) {
      console.error('Failed to fetch property/unit dropdowns', err);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchPropertiesAndUnits();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');

    try {
      const token = localStorage.getItem('hantios_token');
      await axios.post('/api/maintenance', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setIsModalOpen(false);
      setFormData({
        title: '',
        description: '',
        priority: 'low',
        property_id: '',
        unit_id: ''
      });
      fetchTickets();
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to submit maintenance request.');
    } finally {
      setSubmitting(false);
    }
  };

  // Details & Comments Drawer Handlers
  const handleOpenDetails = async (ticket) => {
    setSelectedTicket(ticket);
    setComments([]);
    setNewComment('');
    setLoadingComments(true);

    try {
      const token = localStorage.getItem('hantios_token');
      const res = await axios.get(`/api/maintenance/${ticket.id}/comments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments(res.data);
    } catch (err) {
      console.error('Failed to load comments', err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedTicket) return;

    setPostingComment(true);
    try {
      const token = localStorage.getItem('hantios_token');
      const res = await axios.post(`/api/maintenance/${selectedTicket.id}/comments`, {
        comment: newComment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Append new comment
      setComments(prev => [...prev, res.data]);
      setNewComment('');
    } catch (err) {
      console.error('Failed to post comment', err);
      toast.error('Could not submit comment.');
    } finally {
      setPostingComment(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedTicket) return;

    setUpdatingStatus(true);
    try {
      const token = localStorage.getItem('hantios_token');
      const res = await axios.put(`/api/maintenance/${selectedTicket.id}`, {
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update locally
      setSelectedTicket(res.data);
      // Refresh tickets list
      setTickets(prev => prev.map(t => t.id === res.data.id ? res.data : t));
    } catch (err) {
      console.error('Failed to update status', err);
      toast.error('Could not update request status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Stats calculation
  const openCount = tickets.filter(t => t.status === 'open').length;
  const inProgressCount = tickets.filter(t => t.status === 'in_progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'resolved').length;
  const totalCount = tickets.length;

  const getPriorityBadge = (priority) => {
    const p = priority?.toLowerCase();
    if (p === 'high') return 'badge-danger';
    if (p === 'medium') return 'badge-warning';
    return 'badge-info';
  };

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    if (s === 'resolved') return 'badge-success';
    if (s === 'open') return 'badge-danger';
    return 'badge-info';
  };

  const columns = [
    { 
      header: 'Ticket ID', 
      accessor: 'id', 
      render: (row) => <span className="font-semibold text-primary">TKT-{row.id.slice(0, 5).toUpperCase()}</span> 
    },
    { header: 'Issue Title', accessor: 'title', render: (row) => <span className="font-medium">{row.title}</span> },
    { 
      header: 'Location', 
      accessor: 'unit_id', 
      render: (row) => {
        const prop = properties.find(p => p.id === row.property_id);
        const unit = units.find(u => u.id === row.unit_id);
        return (
          <span className="text-sm">
            {prop ? prop.name : 'Unknown Property'} 
            {unit ? ` - Unit ${unit.unit_number}` : ''}
          </span>
        );
      }
    },
    { 
      header: 'Priority', 
      accessor: 'priority', 
      render: (row) => <span className={`badge ${getPriorityBadge(row.priority)}`}>{row.priority.toUpperCase()}</span> 
    },
    { 
      header: 'Status', 
      accessor: 'status', 
      render: (row) => <span className={`badge ${getStatusBadge(row.status)}`}>{row.status.toUpperCase()}</span> 
    },
    { 
      header: 'Actions', 
      accessor: 'id', 
      render: (row) => (
        <button 
          onClick={() => handleOpenDetails(row)} 
          className="btn btn-outline text-xs py-1 px-3"
        >
          View details
        </button>
      )
    }
  ];

  // Filter units for the dropdown
  const filteredUnits = formData.property_id 
    ? units.filter(u => u.property_id === formData.property_id)
    : units;

  const propOfSelected = selectedTicket ? properties.find(p => p.id === selectedTicket.property_id) : null;
  const unitOfSelected = selectedTicket ? units.find(u => u.id === selectedTicket.unit_id) : null;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-h2 m-0 mb-1">Maintenance Requests</h1>
          <p className="text-muted">Track and resolve property issues</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={20} /> New Request
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-6">
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-red-50 text-danger rounded-xl"><AlertTriangle size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Open Tickets</p>
            <h3 className="text-2xl font-bold text-slate-800">{openCount}</h3>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-500 rounded-xl"><Clock size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">In Progress</p>
            <h3 className="text-2xl font-bold text-slate-800">{inProgressCount}</h3>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-green-50 text-success rounded-xl"><CheckCircle size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Resolved</p>
            <h3 className="text-2xl font-bold text-slate-800">{resolvedCount}</h3>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-slate-100 text-slate-600 rounded-xl"><Wrench size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Tickets</p>
            <h3 className="text-2xl font-bold text-slate-800">{totalCount}</h3>
          </div>
        </div>
      </div>

      {/* Table view */}
      {loading ? (
        <div className="flex justify-center items-center py-12 card">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : tickets.length === 0 ? (
        <div className="card flex flex-col justify-center items-center text-center p-12">
          <Wrench size={48} className="text-muted mb-4 opacity-50 mx-auto" />
          <h3 className="text-h3 mb-2">All Clear!</h3>
          <p className="text-muted max-w-md mb-6">
            There are currently no active maintenance requests filed in your workspace.
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            Create Ticket
          </button>
        </div>
      ) : (
        <DataTable columns={columns} data={tickets} />
      )}

      {/* New Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">New Maintenance Ticket</h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitTicket} className="p-6 space-y-4">
              {formError && <p className="text-red-500 text-sm p-3 bg-red-50 rounded-lg">{formError}</p>}
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Issue Summary *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="e.g. Broken AC or Leaking Faucet"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Description *</label>
                <textarea
                  name="description"
                  required
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                  placeholder="Describe the issue in details..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Property *</label>
                  <select
                    name="property_id"
                    required
                    value={formData.property_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                  >
                    <option value="">Select Property</option>
                    {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Unit *</label>
                  <select
                    name="unit_id"
                    required
                    value={formData.unit_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                  >
                    <option value="">Select Unit</option>
                    {filteredUnits.map(u => <option key={u.id} value={u.id}>Unit {u.unit_number}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white font-medium"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ticket Details & Comments Sidebar Drawer */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Ticket Details</span>
                <h2 className="text-xl font-bold text-slate-800 mt-1">TKT-{selectedTicket.id.slice(0, 5).toUpperCase()}</h2>
              </div>
              <button 
                onClick={() => setSelectedTicket(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-50 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 m-0">{selectedTicket.title}</h3>
                <p className="text-sm text-slate-500 mt-2 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  {selectedTicket.description}
                </p>
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <span className="text-xs text-muted block">Location</span>
                  <span className="text-sm font-semibold text-slate-800">
                    {propOfSelected ? propOfSelected.name : 'N/A'} {unitOfSelected ? `#${unitOfSelected.unit_number}` : ''}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted block">Priority</span>
                  <span className={`badge mt-1 ${getPriorityBadge(selectedTicket.priority)}`}>
                    {selectedTicket.priority.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Status Update (Manager/Owner only) */}
              {user?.role !== 'tenant' && (
                <div className="pt-4 border-t border-slate-100">
                  <label className="block text-xs text-muted mb-2">Update Ticket Status</label>
                  <select
                    value={selectedTicket.status}
                    disabled={updatingStatus}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition bg-white text-sm font-medium"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              )}

              {/* Comments Stream */}
              <div className="pt-6 border-t border-slate-100">
                <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
                  <MessageSquare size={16} /> Comments ({comments.length})
                </h4>

                {loadingComments ? (
                  <div className="flex justify-center py-6">
                    <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                  </div>
                ) : comments.length === 0 ? (
                  <p className="text-xs text-muted text-center py-4">No comments left on this ticket yet.</p>
                ) : (
                  <div className="space-y-3">
                    {comments.map(c => (
                      <div key={c.id} className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex gap-2.5 items-start">
                        <div className="avatar bg-slate-200 text-slate-600 w-7 h-7 font-bold text-xs flex items-center justify-center">
                          <User size={12} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-500 leading-normal m-0">{c.comment}</p>
                          <span className="text-[10px] text-slate-400 block mt-1">{new Date(c.created_at).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Comment Form Input */}
            <form onSubmit={handlePostComment} className="p-4 border-t border-slate-100 bg-white flex gap-2 items-center">
              <input
                type="text"
                className="input-field flex-1 bg-slate-50"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={postingComment}
              />
              <button
                type="submit"
                disabled={postingComment || !newComment.trim()}
                className="btn btn-primary px-4 py-2 text-sm rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceRequests;
