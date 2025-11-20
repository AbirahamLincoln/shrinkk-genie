'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Loader2, Sparkles, Scissors, Settings2, Globe, Link as LinkIcon, Plus, AlertCircle } from 'lucide-react';
import MessageItem from './MessageItem';
import { shortenUrl } from '@/services/api'; 
import logo from '../../public/logo.png';
import Image from 'next/image';
export default function ChatInterface() {
  const [inputUrl, setInputUrl] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(''); 

  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputUrl]);

  const handleNewChat = () => {
    setMessages([]);
    setInputUrl('');
    setCustomDomain('');
    setCustomAlias('');
    setError('');
    setShowOptions(false);
  };

  const handleShorten = async (e) => {
    e.preventDefault();
    if (!inputUrl.trim() || loading) return;
    setError(''); 

    const rawUrls = inputUrl.split(/[\n, ]+/).map(u => u.trim()).filter(u => u.length > 0);
    
    if (rawUrls.length === 0) return;

    const processedUrls = rawUrls.map(url => {
      if (!/^https?:\/\//i.test(url)) return 'https://' + url;
      return url;
    });

    const isBulk = processedUrls.length > 1;

    if (isBulk && customAlias) {
      setError("Custom aliases cannot be used when shortening multiple URLs.");
      return;
    }

    setLoading(true);

    try {
      const result = await shortenUrl(
        isBulk ? processedUrls : processedUrls[0], 
        customDomain, 
        customAlias
      );

      const newMessages = [];
      const now = new Date();

      if (isBulk) {
        result.forEach(item => {
          newMessages.push({
            id: Date.now() + Math.random(),
            longUrl: item.longUrl,
            shortUrl: item.shortUrl,
            customDomain: customDomain,
            customAlias: null,
            createdAt: now,
          });
        });
      } else {
        newMessages.push({
          id: Date.now(),
          longUrl: processedUrls[0],
          shortUrl: result.shortUrl,
          customDomain: customDomain,
          customAlias: customAlias,
          createdAt: now,
        });
      }

      setMessages((prev) => [...prev, ...newMessages]);
      setInputUrl('');
      setCustomAlias('');
      setShowOptions(false); 
      
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }

    } catch (err) {
      let msg = "An unexpected error occurred.";
      if (typeof err === 'string') {
          msg = err;
      } else if (err instanceof Error) {
          msg = err.message;
      } else if (err && typeof err === 'object' && err.message) {
          msg = String(err.message);
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleShorten(e);
    }
  };

  // Helper to determine if we have an alias error
  const isAliasError = error && error.toLowerCase().includes('alias');

  return (
    <div className="flex flex-col h-screen bg-black text-gray-100 font-sans overflow-hidden selection:bg-indigo-500/30">
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-14 flex items-center justify-between px-6 bg-black/80 backdrop-blur-md z-10 border-b border-white/5">
        <div 
          onClick={handleNewChat} 
          className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
          title="Reset / New Chat"
        >
          <Scissors size={18} className="text-gray-400" />
          <span className="font-bold tracking-tight text-sm">Shrinkk</span>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className={`flex-1 overflow-y-auto pt-20 pb-40 px-4 scrollbar-hide bg-black 
                      ${messages.length === 0 ? "bg-[url('/hero-background.png')] bg-no-repeat bg-center" : ""}
                      ${messages.length === 0 ? "bg-[length:800px_auto] md:bg-[length:1000px_auto]" : ""} 
                      transition-all duration-500`}
      > 
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center animate-in fade-in zoom-in duration-700 pb-[60px]">
            <Image
                  src={logo}
                  width={700}
                  height={200}
                  alt="scissor Logo"
                  className="flex-shrink-0" 
                />
             <p className="text-gray-400 text-lg font-medium tracking-wide mt-4 text-center px-4 opacity-80">
              Type or Paste one or more URLs to shorten
            </p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <MessageItem key={msg.id} item={msg} isNew={idx >= messages.length - (Array.isArray(msg) ? msg.length : 1)} />
        ))}
        <div ref={bottomRef} />
      </main>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-black via-black to-transparent z-20">
        <div className="max-w-3xl mx-auto">
          
          <form onSubmit={handleShorten} className="relative group">
            
             {/* Advanced Options Panel */}
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
                    <div className="relative flex items-center">
                      <span className="text-gray-600 text-sm mr-1">/</span>
                      <input 
                        type="text" 
                        value={customAlias}
                        onChange={(e) => {
                          setCustomAlias(e.target.value);
                          setError(''); 
                        }}
                        placeholder="Single URL only"
                        className={`w-full bg-black/50 border rounded-lg px-3 py-2 text-sm text-gray-300 placeholder:text-gray-700 focus:outline-none transition-colors ${
                          isAliasError 
                            ? 'border-red-500/50 focus:border-red-500 text-red-200 pr-24'
                            : 'border-gray-800 focus:border-indigo-500/50'
                        }`}
                      />
                      
                      {/* Inline Error Message */}
                      {isAliasError && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-red-500 font-bold animate-pulse pointer-events-none">
                          Already exists
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Main Input Bar */}
             <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className={`relative bg-[#111] border group-focus-within:border-gray-600 rounded-2xl shadow-2xl flex items-center p-2 gap-1 transition-all duration-300 ${error && !isAliasError ? 'border-red-900/80 shadow-red-900/20' : 'border-gray-800'}`}>
              
              {/* New Chat Button */}
              <button
                type="button"
                onClick={handleNewChat}
                className="p-2 rounded-xl transition-colors text-gray-500 hover:text-white hover:bg-gray-900"
                title="New Chat"
              >
                <Plus size={20} />
              </button>

              {/* Settings Button */}
              <button
                type="button"
                onClick={() => setShowOptions(!showOptions)}
                className={`p-2 rounded-xl transition-colors ${showOptions ? 'bg-gray-800 text-indigo-400' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900'}`}
                title="Advanced Options"
              >
                <Settings2 size={20} />
              </button>

              <div className="text-gray-500 group-focus-within:text-gray-300 transition-colors pl-1">
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
              </div>
              
              <textarea
                ref={textareaRef}
                value={inputUrl}
                onChange={(e) => {
                  setInputUrl(e.target.value);
                  if (!isAliasError) setError(''); 
                }}
                onKeyDown={handleKeyDown}
                placeholder={error && !isAliasError ? error : "Type or Paste URLs (one per line)..."} 
                className={`w-full bg-transparent border-none text-white text-sm sm:text-lg placeholder:text-gray-600 px-3 py-2 focus:ring-0 focus:outline-none resize-none max-h-48 scrollbar-hide placeholder:whitespace-nowrap placeholder:text-[11px] sm:placeholder:text-base ${error && !isAliasError ? 'placeholder:text-red-400 text-red-200' : ''}`}
                rows={1}
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