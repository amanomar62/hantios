import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { Search, Send, Paperclip, MoreVertical, MessageSquare } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const CommunicationHub = () => {
  const { user } = useContext(AuthContext);
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [typedMessage, setTypedMessage] = useState('');
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem('hantios_token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchContacts = async () => {
    try {
      setLoadingContacts(true);
      const res = await axios.get('/api/auth/users', { headers });
      setContacts(res.data);
      if (res.data.length > 0) {
        setActiveContact(res.data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch contacts', err);
    } finally {
      setLoadingContacts(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get('/api/communication/messages', { headers });
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to load messages', err);
    }
  };

  useEffect(() => {
    fetchContacts();
    fetchMessages();
  }, []);

  // Poll for messages every 5 seconds for basic live chat experience
  useEffect(() => {
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto scroll to bottom when messages or active contact changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeContact]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeContact) return;

    const messageText = typedMessage;
    setTypedMessage('');

    try {
      const res = await axios.post('/api/communication/messages', {
        receiver_id: activeContact.id,
        content: messageText
      }, { headers });
      
      // Instantly append to messages state for better responsiveness
      setMessages(prev => [...prev, res.data]);
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  const activeMessages = messages.filter(m => 
    activeContact && (
      (m.sender_id === user.id && m.receiver_id === activeContact.id) ||
      (m.sender_id === activeContact.id && m.receiver_id === user.id)
    )
  );

  const filteredContacts = contacts.filter(c => 
    c.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-200" style={{ maxHeight: 'calc(100vh - 120px)' }}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-h2 m-0 mb-1">Communication Hub</h1>
          <p className="text-muted">Chat with tenants, owners, and managers</p>
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-200 h-[600px]">
        {/* Contact List */}
        <div className="w-1/3 border-r flex flex-col" style={{ borderColor: 'var(--color-border)' }}>
          <div className="p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={18} />
              <input 
                type="text" 
                className="input-field pl-10 bg-slate-50" 
                placeholder="Search contacts..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingContacts ? (
              <div className="flex justify-center items-center py-12">
                <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="text-center py-12 text-muted text-sm">
                No contacts found
              </div>
            ) : (
              filteredContacts.map(c => (
                <div 
                  key={c.id} 
                  onClick={() => setActiveContact(c)}
                  className={`p-4 flex gap-3 cursor-pointer border-b last:border-b-0 hover:bg-slate-50 transition ${activeContact?.id === c.id ? 'bg-primary-light/35 border-l-4 border-l-primary' : ''}`} 
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <div className="avatar bg-primary-light text-primary font-bold">
                    {c.full_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-semibold truncate text-slate-800">{c.full_name}</h4>
                    </div>
                    <div className="text-xs text-muted truncate capitalize">{c.role}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-50/50">
          {activeContact ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-white flex justify-between items-center" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex items-center gap-3">
                  <div className="avatar bg-primary-light text-primary font-bold">
                    {activeContact.full_name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 m-0">{activeContact.full_name}</h4>
                    <div className="text-xs text-muted capitalize">{activeContact.role}</div>
                  </div>
                </div>
                <button className="text-muted hover:text-primary transition p-2 rounded-lg hover:bg-slate-100">
                  <MoreVertical size={20} />
                </button>
              </div>

              {/* Messages Listing */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                {activeMessages.length === 0 ? (
                  <div className="text-center py-24 text-muted text-sm flex flex-col items-center justify-center gap-2">
                    <MessageSquare size={32} className="opacity-30" />
                    <span>Send a message to start a conversation with {activeContact.full_name}</span>
                  </div>
                ) : (
                  activeMessages.map(m => {
                    const isMe = m.sender_id === user.id;
                    return (
                      <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-3 rounded-2xl shadow-sm ${isMe ? 'bg-primary text-white rounded-tr-none' : 'bg-white border border-slate-200 rounded-tl-none'}`}>
                          <p className="text-sm m-0 leading-relaxed whitespace-pre-wrap">{m.content}</p>
                          <p className={`text-xs mt-1 text-right m-0 opacity-70 ${isMe ? 'text-white' : 'text-slate-500'}`}>
                            {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Area */}
              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex gap-2 items-center">
                  <button type="button" className="p-2 text-muted hover:text-primary transition rounded-full hover:bg-slate-100">
                    <Paperclip size={20} />
                  </button>
                  <input 
                    type="text" 
                    className="input-field flex-1 bg-slate-50" 
                    placeholder={`Message ${activeContact.full_name}...`}
                    value={typedMessage}
                    onChange={(e) => setTypedMessage(e.target.value)}
                  />
                  <button 
                    type="submit" 
                    disabled={!typedMessage.trim()}
                    className="btn btn-primary p-2.5 rounded-full h-10 w-10 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted">
              <MessageSquare size={48} className="opacity-20 mb-2" />
              <span>Select a contact to start messaging</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunicationHub;
