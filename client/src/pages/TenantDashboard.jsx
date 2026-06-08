import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Home, FileText, Wrench, MessageSquare, CreditCard, CheckCircle, Clock } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import CheckoutModal from '../components/CheckoutModal';

const TenantDashboard = () => {
  const { user } = useContext(AuthContext);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

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

  const pendingInvoices = invoices.filter(i => i.status !== 'paid');
  const nextInvoice = pendingInvoices.length > 0 ? pendingInvoices[0] : null;

  return (
    <div className="flex-1 flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div className="flex flex-col gap-1">
        <h1 className="text-h2">Welcome back, {user?.full_name?.split(' ')[0] || 'Tenant'}</h1>
        <p className="text-muted">Here is an overview of your rental account.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Next Payment Card */}
        <div className="md:col-span-2 card bg-primary text-white border-0 overflow-hidden relative shadow-lg shadow-primary/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-white/80 font-medium text-sm tracking-wider uppercase mb-1">Next Payment</h3>
                {nextInvoice ? (
                  <div className="text-5xl font-bold mb-2">${(parseFloat(nextInvoice.amount) - parseFloat(nextInvoice.paid_amount || 0)).toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                ) : (
                  <div className="text-4xl font-bold mb-2">$0.00</div>
                )}
                <p className="text-white/90 font-medium">
                  {nextInvoice ? `Due on ${new Date(nextInvoice.due_date).toLocaleDateString()}` : "You're all caught up!"}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <CreditCard size={24} className="text-white" />
              </div>
            </div>
            
            <div className="mt-8">
              {nextInvoice ? (
                <button 
                  onClick={() => setSelectedInvoice(nextInvoice)}
                  className="bg-white text-primary hover:bg-slate-50 font-bold py-3 px-8 rounded-xl transition-all shadow-sm flex items-center gap-2"
                >
                  Pay Now
                </button>
              ) : (
                <div className="flex items-center gap-2 text-white/90 bg-white/10 w-fit px-4 py-2 rounded-lg backdrop-blur-sm">
                  <CheckCircle size={18} /> No pending invoices
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card flex flex-col gap-3">
          <h3 className="text-h4 mb-2">Quick Actions</h3>
          <button className="btn btn-outline justify-start py-3" style={{ border: 'none', backgroundColor: 'var(--color-bg)' }}>
            <Wrench size={18} className="text-muted" /> Request Maintenance
          </button>
          <button className="btn btn-outline justify-start py-3" style={{ border: 'none', backgroundColor: 'var(--color-bg)' }}>
            <MessageSquare size={18} className="text-muted" /> Message Manager
          </button>
          <button className="btn btn-outline justify-start py-3" style={{ border: 'none', backgroundColor: 'var(--color-bg)' }}>
            <FileText size={18} className="text-muted" /> View Lease Agreement
          </button>
        </div>
      </div>

      {/* Invoice History */}
      <div className="card mt-2">
        <h3 className="text-h4 mb-4">Invoice History</h3>
        
        {loading ? (
          <div className="py-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-xl" style={{ borderColor: 'var(--color-border)' }}>
            <FileText size={32} className="text-muted mx-auto mb-3 opacity-50" />
            <p className="text-muted">No invoices found for your account.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {invoices.map(inv => (
              <div key={inv.id} className="flex justify-between items-center p-4 rounded-xl border hover:bg-slate-50 transition-colors" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${inv.status === 'paid' ? 'bg-success-light text-success' : 'bg-warning-light text-warning'}`} style={{ backgroundColor: inv.status === 'paid' ? 'var(--color-success-light)' : 'var(--color-warning-light)', color: inv.status === 'paid' ? 'var(--color-success)' : 'var(--color-warning)' }}>
                    {inv.status === 'paid' ? <CheckCircle size={20} /> : <Clock size={20} />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-main">{inv.invoice_number}</h4>
                    <p className="text-sm text-muted">Due {new Date(inv.due_date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-bold text-main">${inv.amount}</p>
                    <p className={`text-xs font-semibold uppercase ${inv.status === 'paid' ? 'text-success' : 'text-warning'}`}>
                      {inv.status}
                    </p>
                  </div>
                  {inv.status !== 'paid' && (
                    <button 
                      onClick={() => setSelectedInvoice(inv)}
                      className="btn btn-outline text-sm py-1.5 px-3"
                    >
                      Pay
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Checkout Modal */}
      <CheckoutModal 
        isOpen={!!selectedInvoice} 
        onClose={() => setSelectedInvoice(null)} 
        invoice={selectedInvoice}
        onPaymentSuccess={() => {
          setSelectedInvoice(null);
          fetchInvoices();
        }}
      />
    </div>
  );
};

export default TenantDashboard;
