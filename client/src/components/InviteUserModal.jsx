import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Link as LinkIcon, Check, Copy, X } from 'lucide-react';

const InviteUserModal = ({ isOpen, onClose, role, unitId = null, unitName = '' }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleInvite = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('hantios_token');
      const res = await axios.post('/api/invitations', {
        email,
        role,
        unit_id: unitId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setInviteLink(res.data.link);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate invitation');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setEmail('');
    setInviteLink('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            Invite {role === 'tenant' ? 'Tenant' : 'Manager'}
          </h2>
          <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {unitName && (
            <div className="mb-6 p-4 bg-primary/5 border border-primary/10 rounded-xl flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary mt-0.5">
                <Mail size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-primary-dark">Inviting to Unit {unitName}</p>
                <p className="text-xs text-primary/70 mt-1">This tenant will automatically be assigned to this unit upon accepting the invite.</p>
              </div>
            </div>
          )}

          {!inviteLink ? (
            <form onSubmit={handleInvite}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="enter.email@example.com"
                />
              </div>

              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2.5 rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>Generate Invite Link</>
                )}
              </button>
            </form>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Invitation Generated!</h3>
                <p className="text-slate-500 text-sm mt-1">
                  Copy the link below and send it to {email}
                </p>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon size={16} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  readOnly
                  value={inviteLink}
                  className="w-full pl-10 pr-24 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none"
                />
                <button
                  onClick={copyToClipboard}
                  className="absolute inset-y-1.5 right-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-sm font-medium text-slate-700 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              <button
                onClick={handleClose}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 rounded-xl transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InviteUserModal;
