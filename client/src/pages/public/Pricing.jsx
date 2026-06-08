import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: "STARTER",
      price: "$15",
      limit: "Up to 20 Units",
      desc: "Perfect for independent landlords starting out.",
      features: ["Tenant Management", "Rent Tracking", "Property Dashboard", "Basic Reports"],
      highlighted: false
    },
    {
      name: "GROWTH",
      price: "$49",
      limit: "Up to 100 Units",
      desc: "For growing portfolios needing automation.",
      features: ["Everything in Starter", "Maintenance Marketplace", "Advanced Reports", "Tenant Portal", "SMS Notifications"],
      highlighted: true,
      badge: "Most Popular"
    },
    {
      name: "PROFESSIONAL",
      price: "$99",
      limit: "Up to 500 Units",
      desc: "Advanced tools for scaling property businesses.",
      features: ["Everything in Growth", "Multiple Managers", "Portfolio Analytics", "Priority Support", "Advanced Permissions"],
      highlighted: false
    },
    {
      name: "ENTERPRISE",
      price: "Custom",
      limit: "Unlimited Units",
      desc: "Tailored solutions for massive operations.",
      features: ["Everything in Professional", "White Label", "Dedicated Support", "Custom Integrations", "SLA Guarantee"],
      highlighted: false
    }
  ];

  return (
    <div className="bg-warm-cream py-32 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-5xl font-extrabold text-editorial-dark mb-6 tracking-tight font-serif">Predictable pricing for professionals.</h1>
          <p className="text-xl text-slate-600">Start with a 14-day free trial on any plan. No hidden fees. Upgrade as your portfolio grows.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {plans.map((plan, i) => (
            <div key={i} className={`rounded-2xl border ${plan.highlighted ? 'border-editorial-teal bg-white shadow-xl relative transform md:-translate-y-4' : 'border-slate-200 bg-white shadow-sm'} p-8 flex flex-col`}>
              {plan.badge && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-editorial-teal text-white text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full">
                  {plan.badge}
                </div>
              )}
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2 font-sans">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-2 font-sans">
                <span className="text-4xl md:text-5xl font-extrabold text-editorial-dark font-serif">{plan.price}</span>
                {plan.price !== 'Custom' && <span className="text-slate-500 font-bold">/month</span>}
              </div>
              <div className="text-editorial-teal font-bold mb-4 bg-editorial-teal/10 inline-block px-3 py-1 rounded-md text-sm w-fit">{plan.limit}</div>
              <p className="text-slate-650 text-sm mb-8 flex-grow">{plan.desc}</p>
              
              <ul className="space-y-4 mb-10">
                {plan.features.map((feat, j) => (
                  <li key={j} className="flex items-start gap-3 text-slate-700 text-sm font-medium">
                    <Check className="w-5 h-5 text-editorial-teal shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <Link to="/register" className={`w-full py-4 px-4 rounded-xl font-bold text-center transition-all ${plan.highlighted ? 'bg-editorial-teal hover:bg-editorial-dark text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}`}>
                {plan.price === 'Custom' ? 'Contact Sales' : 'Start Free Trial'}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
