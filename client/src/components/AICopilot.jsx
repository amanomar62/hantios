import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MessageSquare, X, Send, AlertTriangle, Sparkles, Building2, Home, FileText, ArrowRight, Bot } from 'lucide-react';

const AICopilot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am your HantiOS AI Copilot. Ask me about your property data, like "Show vacant units", "What is my overdue rent?", or "Check open maintenance requests".'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isOpen]);

  const sendQuery = async (textToSend) => {
    if (!textToSend.trim()) return;

    // Append user message
    setChatHistory(prev => [...prev, { sender: 'user', text: textToSend }]);
    setLoading(true);

    try {
      const token = localStorage.getItem('hantios_token');
      const res = await axios.post('/api/ai/query', { query: textToSend }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { intent, message, data } = res.data;
      
      let botResponse = {
        sender: 'bot',
        text: message,
        intent: intent,
        data: data
      };

      setChatHistory(prev => [...prev, botResponse]);
    } catch (err) {
      console.error('AI copilot error', err);
      setChatHistory(prev => [...prev, { 
        sender: 'bot', 
        text: 'Sorry, I encountered an error communicating with the AI service. Please make sure the backend is active.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    const text = query;
    setQuery('');
    sendQuery(text);
  };

  const renderDataResults = (intent, data) => {
    if (!data || data.length === 0) return null;

    if (intent === 'fetch_vacant_units') {
      return (
        <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-slate-100 w-full">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Vacant Units List</p>
          {data.map(unit => (
            <div key={unit.id} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-2">
                <Home size={14} className="text-primary" />
                <span className="text-sm font-semibold text-slate-800">Unit {unit.unit_number}</span>
                <span className="text-xs text-muted">Floor {unit.floor}</span>
              </div>
              <span className="text-sm font-bold text-slate-700">${unit.monthly_rent}/mo</span>
            </div>
          ))}
        </div>
      );
    }

    if (intent === 'fetch_overdue_invoices') {
      return (
        <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-slate-100 w-full">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overdue Invoices List</p>
          {data.map(invoice => (
            <div key={invoice.id} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-danger" />
                <span className="text-sm font-semibold text-slate-800">{invoice.invoice_number}</span>
                <span className="text-xs text-muted">Due {new Date(invoice.due_date).toLocaleDateString()}</span>
              </div>
              <span className="text-sm font-bold text-danger">${invoice.amount}</span>
            </div>
          ))}
        </div>
      );
    }

    if (intent === 'fetch_open_maintenance') {
      return (
        <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-slate-100 w-full">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Open Maintenance Tickets</p>
          {data.map(t => (
            <div key={t.id} className="flex flex-col gap-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-800 truncate pr-2">{t.title}</span>
                <span className={`badge text-[10px] py-0.5 px-1.5 ${t.priority === 'high' ? 'badge-danger' : 'badge-warning'}`}>
                  {t.priority.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-muted truncate m-0">{t.description}</p>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  const quickPrompts = [
    "Show vacant units",
    "What is my overdue rent?",
    "Open maintenance requests"
  ];

  return (
    <div className="fixed z-50 flex flex-col items-end" style={{ bottom: '4.5rem', right: '2rem' }}>
      {/* Expanded panel */}
      {isOpen && (
        <div className="bg-white rounded-2xl w-[380px] h-[500px] shadow-2xl border border-slate-200 overflow-hidden flex flex-col mb-4 animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="bg-primary p-4 text-white flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-2">
              <Bot size={18} className="text-secondary animate-pulse" />
              <h3 className="font-bold text-base m-0 text-white">HantiOS AI Copilot</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            {chatHistory.map((chat, idx) => {
              const isMe = chat.sender === 'user';
              return (
                <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl shadow-sm ${isMe ? 'bg-primary text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none'}`}>
                    <p className="text-sm m-0 leading-relaxed whitespace-pre-wrap">{chat.text}</p>
                    {renderDataResults(chat.intent, chat.data)}
                  </div>
                </div>
              );
            })}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1.5 items-center">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex gap-2 overflow-x-auto whitespace-nowrap">
            {quickPrompts.map((p, idx) => (
              <button 
                key={idx}
                onClick={() => sendQuery(p)}
                disabled={loading}
                className="text-xs bg-white border border-slate-200 hover:border-primary hover:text-primary rounded-full px-3 py-1.5 font-medium transition-all shadow-sm shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Form Input */}
          <form onSubmit={handleFormSubmit} className="p-3 bg-white border-t border-slate-100 flex gap-2 items-center">
            <input
              type="text"
              className="input-field flex-1 bg-slate-50"
              placeholder="Ask Copilot..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
            />
            <button 
              type="submit"
              disabled={loading || !query.trim()}
              className="btn btn-primary p-2.5 rounded-full h-10 w-10 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Button Bubble */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="copilot-btn z-50"
        title="AI Copilot Assistant"
      >
        {isOpen ? <X size={28} className="copilot-icon" /> : <Bot size={28} className="copilot-icon" />}
      </button>
    </div>
  );
};

export default AICopilot;
