'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Loader2, Sparkles, Scissors, Settings2, Globe, Link as LinkIcon } from 'lucide-react';
import MessageItem from './MessageItem';
import { shortenUrl } from '@/services/api'; 

export default function ChatInterface() {
  const [inputUrl, setInputUrl] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleShorten = async (e) => {
    e.preventDefault();
    if (!inputUrl.trim() || loading) return;

    let urlToShorten = inputUrl.trim();
    if (!/^https?:\/\//i.test(urlToShorten)) {
      urlToShorten = 'https://' + urlToShorten;
    }

    setLoading(true);

    try {
      // Call the API Service with custom options
      const shortUrl = await shortenUrl(urlToShorten, customDomain, customAlias);

      const newMessage = {
        id: Date.now(),
        longUrl: urlToShorten,
        shortUrl: shortUrl,
        // --- NEW: Save the inputs used for this link ---
        customDomain: customDomain,
        customAlias: customAlias,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, newMessage]);
      setInputUrl('');
      setCustomAlias('');
      // We keep the domain as user might want to reuse it, but we hide the menu to keep UI clean
      setShowOptions(false); 
    } catch (err) {
      alert("Failed to shorten URL. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-gray-100 font-sans overflow-hidden selection:bg-indigo-500/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-14 flex items-center justify-between px-6 bg-black/80 backdrop-blur-md z-10 border-b border-white/5">
        <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity cursor-default">
          <Scissors size={18} className="text-gray-400" />
          <span className="font-bold tracking-tight text-sm">Shrinkk</span>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto pt-20 pb-40 px-4 scrollbar-hide">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center -mt-20 animate-in fade-in zoom-in duration-700">
            <h1 className="text-7xl md:text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 select-none">
              Shrinkk
            </h1>
            <p className="text-gray-500 text-lg font-medium tracking-wide mt-6">
              Paste a long URL to get started
            </p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <MessageItem key={msg.id} item={msg} isNew={idx === messages.length - 1} />
        ))}
        <div ref={bottomRef} />
      </main>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-black via-black to-transparent z-20">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleShorten} className="relative group">
            
             {/* Advanced Options Panel (Slide Up) */}
             {showOptions && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 animate-in slide-in-from-bottom-2 fade-in duration-200 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1.5 ml-1">
                      <Globe size={12} /> Custom Domain
                    </label>
                    <input 
                      type="text" 
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                      placeholder="e.g. my.link"
                      className="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 placeholder:text-gray-700 focus:outline-none focus:border-indigo-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1.5 ml-1">
                      <LinkIcon size={12} /> Custom Alias
                    </label>
                    <div className="flex items-center">
                      <span className="text-gray-600 text-sm mr-1">/</span>
                      <input 
                        type="text" 
                        value={customAlias}
                        onChange={(e) => setCustomAlias(e.target.value)}
                        placeholder="e.g. summer-sale"
                        className="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 placeholder:text-gray-700 focus:outline-none focus:border-indigo-500/50 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Main Input Bar */}
             <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-[#111] border border-gray-800 group-focus-within:border-gray-600 rounded-2xl shadow-2xl flex items-center p-2 transition-all duration-300">
              
              <button
                type="button"
                onClick={() => setShowOptions(!showOptions)}
                className={`p-2 rounded-xl transition-colors mr-1 ${showOptions ? 'bg-gray-800 text-indigo-400' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900'}`}
                title="Advanced Options"
              >
                <Settings2 size={20} />
              </button>

              <div className="text-gray-500 group-focus-within:text-gray-300 transition-colors px-2">
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
              </div>
              
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Paste a URL to shorten..."
                className="w-full bg-transparent border-none text-white text-lg placeholder:text-gray-600 px-2 py-3 focus:ring-0 focus:outline-none"
                disabled={loading}
                autoFocus
              />
              
              <button
                type="submit"
                disabled={!inputUrl || loading}
                className={`p-2 rounded-xl transition-all duration-300 flex items-center justify-center ${inputUrl ? 'bg-white text-black shadow-lg shadow-white/10' : 'bg-gray-900 text-gray-600'}`}
              >
                <ArrowUp size={20} strokeWidth={3} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}