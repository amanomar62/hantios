import React, { useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { CreditCard, X, ShieldCheck } from 'lucide-react';

const CheckoutModal = ({ isOpen, onClose, invoice, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);
  
  if (!isOpen || !invoice) return null;

  const amountDue = parseFloat(invoice.amount) - parseFloat(invoice.paid_amount || 0);

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate API call to process payment
      await axios.post(`/api/rent/pay/${invoice.id}`, { amount: amountDue }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('hantios_token')}` }
      });
      
      // Simulate a small delay for realistic UX
      await new Promise(res => setTimeout(res, 1200));
      onPaymentSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-300" style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-xl)' }}>
        
        {/* Header */}
        <div className="p-6 pb-4 flex justify-between items-start">
          <div>
            <h2 className="text-h3 m-0 mb-1">Pay Rent</h2>
            <p className="text-muted text-sm">{invoice.invoice_number}</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-main bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Amount Section */}
        <div className="px-6 py-6 bg-slate-50 border-y flex flex-col items-center justify-center" style={{ borderColor: 'var(--color-border)' }}>
          <span className="text-sm text-muted font-medium uppercase tracking-wider mb-2">Total Due</span>
          <span className="text-5xl font-bold text-main">${amountDue.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
        </div>

        <form onSubmit={handlePay} className="p-6">
          <div className="flex flex-col gap-4">
            
            <div className="input-group">
              <label className="input-label flex justify-between">
                Card Information
                <div className="flex gap-1">
                  <div className="w-8 h-5 bg-slate-200 rounded"></div>
                  <div className="w-8 h-5 bg-slate-200 rounded"></div>
                </div>
              </label>
              <div className="relative">
                <CreditCard size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" />
                <input 
                  type="text" 
                  className="input-field pl-10" 
                  placeholder="4242 4242 4242 4242"
                  required 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="input-group">
                <label className="input-label">Expiry Date</label>
                <input type="text" className="input-field" placeholder="MM / YY" required />
              </div>
              <div className="input-group">
                <label className="input-label">CVC</label>
                <input type="text" className="input-field" placeholder="123" required />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Name on Card</label>
              <input type="text" className="input-field" placeholder="Jane Doe" required />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="btn btn-primary w-full mt-6 py-3 text-base shadow-lg shadow-primary/20"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> Processing...
              </span>
            ) : (
              `Pay $${amountDue.toLocaleString(undefined, {minimumFractionDigits: 2})}`
            )}
          </button>
          
          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted">
            <ShieldCheck size={14} className="text-success" />
            Payments are secure and encrypted
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
