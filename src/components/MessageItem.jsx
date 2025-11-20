'use client';

import React, { useState } from 'react';
import { Copy, Check, Globe, Facebook, Twitter, Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';
import ic from '../../public/ic-shrinkk.svg';

// Custom WhatsApp Icon
const WhatsAppIcon = ({ size = 16, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 3.4L3 21" />
    <path d="M9 10a0.5 .5 0 0 0 1 0V9a0.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a0.5 .5 0 0 0 0 -1h-1a0.5 .5 0 0 0 0 1" />
  </svg>
);

export default function MessageItem({ item, isNew }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(item.shortUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Share Handlers
  const shareUrl = encodeURIComponent(item.shortUrl);
  const shareText = encodeURIComponent("Check out this link I shortened with Shrinkk!");

  const handleShare = (platform) => {
    let url = "";
    switch (platform) {
      case "whatsapp":
        url = `https://wa.me/?text=${shareText}%20${shareUrl}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`;
        break;
    }
    window.open(url, "_blank", "width=600,height=400");
  };

  return (
    <div className="mb-8 w-full max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* User Message */}
      <div className="flex justify-end mb-4">
        <div className="bg-[#1a1a1a] text-gray-200 px-5 py-3 rounded-3xl rounded-tr-sm max-w-[85%] break-all border border-gray-800">
          {item.longUrl}
        </div>
      </div>

      {/* System Response */}
      <div className="flex justify-start">
        <div className="flex gap-4 max-w-[90%] w-full">
          <Image
            src={ic}
            width={32}
            height={32}
            alt="Shrinkk Logo"
            className="flex-shrink-0 self-start mt-1" 
          />

          <div className="flex flex-col gap-2 w-full min-w-0">
            <div className="text-sm text-gray-400 font-medium">Shrinkk AI</div>

            <div className="bg-black border border-gray-800 rounded-xl p-4 w-full shadow-2xl shadow-black/50">
              {/* Header */}
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 overflow-hidden">
                  <Globe size={14} className="text-gray-500 flex-shrink-0" />
                  <span className="text-xs text-gray-500 truncate uppercase tracking-wider font-semibold">Generated Link</span>
                </div>
                {isNew && <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20 flex-shrink-0">New</span>}
              </div>

              {/* Display Input Metadata (Domain/Alias) if used */}
              {(item.customDomain || item.customAlias) && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {item.customDomain && (
                    <div className="flex items-center gap-1 text-[10px] bg-[#1a1a1a] text-gray-400 px-2 py-1 rounded border border-gray-800 max-w-full">
                      <Globe size={10} className="flex-shrink-0" />
                      <span className="truncate">{item.customDomain}</span>
                    </div>
                  )}
                  {item.customAlias && (
                    <div className="flex items-center gap-1 text-[10px] bg-[#1a1a1a] text-gray-400 px-2 py-1 rounded border border-gray-800 max-w-full">
                      <LinkIcon size={10} className="flex-shrink-0" />
                      <span className="truncate">/{item.customAlias}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Link Box - FIXED LAYOUT HERE */}
              <div className="flex items-center bg-[#111] rounded-lg border border-gray-800 group hover:border-gray-700 transition-colors mb-4 w-full overflow-hidden">
                <a 
                  href={item.shortUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex-1 text-indigo-400 hover:text-indigo-300 font-mono text-sm truncate py-3 pl-4 min-w-0"
                >
                  {item.shortUrl}
                </a>
                <div className="border-l border-gray-800 h-full flex items-center">
                   <button 
                    onClick={copyToClipboard} 
                    className="p-3 hover:bg-gray-800 text-gray-400 hover:text-white transition-all h-full flex items-center justify-center" 
                    title="Copy to clipboard"
                  >
                    {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              {/* Social Share Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleShare("whatsapp")}
                  className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:opacity-90 transition-opacity hover:scale-110 duration-200"
                  title="Share on WhatsApp"
                >
                  <WhatsAppIcon size={16} />
                </button>

                <button
                  onClick={() => handleShare("facebook")}
                  className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 transition-opacity hover:scale-110 duration-200"
                  title="Share on Facebook"
                >
                  <Facebook size={16} fill="currentColor" strokeWidth={0} />
                </button>

                <button
                  onClick={() => handleShare("twitter")}
                  className="w-8 h-8 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center hover:opacity-90 transition-opacity hover:scale-110 duration-200"
                  title="Share on Twitter"
                >
                  <Twitter size={16} fill="currentColor" strokeWidth={0} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}