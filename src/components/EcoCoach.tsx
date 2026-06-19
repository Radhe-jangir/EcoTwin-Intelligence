import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, Send, X, ArrowLeft, RefreshCw, Cpu, Bot, HelpCircle, Bot as CoachIcon, Compass
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface EcoCoachProps {
  onSendMessage: (msg: string, history: Message[]) => Promise<string>;
}

export default function EcoCoach({ onSendMessage }: EcoCoachProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I am CarbonTwin's conversational life-cycle auditor. Ask me anything about the emissions of daily foods, HVAC optimizations, or custom converters!" }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  
  const threadEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (threadEndRef.current) {
      threadEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || loading) return;

    const userText = inputVal;
    setInputVal('');
    
    // Append user message
    const updatedMessages = [...messages, { role: 'user', content: userText } as Message];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const gResult = await onSendMessage(userText, updatedMessages);
      setMessages(prev => [...prev, { role: 'assistant', content: gResult }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: "Mlopps telemetry connection lost. Check server status." }]);
    } finally {
      setLoading(false);
    }
  };

  const loadPresetQuery = (p: string) => {
    setInputVal(p);
  };

  return (
    <>
      {/* Floating button trigger */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 px-5 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black rounded-2xl shadow-2xl shadow-emerald-500/20 transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/40 inline-flex items-center gap-2 font-semibold text-sm backdrop-blur-xl"
        >
          <MessageSquare className="w-5 h-5" /> Ask Eco Coach
        </button>
      )}

      {/* Slide-out coach panel drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full sm:w-[480px] h-[750px] bg-zinc-950/95 backdrop-blur-xl border border-emerald-500/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col font-mono text-xs text-gray-100 animate-fade-in">
          
          {/* Header */}
          <div className="p-4 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shadow-lg shadow-emerald-500/20">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-white font-bold leading-none">CarbonTwin Coach - AI POWERED</h4>
                <span className="text-[9px] text-zinc-500">CONVERSATIONAL CLOUD ANALYST</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 px-2 rounded hover:bg-zinc-900 text-zinc-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick presets helper */}
          <div className="p-3 border-b border-zinc-900 bg-zinc-950/60 overflow-x-auto flex gap-1.5 select-none shrink-0 scrollbar-none">
            {[
              "Reduce my carbon footprint",
              "Explain sustainability score",
              "How do solar panels help?",
              "Ask me anything"
            ].map((p, i) => (
              <button 
                key={i} 
                onClick={() => loadPresetQuery(p)}
                className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-855 border border-zinc-800 text-zinc-400 hover:text-white transition shrink-0 font-sans text-[10px]"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Messages scroll thread */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-black/20">
            {messages.map((m, idx) => (
              <div 
                key={idx}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-xl p-3 leading-normal border font-sans ${m.role === 'user' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' : 'bg-zinc-900/80 border-zinc-700 text-zinc-200 backdrop-blur-md'}`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-zinc-900 border border-zinc-855 text-zinc-500 rounded-xl p-3 flex items-center gap-2 font-mono">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Thinking....
                </div>
              </div>
            )}
            <div ref={threadEndRef} />
          </div>

          {/* Input control area */}
          <form onSubmit={handleSend} className="p-3 bg-black border-t border-zinc-900 flex gap-2">
            <input 
              type="text" 
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask anything about sustainability, AI, coding, careers..."
              className="flex-1 bg-zinc-900/80 border border-zinc-700 focus:border-emerald-500/60 rounded-xl px-3.5 py-2 text-zinc-300 focus:outline-none focus:border-emerald-500 max-h-12"
            />
            <button 
              type="submit"
              disabled={loading || !inputVal.trim()}
              className="p-2.5 bg-emerald-500 text-zinc-950 font-extrabold rounded-xl hover:bg-emerald-400 transition hover:scale-102 flex items-center justify-center disabled:opacity-40 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
