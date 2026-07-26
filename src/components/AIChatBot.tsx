/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Sparkles, Send, X, Bot, User, Loader2, ArrowRight } from "lucide-react";

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export const AIChatBot: React.FC = () => {
  const { showAIChat, setShowAIChat } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      text: "Namaste, darling! Welcome to Blousia® Studio. I am your personal luxury fashion stylist and draping curator. I am here to help you select the most exquisite necklines, pair fabrics like Banarasi Silk or organic Kalamkari, and customize your measurements to drape you in ultimate confidence. How can I assist you with your styling selections today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showAIChat]);

  const handleSendMessage = async (textToSend?: string) => {
    const userText = textToSend || input;
    if (!userText.trim()) return;

    if (!textToSend) setInput("");

    // Append user message
    const updatedMsgs = [...messages, { role: "user" as const, text: userText }];
    setMessages(updatedMsgs);
    setLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: updatedMsgs.slice(1, -1), // skip initial bot greeting and current user input
        }),
      });

      const data = await response.json();
      if (data.text) {
        setMessages((prev) => [...prev, { role: "model" as const, text: data.text }]);
      } else {
        throw new Error(data.error || "Failed to parse AI response.");
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "Forgive me, darling. My digital design sketchbook seems to have a crease. Please check your connections or secrets in AI Studio, and let us try matching that draping pattern once again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const presetQuestions = [
    "Neckline recommendation for heavy Kanjeevaram Saree",
    "How does the inner alteration margin work?",
    "Which blouses are padded or removable?",
    "Occasion pairing for an evening corporate cocktail",
  ];

  if (!showAIChat) return null;

  return (
    <div className="fixed right-4 bottom-24 z-50 flex h-[600px] w-full max-w-[380px] flex-col rounded-3xl border border-gold-200 bg-white shadow-2xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 animate-slideUp">
      {/* Header Panel */}
      <div className="flex items-center justify-between border-b border-gold-100 bg-rose-luxury px-4 py-4 rounded-t-3xl text-white">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
            <Sparkles size={18} className="text-gold-200 animate-pulse" />
          </div>
          <div>
            <h3 className="font-serif text-sm font-bold tracking-wide uppercase">Blousia® AI Stylist</h3>
            <span className="text-[9px] text-gray-200 tracking-wider">Designed to Drape Confidence</span>
          </div>
        </div>
        <button
          onClick={() => setShowAIChat(false)}
          className="rounded-full bg-white/15 p-1.5 text-white hover:bg-white/20"
        >
          <X size={16} />
        </button>
      </div>

      {/* Messages Stage */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs ${
              msg.role === "user" ? "bg-gold-400 text-white" : "bg-rose-luxury/10 text-rose-luxury"
            }`}>
              {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
            </div>
            
            <div className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed max-w-[80%] ${
              msg.role === "user"
                ? "bg-gold-400 text-white rounded-tr-none"
                : "bg-gray-100 text-gray-800 dark:bg-slate-900 dark:text-gray-100 rounded-tl-none font-medium"
            }`}>
              <p className="whitespace-pre-line">{msg.text}</p>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex gap-2.5 flex-row">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-luxury/10 text-rose-luxury">
              <Bot size={14} />
            </div>
            <div className="rounded-2xl px-3.5 py-2.5 text-xs bg-gray-100 text-gray-400 dark:bg-slate-900 flex items-center gap-2 rounded-tl-none">
              <Loader2 size={12} className="animate-spin text-gold-500" />
              <span>Stylist is sketching coordinates...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick shortcuts */}
      <div className="px-4 py-2 bg-gray-50/50 dark:bg-slate-900/10 border-t border-gray-100 dark:border-slate-900 space-y-1.5 max-h-[140px] overflow-y-auto">
        <span className="text-[9px] uppercase font-bold tracking-widest text-gray-400">Ask senior designer:</span>
        <div className="flex flex-col gap-1">
          {presetQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleSendMessage(q)}
              className="w-full text-left font-sans text-[10px] text-gray-600 dark:text-gray-300 hover:text-gold-500 hover:underline flex items-center justify-between gap-2"
            >
              <span>{q}</span>
              <ArrowRight size={10} className="text-gray-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Input panel */}
      <div className="p-4 border-t border-gray-100 dark:border-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask styling, alterations, fabric guide..."
            className="flex-1 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs focus:outline-none focus:border-gold-300 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
          <button
            type="submit"
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-gold-400 text-white transition-colors hover:bg-gold-500 shadow-sm"
          >
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
};
