import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Building2, User, Mail, Phone, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    full_name: '',
    company_name: '',
    email: '',
    phone: '',
    password: '',
    role: 'owner'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.errors?.[0]?.msg || 'Registration failed');
      }

      // Automatically log them in
      const loginResult = await login({ email: formData.email, password: formData.password });
      
      if (loginResult.success) {
        toast.success('Workspace created! Welcome to HantiOS.');
        navigate('/checkout'); // Redirect to plan selection / checkout
      } else {
        toast.error('Workspace created, but automatic login failed. Redirecting to sign in page...');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Pane - Branding */}
      <div className="hidden lg:flex flex-1 flex-col justify-between bg-teal-900 text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900 to-teal-800 z-0"></div>
        <div className="absolute -top-[30%] -left-[10%] w-[80%] h-[80%] rounded-full bg-teal-600 opacity-20 blur-[100px] z-0"></div>
        
        <div className="relative z-10">
          <Link to="/" className="flex items-center mb-16">
            <img src="/logo-login.png" alt="HantiOS" style={{ height: '120px', width: 'auto', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.25))' }} />
          </Link>
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
            Start your 14-day free trial.
          </h1>
          <p className="text-teal-100 text-lg mb-8 max-w-md">
            Join hundreds of property owners managing their portfolios with zero friction.
          </p>
          
          <ul className="space-y-5">
            {[
              "Instant workspace creation",
              "Unlimited properties & tenants during trial",
              "Free tenant portals",
              "No credit card required"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-teal-50 text-lg">
                <CheckCircle2 className="w-6 h-6 text-amber-400" /> {item}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="relative z-10 bg-white/10 border border-white/20 p-6 rounded-2xl backdrop-blur-sm max-w-md">
          <div className="flex gap-4 items-center mb-4">
            <div className="w-12 h-12 bg-teal-700 rounded-full flex items-center justify-center font-bold text-xl">
              AH
            </div>
            <div>
              <div className="font-bold">Ali Hassan</div>
              <div className="text-teal-200 text-sm">Owner, City Apartments</div>
            </div>
          </div>
          <p className="text-teal-50 italic">
            "We were operational in 10 minutes. The onboarding is incredibly smooth and the dashboard gives me total control."
          </p>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-24 relative">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Create your workspace</h2>
            <p className="text-slate-600">Enter your details to get started.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    name="full_name"
                    required
                    value={formData.full_name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all shadow-sm"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Company Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all shadow-sm"
                    placeholder="JD Estates (Optional)"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all shadow-sm"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="h-5 w-5" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all shadow-sm"
                  placeholder="+252 61 XXX XXXX"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  minLength="6"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all shadow-sm"
                  placeholder="••••••••"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">Must be at least 6 characters long.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {loading ? 'Creating workspace...' : 'Start Free Trial'}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-600">
            Already have an account? <Link to="/login" className="text-teal-600 font-bold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
