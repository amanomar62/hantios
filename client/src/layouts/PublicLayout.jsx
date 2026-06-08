import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Twitter, Linkedin, Github, Globe } from 'lucide-react';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-warm-cream flex flex-col font-sans text-slate-800">
      <header className="fixed w-full top-0 z-50 border-b border-slate-200/80 transition-all shadow-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img src="/logo.png" alt="HantiOS" className="w-auto drop-shadow-sm" style={{ height: '76px', objectFit: 'contain' }} />
              </Link>
            </div>
            <nav className="hidden md:flex gap-10">
              <a href="#features" className="text-slate-600 hover:text-editorial-teal font-semibold transition-colors">Features</a>
              <Link to="/pricing" className="text-slate-600 hover:text-editorial-teal font-semibold transition-colors">Pricing</Link>
              <a href="#faq" className="text-slate-600 hover:text-editorial-teal font-semibold transition-colors">FAQ</a>
            </nav>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-slate-600 hover:text-editorial-teal font-semibold transition-colors">Log in</Link>
              <Link to="/register" className="btn-primary px-6 py-2.5 rounded-lg font-bold transition-all shadow-sm hover:shadow-md">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-20 bg-white">
        <Outlet />
      </main>

      <footer style={{ backgroundColor: '#030f0d' }} className="text-slate-300 py-24 mt-auto relative overflow-hidden z-10">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 w-[350px] h-[350px] bg-editorial-accent/5 rounded-full filter blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-editorial-teal/10 rounded-full filter blur-[100px] pointer-events-none"></div>

        {/* Elegant top line separator */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mb-16" />
          
          <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-8 relative z-10">
            
            {/* Logo, About & Socials */}
            <div className="flex flex-col max-w-sm">
              <Link to="/" className="inline-flex items-center mb-6 max-w-max">
                <div className="footer-brand-capsule">
                  <img src="/logo-login.png" alt="HantiOS" className="w-auto block" style={{ height: '96px', objectFit: 'contain' }} />
                </div>
              </Link>
              <p className="text-sm text-slate-400 leading-relaxed font-sans mt-2 mb-8">
                Premium SaaS property management engineered for scale, automation, and absolute financial control. Built for modern portfolios.
              </p>
              
              {/* Dynamic Social Badges */}
              <div className="flex gap-3">
                <a href="#" className="social-badge" aria-label="Twitter">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="social-badge" aria-label="LinkedIn">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="social-badge" aria-label="Github">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="social-badge" aria-label="Website">
                  <Globe className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            {/* Links Columns & Newsletter */}
            <div className="flex flex-wrap md:flex-nowrap gap-12 lg:gap-20">
              {/* Links Group 1 */}
              <div className="flex flex-col min-w-[140px]">
                <h4 className="text-white font-bold mb-6 font-sans text-base tracking-wide uppercase">Product</h4>
                <ul className="space-y-4 font-medium">
                  <li><Link to="/" className="footer-link">Features</Link></li>
                  <li><Link to="/pricing" className="footer-link">Pricing</Link></li>
                  <li><Link to="/register" className="footer-link">Start Free Trial</Link></li>
                </ul>
              </div>

              {/* Links Group 2 */}
              <div className="flex flex-col min-w-[140px]">
                <h4 className="text-white font-bold mb-6 font-sans text-base tracking-wide uppercase">Company</h4>
                <ul className="space-y-4 font-medium">
                  <li><a href="#" className="footer-link">About Us</a></li>
                  <li><a href="#" className="footer-link">Contact Sales</a></li>
                  <li><a href="#" className="footer-link">Careers</a></li>
                </ul>
              </div>

              {/* Newsletter inside frosted card */}
              <div className="flex flex-col max-w-sm w-full">
                <div className="glass-newsletter-card">
                  <h4 className="text-white font-bold mb-3 font-sans text-lg">Stay Updated</h4>
                  <p className="text-sm text-slate-400 mb-5 leading-relaxed font-sans">
                    Subscribe to our newsletter for SaaS updates and real estate insights.
                  </p>
                  <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                    <input 
                      type="email" 
                      placeholder="Email address" 
                      className="px-4 py-3 border border-white/10 rounded-xl text-sm bg-white/5 focus:outline-none focus:bg-white/10 text-white w-full transition-all"
                      style={{ color: 'white' }}
                      required 
                    />
                    <button type="submit" className="btn-primary w-full py-3 rounded-xl text-sm font-bold transition-all shadow-lg">
                      Subscribe
                    </button>
                  </form>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Copyright bar */}
          <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-500 font-medium">
            <div>
              &copy; {new Date().getFullYear()} HantiOS Inc. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
