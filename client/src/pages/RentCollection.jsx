import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { CreditCard, Download, Search, CheckCircle, AlertCircle, FileText, X } from 'lucide-react';
import DataTable from '../components/DataTable';

const RentCollection = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Manual payment state
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [recording, setRecording] = useState(false);
  const [recordError, setRecordError] = useState('');

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/rent/invoices', {
        headers: { Authorization: `Bearer ${localStorage.getItem('hantios_token')}` }
      });
      setInvoices(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleGenerateInvoices = async () => {
    if (!window.confirm("Are you sure you want to generate next month's invoices for all occupied units?")) return;
    
    try {
      setGenerating(true);
      const res = await axios.post('/api/rent/invoices/generate', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('hantios_token')}` }
      });
      toast.success(res.data.message);
      fetchInvoices();
    } catch (err) {
      toast.error("Failed to generate invoices: " + (err.response?.data?.error || err.message));
    } finally {
      setGenerating(false);
    }
  };

  const handleOpenRecordPayment = (invoice) => {
    setSelectedInvoice(invoice);
    // Suggest the remaining balance as the default amount
    const remainingBalance = parseFloat(invoice.amount) - parseFloat(invoice.paid_amount || 0);
    setPaymentAmount(remainingBalance.toString());
    setPaymentMethod('cash');
    setRecordError('');
  };

  const handleRecordPaymentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    setRecording(true);
    setRecordError('');

    try {
      await axios.post(`/api/rent/pay/${selectedInvoice.id}`, {
        amount: parseFloat(paymentAmount),
        payment_method: paymentMethod
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('hantios_token')}` }
      });
      
      setSelectedInvoice(null);
      fetchInvoices();
    } catch (err) {
      setRecordError(err.response?.data?.error || 'Failed to record manual payment.');
    } finally {
      setRecording(false);
    }
  };

  const columns = [
    { header: 'Invoice #', accessor: 'invoice_number', render: (row) => <span className="font-semibold text-slate-700">{row.invoice_number}</span> },
    { header: 'Tenant', accessor: 'tenant_name', render: (row) => row.tenant_name || <span className="text-muted italic">Unknown</span> },
    { header: 'Unit', accessor: 'unit_name', render: (row) => `${row.property_name} - ${row.unit_name}` },
    { header: 'Amount', accessor: 'amount', render: (row) => <span className="font-semibold">${row.amount}</span> },
    { header: 'Due Date', accessor: 'due_date' },
    { 
      header: 'Status', 
      accessor: 'status', 
      render: (row) => {
        let badgeClass = 'badge-warning';
        if (row.status === 'paid') badgeClass = 'badge-success';
        if (row.status === 'overdue') badgeClass = 'badge-danger';
        return <span className={`badge ${badgeClass}`}>{row.status.toUpperCase()}</span>;
      }
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (row) => (
        row.status !== 'paid' ? (
          <button 
            onClick={() => handleOpenRecordPayment(row)}
            className="btn btn-outline text-xs py-1 px-3"
          >
            Record Payment
          </button>
        ) : (
          <span className="text-xs text-muted font-medium">Processed</span>
        )
      )
    }
  ];

  const totalCollected = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + parseFloat(i.paid_amount || 0), 0);
  const totalPending = invoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + (parseFloat(i.amount) - parseFloat(i.paid_amount || 0)), 0);

  return (
    <div className="flex-1 flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-h2 m-0 mb-1">Rent Collection</h1>
          <p className="text-muted">Manage invoices and track incoming payments</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={handleGenerateInvoices}
          disabled={generating}
        >
          <CreditCard size={18} /> {generating ? 'Generating...' : 'Auto-Generate Month Invoices'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card flex flex-col gap-2">
          <div className="flex justify-between items-center text-muted">
            <span className="text-sm font-medium">Total Invoices</span>
            <FileText size={18} />
          </div>
          <span className="text-h2 font-bold">{invoices.length}</span>
        </div>
        
        <div className="card flex flex-col gap-2">
          <div className="flex justify-between items-center text-success">
            <span className="text-sm font-medium">Collected</span>
            <CheckCircle size={18} />
          </div>
          <span className="text-h2 font-bold">${totalCollected.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
        </div>

        <div className="card flex flex-col gap-2">
          <div className="flex justify-between items-center text-warning">
            <span className="text-sm font-medium">Pending / Overdue</span>
            <AlertCircle size={18} />
          </div>
          <span className="text-h2 font-bold text-warning">${totalPending.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
        </div>
      </div>

      <div className="card flex-1 flex flex-col p-0 overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: 'var(--color-border)' }}>
          <h3 className="text-h4 m-0">Recent Invoices</h3>
          <div className="flex gap-2">
            <button className="btn btn-outline py-1.5"><Download size={16} /> Export</button>
          </div>
        </div>
        
        {loading ? (
          <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
        ) : (
          <DataTable data={invoices} columns={columns} />
        )}
      </div>

      {/* Manual Payment Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Record Rent Payment</h2>
                <p className="text-xs text-muted mt-1">{selectedInvoice.invoice_number} ({selectedInvoice.tenant_name || 'Tenant'})</p>
              </div>
              <button 
                onClick={() => setSelectedInvoice(null)} 
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRecordPaymentSubmit} className="p-6 space-y-4">
              {recordError && <p className="text-red-500 text-sm p-3 bg-red-50 rounded-lg">{recordError}</p>}
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Payment Amount ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white font-medium"
                >
                  <option value="cash">Cash Payment</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="check">Paper Check</option>
                  <option value="credit_card">Credit Card Simulation</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={recording}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {recording ? 'Recording...' : 'Record Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentCollection;
