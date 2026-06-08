import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, Receipt, Activity, Wrench, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import DashboardMockup from '../../components/DashboardMockup';

const Home = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="flex flex-col bg-white font-sans text-slate-800">
      
      {/* SECTION 1: HERO (Warm Editorial Minimalist Theme) */}
      <section className="hero-section">
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.12] z-0"></div>
        
        {/* Glowing Ambient Orbs */}
        <div className="glow-orb w-[500px] h-[500px] bg-editorial-accent/5 -top-20 -left-20"></div>
        <div className="glow-orb w-[600px] h-[600px] bg-editorial-teal/5 bottom-10 right-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="hero-badge">
            🚀 Enterprise Property Management
          </div>
          
          <h1 className="hero-title">
            Scale Your Real Estate Portfolio <br className="hidden md:block"/> With Absolute Control.
          </h1>
          
          <p className="hero-description">
            HantiOS provides property owners with a secure, automated platform to manage buildings, track rent collections, and orchestrate maintenance workflows.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20 font-sans">
            <Link to="/register" className="btn-primary px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2" style={{ minWidth: '220px' }}>
              Start Your Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#demo" className="bg-white hover:bg-slate-50 text-editorial-dark border border-slate-300 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-sm inline-flex items-center justify-center" style={{ minWidth: '220px' }}>
              Contact Sales
            </a>
          </div>

          {/* Crisp Light Dashboard Mockup with Premium Animated Gradient Border */}
          <div className="gradient-border-wrapper">
            <div className="gradient-border-inner">
              <div className="bg-[#FAF8F5] border-b border-slate-200/80 h-10 flex items-center px-6 gap-2 shrink-0">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <div className="ml-4 text-xs text-slate-400 font-mono">dashboard.hantios.com</div>
              </div>
              <DashboardMockup />
            </div>
          </div>
        </div>
      </section>
      {/* SECTION 2: TRUST STATS (Warm Minimalist Overlay) */}
      <section className="stats-overlap max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm py-10 px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "$20M+", label: "Rent Processed Monthly" },
              { value: "50,000+", label: "Active Tenants" },
              { value: "99.9%", label: "Platform Uptime" },
              { value: "500+", label: "Property Portfolios" }
            ].map((stat, i) => (
              <div key={i} className="p-4 border-r last:border-r-0 border-slate-200/60 md:block flex flex-col items-center">
                <div className="text-4xl md:text-5xl font-extrabold text-editorial-teal mb-2 font-serif">{stat.value}</div>
                <div className="text-slate-500 font-bold tracking-wider uppercase text-xs font-sans">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: FEATURES GRID (Warm Editorial Bento Box) */}
      <section id="features" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-3xl md:text-5xl font-extrabold text-editorial-dark mb-6 tracking-tight font-serif">Everything you need to operate at scale.</h2>
            <p className="text-lg text-slate-600 leading-relaxed font-sans">A suite of professional tools engineered specifically for large-scale property management and secure tenant operations.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 font-sans">
            {/* Card 1: Portfolio Command Center (Wide Bento Card) */}
            <div className="md:col-span-2 bg-[#FAF8F5] p-8 rounded-2xl border border-slate-200/60 shadow-sm hover-card-scale group flex flex-col sm:flex-row justify-between items-center gap-6 relative overflow-hidden">
              <div className="max-w-md">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-editorial-teal/10 border border-editorial-teal/20">
                  <Building2 className="w-6 h-6 text-editorial-teal" />
                </div>
                <h3 className="text-xl font-extrabold text-editorial-dark mb-4 font-serif">Portfolio Command Center</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  View all your buildings, apartments, and commercial units in one unified interface. Monitor occupancy rates instantly.
                </p>
              </div>
              <div className="hidden sm:flex flex-col gap-2 bg-white p-4 rounded-xl border border-slate-200/80 shrink-0 w-60 shadow-sm">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  <span>Property</span>
                  <span>Occupancy</span>
                </div>
                <div className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg border border-slate-100/80 shadow-sm">
                  <span className="text-xs font-bold text-slate-800">Mogadishu Tower</span>
                  <span className="text-[10px] font-extrabold text-editorial-teal bg-editorial-teal/10 px-2 py-0.5 rounded">95%</span>
                </div>
                <div className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg border border-slate-100/80 shadow-sm">
                  <span className="text-xs font-bold text-slate-800">Hargeisa Heights</span>
                  <span className="text-[10px] font-extrabold text-editorial-teal bg-editorial-teal/10 px-2 py-0.5 rounded">100%</span>
                </div>
                <div className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg border border-slate-100/80 shadow-sm">
                  <span className="text-xs font-bold text-slate-800">Garowe Plaza</span>
                  <span className="text-[10px] font-extrabold text-editorial-teal bg-editorial-teal/10 px-2 py-0.5 rounded">88%</span>
                </div>
              </div>
            </div>

            {/* Card 2: Automated Rent Collection */}
            <div className="bg-[#FAF8F5]/60 p-8 rounded-2xl border border-slate-200/60 shadow-sm hover-card-scale group relative overflow-hidden">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-editorial-accent/10 border border-editorial-accent/20">
                <Receipt className="w-6 h-6 text-editorial-accent" />
              </div>
              <h3 className="text-xl font-extrabold text-editorial-dark mb-4 font-serif">Automated Rent Collection</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Invoices are generated and sent automatically. Late fees are calculated instantly. Track your cash flow seamlessly.
              </p>
            </div>

            {/* Card 3: Dedicated Tenant Portals */}
            <div className="bg-[#FAF8F5]/60 p-8 rounded-2xl border border-slate-200/60 shadow-sm hover-card-scale group relative overflow-hidden">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.15)' }}>
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-extrabold text-editorial-dark mb-4 font-serif">Dedicated Tenant Portals</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Tenants receive a secure app to pay rent, view lease agreements, and submit repair requests without calling you.
              </p>
            </div>

            {/* Card 4: Live Financial Analytics (Wide Bento Card) */}
            <div className="md:col-span-2 bg-[#FAF8F5] p-8 rounded-2xl border border-slate-200/60 shadow-sm hover-card-scale group flex flex-col sm:flex-row justify-between items-center gap-6 relative overflow-hidden">
              <div className="max-w-md">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                  <Activity className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-extrabold text-editorial-dark mb-4 font-serif">Live Financial Analytics</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  Generate tax-ready financial reports, occupancy predictions, and revenue tracking with a single click.
                </p>
              </div>
              <div className="hidden sm:flex items-end justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200/80 shrink-0 w-60 h-36 shadow-sm">
                <div className="flex flex-col items-center flex-grow">
                  <div className="bg-editorial-teal w-full rounded-t transition-all duration-500" style={{ height: '40%' }}></div>
                  <span className="text-[9px] text-slate-400 font-bold mt-1.5">Apr</span>
                </div>
                <div className="flex flex-col items-center flex-grow">
                  <div className="bg-editorial-teal w-full rounded-t transition-all duration-500" style={{ height: '65%' }}></div>
                  <span className="text-[9px] text-slate-400 font-bold mt-1.5">May</span>
                </div>
                <div className="flex flex-col items-center flex-grow">
                  <div className="bg-editorial-teal w-full rounded-t transition-all duration-500" style={{ height: '90%' }}></div>
                  <span className="text-[9px] text-slate-400 font-bold mt-1.5">Jun</span>
                </div>
              </div>
            </div>

            {/* Card 5: Maintenance Workflows */}
            <div className="bg-[#FAF8F5]/60 p-8 rounded-2xl border border-slate-200/60 shadow-sm hover-card-scale group relative overflow-hidden">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
                <Wrench className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-extrabold text-editorial-dark mb-4 font-serif">Maintenance Workflows</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Streamline repairs by assigning tickets directly to contractors. Track status and costs from request to completion.
              </p>
            </div>

            {/* Card 6: Granular Permissions */}
            <div className="bg-[#FAF8F5]/60 p-8 rounded-2xl border border-slate-200/60 shadow-sm hover-card-scale group relative overflow-hidden">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.15)' }}>
                <ShieldCheck className="w-6 h-6 text-violet-650" />
              </div>
              <h3 className="text-xl font-extrabold text-editorial-dark mb-4 font-serif">Granular Permissions</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Invite managers, accountants, and staff with strict, role-based access controls to protect sensitive financial data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: HOW IT WORKS (Warm Editorial Timeline) */}
      <section className="py-32 bg-warm-cream border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-editorial-dark mb-8 tracking-tight font-serif">Setup takes minutes. <br/> The benefits last years.</h2>
              <p className="text-lg text-slate-600 mb-10 font-sans">We removed the friction from onboarding so you can start managing your properties immediately.</p>
              
              <div className="space-y-8 font-sans">
                {[
                  { step: "01", title: "Create Your Workspace", desc: "Register your company in seconds. No complicated server setups." },
                  { step: "02", title: "Import Properties", desc: "Add your buildings and units using our bulk-import tools." },
                  { step: "03", title: "Invite Your Tenants", desc: "The system automatically emails tenants their secure portal access." },
                  { step: "04", title: "Automate Everything", desc: "Sit back and monitor rent collection and maintenance from your dashboard." }
                ].map((s, i) => (
                  <div key={i} className="flex items-start gap-6">
                    <div className="text-2xl font-extrabold text-editorial-accent font-serif mt-1">{s.step}</div>
                    <div>
                      <h4 className="text-xl font-bold text-editorial-dark mb-2 font-serif">{s.title}</h4>
                      <p className="text-slate-600 text-sm">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-12 rounded-3xl border border-slate-200/60 shadow-sm">
              <div className="bg-[#FAF8F5]/80 rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden font-sans">
                <div className="p-6 border-b border-slate-200/50 bg-[#FAF8F5]">
                  <h4 className="font-bold text-editorial-dark font-serif">Tenant Invitation Overview</h4>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center p-4 border border-slate-200/60 bg-white rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-editorial-teal/10 text-editorial-teal flex items-center justify-center font-bold">AJ</div>
                      <div>
                        <div className="font-bold text-editorial-dark text-sm">Ahmed Jama</div>
                        <div className="text-xs text-slate-500">Apt 4B • City Towers</div>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-editorial-teal/10 text-editorial-teal rounded-full text-xs font-bold">Active</span>
                  </div>
                  <div className="flex justify-between items-center p-4 border border-slate-200/60 bg-white rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold">SO</div>
                      <div>
                        <div className="font-bold text-editorial-dark text-sm">Sarah Osman</div>
                        <div className="text-xs text-slate-500">Apt 5A • City Towers</div>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-editorial-accent/10 text-editorial-accent rounded-full text-xs font-bold">Pending Invite</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* SECTION 4.5: FAQ (Interactive Accordions) */}
      <section id="faq" className="py-32 bg-white border-t border-slate-200/60 font-sans">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-extrabold text-editorial-dark mb-6 tracking-tight font-serif">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-600">Got questions about HantiOS? We have answers to help you get started.</p>
          </div>
          
          <div className="space-y-4">
            {[
              {
                q: "What is HantiOS?",
                a: "HantiOS is a multi-tenant property management platform built for landlords and property owners to manage their buildings, track rent collections, and orchestrate maintenance seamlessly."
              },
              {
                q: "How does the 14-day free trial work?",
                a: "You can register and access all professional features for 14 days without inputting any credit card. We will notify you before your trial ends to choose a subscription plan."
              },
              {
                q: "Do tenants have to pay to use the portal?",
                a: "No. Tenant portals and manager accounts are completely free. Property owners only pay based on the total number of units under management."
              },
              {
                q: "Is my financial data secure?",
                a: "Yes. We employ industry-standard encryption, secure JWT authorization, and isolated database architectures to protect your financial and property data."
              },
              {
                q: "Can I manage multiple properties across different locations?",
                a: "Absolutely. HantiOS is designed from the ground up for scaling property businesses. You can manage multiple buildings, units, and portfolios from a single, unified workspace."
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-[#FAF8F5]/60 rounded-xl border border-slate-200/60 overflow-hidden transition-all duration-300">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-6 flex justify-between items-center hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-editorial-dark text-lg font-serif">{faq.q}</span>
                  <span className="text-editorial-teal font-bold text-2xl transition-transform duration-300" style={{ transform: openFaq === idx ? 'rotate(45deg)' : 'rotate(0deg)' }}>
                    +
                  </span>
                </button>
                <div
                  className="transition-all duration-300 overflow-hidden"
                  style={{
                    maxHeight: openFaq === idx ? '300px' : '0px',
                    opacity: openFaq === idx ? 1 : 0,
                  }}
                >
                  <p className="p-6 pt-0 text-slate-600 leading-relaxed border-t border-slate-200/40">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: CALL TO ACTION */}
      <section className="py-32 bg-premium-hero relative overflow-hidden font-sans border-t border-slate-800">
        <div className="absolute inset-0" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')", opacity: 0.06 }}></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tight font-serif">Ready to professionalize your operations?</h2>
          <p className="text-xl mb-12" style={{ color: '#ccfbf1' }}>Join industry-leading property owners using HantiOS today.</p>
          <Link to="/register" className="btn btn-primary px-10 py-5 rounded-xl font-bold text-xl transition-all shadow-xl gap-2 hover-card-scale">
            Start 14-Day Free Trial <ArrowRight className="w-6 h-6" />
          </Link>
          <p className="mt-6 text-sm font-semibold uppercase tracking-wider" style={{ color: '#99f6e4', opacity: 0.8 }}>No credit card required. Cancel anytime.</p>
        </div>
      </section>

    </div>
  );
};

export default Home;
