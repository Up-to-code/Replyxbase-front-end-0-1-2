"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X, MoreVertical, Clock, Plus, Smile } from "lucide-react";
import { useTranslations } from "next-intl";

const ChatWidget = () => {
    const t = useTranslations("Landing.Widget");
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string, timestamp?: Date}[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const suggestedQuestions = [
        t("question1"),
        t("question2"),
        t("question3"),
        t("question4")
    ];

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showMenu]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!inputValue.trim()) return;
        
        const userMsg = inputValue;
        setMessages(prev => [...prev, { role: 'user', text: userMsg, timestamp: new Date() }]);
        setInputValue("");
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            let response = t("aiResponseDefault");
            if (userMsg.toLowerCase().includes("pricing") || userMsg.toLowerCase().includes("plan")) {
                response = t("aiResponsePricing");
            } else if (userMsg.toLowerCase().includes("data") || userMsg.toLowerCase().includes("add")) {
                response = t("aiResponseData");
            } else if (userMsg.toLowerCase().includes("action") || userMsg.toLowerCase().includes("ai action")) {
                response = t("aiResponseActions");
            } else if (userMsg.toLowerCase().includes("whatsapp")) {
                response = t("aiResponseWhatsapp");
            }
            setMessages(prev => [...prev, { role: 'ai', text: response, timestamp: new Date() }]);
        }, 1500);
    };

    const formatTime = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        }).format(date);
    };

    return (
        <div className="fixed bottom-4 right-4 z-[2147483645] flex flex-col items-end gap-4 font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-2xl border-2 border-slate-200 w-[406px] h-[85vh] max-h-[824px] overflow-hidden flex flex-col"
                        style={{ zIndex: 2147483646 }}
                    >
                        {/* Modern Dark Header */}
                        <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 p-4 flex items-center justify-between border-b-2 border-zinc-700 relative">
                            <div className="flex items-center gap-3">
                                <motion.div 
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    className="w-9 h-9 bg-white rounded-xl flex items-center justify-center border-2 border-white"
                                >
                                    <span className="text-[#005bbc] font-bold text-base">R</span>
                                </motion.div>
                                <div>
                                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                                        {t("title")}
                                        <motion.span
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="w-1.5 h-1.5 bg-[#ffd600] rounded-full"
                                        />
                                    </h3>
                                    <p className="text-[10px] text-white/70 font-medium">{t("subtitle")}</p>
                                </div>
                            </div>
                            
                            {/* Enhanced Menu Button */}
                            <div className="relative" ref={menuRef}>
                                <motion.button 
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setShowMenu(!showMenu)}
                                    className="p-2 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-colors"
                                    aria-label="Menu"
                                >
                                    <MoreVertical className="w-5 h-5" />
                                </motion.button>
                                
                                {/* Enhanced Dropdown Menu */}
                                <AnimatePresence>
                                    {showMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute top-full right-0 mt-2 w-52 bg-white rounded-xl border-2 border-slate-200 overflow-hidden z-50"
                                        >
                                            <button
                                                onClick={() => {
                                                    setMessages([]);
                                                    setShowMenu(false);
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-[#005bbc]/5 transition-colors text-slate-700 border-b-2 border-slate-100"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-[#005bbc]/10 flex items-center justify-center border-2 border-[#005bbc]/20">
                                                    <Plus className="w-4 h-4 text-[#005bbc]" />
                                                </div>
                                                <span className="font-medium">{t("menu.newChat")}</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    setShowMenu(false);
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-red-50 transition-colors text-slate-700 border-b-2 border-slate-100"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center border-2 border-red-200">
                                                    <X className="w-4 h-4 text-red-600" />
                                                </div>
                                                <span className="font-medium">{t("menu.endChat")}</span>
                                            </button>
                                            <button
                                                onClick={() => setShowMenu(false)}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-[#005bbc]/5 transition-colors text-slate-700"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center border-2 border-slate-200">
                                                    <Clock className="w-4 h-4 text-slate-600" />
                                                </div>
                                                <span className="font-medium">{t("menu.recentChats")}</span>
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Enhanced Chat Area */}
                        <div className="flex-1 p-5 overflow-y-auto bg-gradient-to-b from-white to-slate-50/30 space-y-4 relative">
                            {messages.length === 0 && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-4"
                                >
                                    {/* Welcome Messages */}
                                    <motion.div 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="flex gap-3"
                                    >
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#005bbc] to-[#004a9f] flex items-center justify-center text-white text-sm font-bold shrink-0 border-2 border-white">
                                            R
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className="text-xs font-semibold text-slate-900">{t("title")}</span>
                                                <span className="text-[10px] text-slate-400">{formatTime(new Date())}</span>
                                            </div>
                                            <div className="bg-white p-4 rounded-2xl rounded-tl-none border-2 border-slate-200">
                                                <p className="text-sm text-slate-700 leading-relaxed">{t("welcome")}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                    
                                    <motion.div 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="flex gap-3"
                                    >
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#005bbc] to-[#004a9f] flex items-center justify-center text-white text-sm font-bold shrink-0 border-2 border-white">
                                            R
                                        </div>
                                        <div className="flex-1">
                                            <div className="bg-white p-4 rounded-2xl rounded-tl-none border-2 border-slate-200">
                                                <p className="text-sm text-slate-700 leading-relaxed">{t("welcome2")}</p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Enhanced Suggested Questions */}
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="grid grid-cols-1 gap-2.5 pt-2"
                                    >
                                        {suggestedQuestions.map((question, idx) => (
                                            <motion.button
                                                key={idx}
                                                whileHover={{ scale: 1.02, x: 4 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => {
                                                    setInputValue(question);
                                                    setTimeout(() => handleSend(), 100);
                                                }}
                                                className="text-left px-4 py-3 bg-white hover:bg-[#005bbc]/5 rounded-xl border-2 border-slate-200 hover:border-[#005bbc]/30 transition-all text-sm text-slate-700 font-medium hover:border-[#005bbc]"
                                            >
                                                {question}
                                            </motion.button>
                                        ))}
                                    </motion.div>
                                </motion.div>
                            )}
                            
                            {messages.map((msg, i) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    key={i} 
                                    className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {msg.role === 'ai' && (
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#005bbc] to-[#004a9f] flex items-center justify-center text-white text-sm font-bold shrink-0 border-2 border-white">
                                            R
                                        </div>
                                    )}
                                    <div className="flex flex-col max-w-[75%]">
                                        <div 
                                            className={`p-3.5 text-sm leading-relaxed rounded-2xl border-2 ${
                                                msg.role === 'user' 
                                                    ? 'bg-gradient-to-br from-[#005bbc] to-[#004a9f] text-white rounded-br-none border-[#005bbc]' 
                                                    : 'bg-white text-slate-800 rounded-bl-none border-slate-200'
                                            }`}
                                        >
                                            {msg.text}
                                        </div>
                                        {msg.timestamp && (
                                            <span className={`text-[10px] text-slate-400 mt-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                                                {formatTime(msg.timestamp)}
                                            </span>
                                        )}
                                    </div>
                                    {msg.role === 'user' && (
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#005bbc] to-[#004a9f] flex items-center justify-center text-white text-sm font-bold shrink-0 border-2 border-white">
                                            U
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                            
                            {isTyping && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start gap-3"
                                >
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#005bbc] to-[#004a9f] flex items-center justify-center text-white text-sm font-bold shrink-0 border-2 border-white">
                                        R
                                    </div>
                                    <div className="bg-white p-3.5 rounded-2xl rounded-bl-none flex gap-1.5 border-2 border-slate-200">
                                        <motion.span 
                                            animate={{ y: [0, -4, 0] }}
                                            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                            className="w-2 h-2 bg-[#005bbc] rounded-full"
                                        />
                                        <motion.span 
                                            animate={{ y: [0, -4, 0] }}
                                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                            className="w-2 h-2 bg-[#005bbc] rounded-full"
                                        />
                                        <motion.span 
                                            animate={{ y: [0, -4, 0] }}
                                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                            className="w-2 h-2 bg-[#005bbc] rounded-full"
                                        />
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Powered By - Enhanced */}
                        {messages.length === 0 && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                                className="px-5 pb-3 flex items-center gap-2 text-xs text-slate-400"
                            >
                                <span>©</span>
                                <span>{t("poweredBy")}</span>
                                <span className="font-bold text-[#005bbc]">Replyxbase</span>
                                <motion.div 
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.5 }}
                                    className="w-4 h-4 bg-gradient-to-br from-[#005bbc] to-[#004a9f] rounded flex items-center justify-center border border-[#005bbc]"
                                >
                                    <span className="text-white text-[8px] font-bold">R</span>
                                </motion.div>
                            </motion.div>
                        )}

                        {/* Enhanced Privacy Notice */}
                        <AnimatePresence>
                            {showPrivacy && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="px-5 py-3 bg-gradient-to-r from-slate-50 to-slate-100 border-t-2 border-slate-200 flex items-center justify-between overflow-hidden"
                                >
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        {t("privacy.text")}{" "}
                                        <a href="#" className="underline text-[#005bbc] hover:text-[#004a9f] font-semibold">{t("privacy.link")}</a>.
                                    </p>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setShowPrivacy(false)}
                                        className="p-1 hover:bg-slate-200 rounded-lg transition-colors shrink-0 ml-2"
                                        aria-label="Dismiss"
                                    >
                                        <X className="w-3.5 h-3.5 text-slate-500" />
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Enhanced Input Area */}
                        <div className="p-4 bg-white border-t-2 border-slate-200">
                            <form 
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="relative flex items-center gap-2"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    type="button"
                                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors shrink-0 border-2 border-transparent hover:border-slate-200"
                                    aria-label="Emoji"
                                >
                                    <Smile className="w-5 h-5 text-slate-400" />
                                </motion.button>
                                <input 
                                    type="text" 
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder={t("placeholder")}
                                    className="flex-1 bg-slate-50 border-2 border-slate-200 text-sm text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#005bbc]/20 focus:border-[#005bbc] transition-all placeholder:text-slate-400"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend();
                                        }
                                    }}
                                />
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    disabled={!inputValue.trim()}
                                    className="p-2.5 bg-gradient-to-br from-[#005bbc] to-[#004a9f] rounded-xl text-white hover:from-[#004a9f] hover:to-[#003d7a] transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-[#005bbc] shrink-0"
                                    aria-label="Send"
                                >
                                    <Send className="w-4 h-4" />
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modern Launcher Button */}
            <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                    setIsOpen(!isOpen);
                    setShowMenu(false);
                }}
                className="w-[55px] h-[55px] bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-full flex items-center justify-center text-white hover:from-zinc-800 hover:to-zinc-700 transition-all border-2 border-zinc-900 relative group"
                style={{ 
                    zIndex: 2147483645,
                    borderRadius: '27.5px'
                }}
                aria-label="Open chat"
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                        >
                            <X className="w-6 h-6" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="open"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            className="relative"
                        >
                            <MessageCircle className="w-6 h-6" />
                            <motion.span 
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute -top-1 -right-1 w-4 h-4 bg-[#ffd600] rounded-full border-2 border-white"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
};

export default ChatWidget;
