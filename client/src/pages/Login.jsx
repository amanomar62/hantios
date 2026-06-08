import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Building2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const result = await login({ email, password });
    
    if (result.success) {
      const ROLE_HOME = {
        admin: '/admin-dashboard',
        owner: '/owner-dashboard',
        manager: '/manager-dashboard',
        tenant: '/tenant-dashboard',
      };
      const redirectPath = (result.user && result.user.role && ROLE_HOME[result.user.role]) ? ROLE_HOME[result.user.role] : '/';
      navigate(redirectPath);
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: 'var(--color-bg)' }}>
      {/* Left Pane - Branding & Graphic */}
      <div style={{ 
        flex: 1, 
        position: 'relative', 
        backgroundColor: 'var(--color-primary)', 
        overflow: 'hidden', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between', 
        padding: '3rem', 
        color: '#ffffff' 
      }}>
        {/* Decorative Background Elements */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '70%', height: '70%', borderRadius: '50%', backgroundColor: 'var(--color-secondary)', opacity: 0.2, filter: 'blur(100px)' }}></div>
          <div style={{ position: 'absolute', top: '40%', right: '-20%', width: '60%', height: '60%', borderRadius: '50%', backgroundColor: '#042F2E', opacity: 0.4, filter: 'blur(80px)' }}></div>
        </div>

        <div style={{ position: 'relative', zIndex: 10, marginBottom: '2rem' }}>
          <img src="/logo-login.png" alt="HantiOS Logo" style={{ height: '140px', width: 'auto', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.25))' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 10, marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
            Property management, <br/> elevated.
          </h1>
          <p style={{ color: '#ccfbf1', fontSize: '1.125rem', maxWidth: '400px', lineHeight: 1.6 }}>
            Automate rent collection, streamline maintenance, and delight your tenants with the world's most elegant property operating system.
          </p>
        </div>

        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', padding: '1.5rem', borderRadius: '16px', maxWidth: '500px' }}>
            <p style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.9)', marginBottom: '1rem', lineHeight: 1.5 }}>"HantiOS completely transformed our portfolio operations. What used to take our team days is now automated in seconds."</p>
            <div className="flex items-center gap-3">
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.875rem', border: '1px solid rgba(255,255,255,0.3)' }}>
                JD
              </div>
              <div>
                <p className="font-semibold text-sm">Jane Doe</p>
                <p style={{ fontSize: '0.75rem', color: '#99f6e4', opacity: 0.8 }}>Director of Operations, Horizon Estates</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane - Login Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 className="text-h2 font-bold mb-2">Welcome back</h2>
            <p className="text-muted">Please enter your details to sign in.</p>
          </div>

          {error && (
            <div style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: '0.5rem', backgroundColor: 'var(--color-danger-light)', color: 'var(--color-danger)', fontSize: '0.875rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Email address</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
                  <Mail className="text-muted" size={18} />
                </div>
                <input 
                  type="email" 
                  className="input-field" 
                  style={{ paddingLeft: '2.75rem', width: '100%' }}
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
                <label className="input-label" style={{ margin: 0 }}>Password</label>
                <a href="#" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-primary)', textDecoration: 'none' }} onClick={(e) => e.preventDefault()}>Forgot password?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
                  <Lock className="text-muted" size={18} />
                </div>
                <input 
                  type="password" 
                  className="input-field" 
                  style={{ paddingLeft: '2.75rem', width: '100%' }}
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isLoading}
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.875rem' }}
            >
              {isLoading ? 'Signing in...' : (
                <>Sign in <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem', textAlign: 'center' }}>Quick Demo Login</h3>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => { setEmail('admin@hantios.com'); setPassword('password123'); }} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', textAlign: 'left', backgroundColor: 'transparent', cursor: 'pointer' }}>
                <span style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-main)' }}>Admin</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>admin@hantios.com</span>
              </button>
              <button onClick={() => { setEmail('owner@hantios.com'); setPassword('password123'); }} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', textAlign: 'left', backgroundColor: 'transparent', cursor: 'pointer' }}>
                <span style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-main)' }}>Owner</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>owner@hantios.com</span>
              </button>
              <button onClick={() => { setEmail('manager@hantios.com'); setPassword('password123'); }} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', textAlign: 'left', backgroundColor: 'transparent', cursor: 'pointer' }}>
                <span style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-main)' }}>Manager</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>manager@hantios.com</span>
              </button>
              <button onClick={() => { setEmail('tenant@hantios.com'); setPassword('password123'); }} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', textAlign: 'left', backgroundColor: 'transparent', cursor: 'pointer' }}>
                <span style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-main)' }}>Tenant</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>tenant@hantios.com</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
