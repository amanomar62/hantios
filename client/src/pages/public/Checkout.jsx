import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ShieldCheck, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const Checkout = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('growth');
  const [paymentMethod, setPaymentMethod] = useState('evc_plus');
  const [loading, setLoading] = useState(false);

  const plans = [
    { id: 'starter', name: "STARTER", price: "$15/mo", limit: "20 Units" },
    { id: 'growth', name: "GROWTH", price: "$49/mo", limit: "100 Units" },
    { id: 'professional', name: "PROFESSIONAL", price: "$99/mo", limit: "500 Units" }
  ];

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // Get token from cookie manually or assume fetch sends it
      const response = await fetch('http://localhost:5000/api/subscriptions/checkout', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)hantios_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}`
        },
        body: JSON.stringify({ plan: selectedPlan, payment_method: paymentMethod })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Checkout failed');

      toast.success('Subscription activated! Redirecting to your dashboard...');
      setTimeout(() => navigate('/owner-dashboard'), 1500);
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-cream py-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-editorial-dark mb-4 font-serif">Choose Your Subscription Tier</h1>
          <p className="text-slate-600 max-w-xl mx-auto">Your 14-day free trial is active. Select a plan to continue seamlessly after the trial.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left Side - Custom Plan Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-editorial-dark mb-6 font-serif">Select Subscription Tier</h3>
            <div className="space-y-4">
              {plans.map(plan => (
                <button 
                  key={plan.id} 
                  type="button"
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full text-left relative p-5 rounded-2xl border-2 transition-all flex items-center justify-between ${selectedPlan === plan.id ? 'border-editorial-teal bg-white shadow-md' : 'border-slate-200 bg-white/80 hover:border-slate-300 shadow-sm'}`}
                >
                  <div className="flex items-center gap-4">
                    {/* Custom Radio Circle */}
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedPlan === plan.id ? 'border-editorial-teal' : 'border-slate-300'}`}>
                      {selectedPlan === plan.id && <div className="w-2.5 h-2.5 rounded-full bg-editorial-teal"></div>}
                    </div>
                    <div>
                      <div className="font-extrabold text-editorial-dark text-base">{plan.name}</div>
                      <div className="text-xs text-editorial-teal font-semibold bg-editorial-teal/10 px-2.5 py-0.5 rounded-md mt-1.5 w-fit">Up to {plan.limit}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-extrabold text-editorial-dark font-serif">{plan.price.split('/')[0]}</div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">per month</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Side - Custom Payment Details */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md">
            <h3 className="text-lg font-bold text-editorial-dark mb-6 flex items-center gap-2 font-serif">
              <ShieldCheck className="w-5 h-5 text-editorial-teal" /> Secure Checkout
            </h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-3">Payment Method</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'evc_plus', label: 'EVC Plus', desc: 'Hormuud Mobile' },
                  { id: 'sahal', label: 'Sahal', desc: 'Somtel Mobile' },
                  { id: 'zaad', label: 'Zaad', desc: 'Telesom Mobile' },
                  { id: 'stripe', label: 'Credit Card', desc: 'Visa / Mastercard' }
                ].map(method => (
                  <button 
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-3.5 rounded-xl border-2 text-left transition-all flex flex-col justify-between ${paymentMethod === method.id ? 'border-editorial-teal bg-editorial-teal/5 text-editorial-teal' : 'border-slate-200 text-slate-700 bg-white hover:border-slate-300'}`}
                  >
                    <span className="font-bold text-sm">{method.label}</span>
                    <span className="text-[9px] text-slate-400 mt-1 font-medium">{method.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {(paymentMethod === 'evc_plus' || paymentMethod === 'sahal' || paymentMethod === 'zaad') ? (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Mobile Number</label>
                <input 
                  type="text" 
                  placeholder="+252 61 XXX XXXX" 
                  className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-editorial-teal focus:border-editorial-teal outline-none transition-all shadow-sm" 
                />
                <p className="text-xs text-slate-500 mt-2">A prompt will be sent to your phone to approve the transaction.</p>
              </div>
            ) : (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Card Details</label>
                <div className="h-12 border border-slate-200 rounded-xl bg-slate-50 flex items-center px-4 text-slate-400 text-xs font-medium">
                  Stripe Card Element (Card Number, Expiry, CVC)
                </div>
              </div>
            )}

            <div className="border-t border-slate-100 pt-6 mb-6 space-y-3 font-sans">
              <div className="flex justify-between text-slate-600 text-sm">
                <span>Subtotal</span>
                <span>{plans.find(p => p.id === selectedPlan)?.price.split('/')[0]}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-editorial-dark">
                <span>Total due today</span>
                <span>$0.00</span>
              </div>
              <p className="text-[10px] text-slate-500 text-center leading-relaxed">Your card/phone will not be charged until the 14-day trial ends.</p>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-editorial-teal hover:bg-editorial-dark text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Start Subscription'} <ArrowRight className="w-5 h-5" />
            </button>
            <div className="mt-4 text-center">
              <button 
                type="button"
                onClick={() => navigate('/owner-dashboard')} 
                className="text-editorial-teal font-bold text-sm hover:text-editorial-dark hover:underline transition-colors"
              >
                Skip for now, go to dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
